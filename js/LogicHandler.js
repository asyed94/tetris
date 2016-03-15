// LogicHandler class extends GameObject
Tetris.LogicHandler = function(game, allPossiblePieces, initStepDuration) {
	// Properties
	Tetris.GameObject.call(this, game);
	// boolean; Is the game over?
	this.gameOver = false;
	// num; The duration in milliseconds between game steps.
	this.stepDuration = initStepDuration;
	// Phaser.Timer; The timer that determines the length of each game step.
	this.timer = this.game.time.create(false);
	this.timer.loop(this.stepDuration, this.executeStep, this);
	// ShapeInfo[]; Holds ShapeInfo objects for all possible types of Pieces in the game.
	this.allPossiblePieces = allPossiblePieces;
	// Piece; The current, actively-falling piece.
	this.currentPiece = undefined;
	// Piece; The next piece to drop once the current piece has settled.
	this.nextPiece = undefined;
	// Block[]; Holds all Block objects on the game board that are not part of the currentPiece. Once current piece has settled, its blocks get added too.
	this.blocks = [];
	// num; Number of time steps elapsed since the start of the game.
	this.numOfTimeSteps = 0;
	// num; The current player score.
	this.score = 0;
	// num; The total number of rows in the game board.
	this.numOfRows = 20;
	// num; The total number of columns in the game board.
	this.numOfColumns = 10;
};
// Methods
Tetris.LogicHandler.prototype = Object.create(Tetris.GameObject.prototype);
Tetris.LogicHandler.prototype.constructor = Tetris.LogicHandler;
// void: Starts the timer to call executeStep every stepDuration seconds.
Tetris.LogicHandler.prototype.start = function() {
	this.timer.start();
};
// void: Resumes the timer event if it was stopped.
Tetris.LogicHandler.prototype.resume = function() {
	this.timer.resume();
};
// void: Pauses the timer.
Tetris.LogicHandler.prototype.stop = function() {
	this.timer.stop();
};
// void: Removes all events on the timer. Sets this.stepDuration to a new value. Adds a new loop event to the timer.
Tetris.LogicHandler.prototype.setStepDuration = function(milliseconds) {
	this.timer.removeAll();
	this.stepDuration = milliseconds;
	this.timer.loop(this.stepDuration, this.executeStep, this);
};
// void: Executes 1 time step of the game.
Tetris.LogicHandler.prototype.executeStep = function() {
	var pieceBlocks;

	// Move gravitized blocks down
	if (this.moveGravitizedBlocks()) {
		// Check if a ground breach has occured.
		if (this.checkBoundries() == "ground") {
			// Move piece up, settle it, and drop a new piece
			this.currentPiece.moveUp();
			pieceBlocks = this.currentPiece.settle();
			for (block in pieceBlocks) {
				this.blocks.push(pieceBlocks[block]);
			}
			this.removeFilledRows();
			this.dropPiece();
			if (this.checkCollisions()) {
				this.stop();
				this.gameOver = true;
			}
		}
		// Check if a piece collision has occured.
		else if (this.checkCollisions()) {
			// Move piece up, settle it, and drop a new piece
			this.currentPiece.moveUp();
			pieceBlocks = this.currentPiece.settle();
			for (block in pieceBlocks) {
				this.blocks.push(pieceBlocks[block]);
			}
			this.removeFilledRows();
			this.dropPiece();
			if (this.checkCollisions()) {
				this.stop();
				this.gameOver = true;
			}
		}
		// Otherwise, re-gravitate currentPiece
		else {
			this.currentPiece.setGravitized(true);
		}

		// Increment the time step counter
		this.numOfTimeSteps ++;

		// Update sprites
		this.updateAllGameObjects();
		return;
	}
	// Or, Drop a new piece
	else {
		this.dropPiece();
		if (this.checkCollisions()) {
			this.stop();
			this.gameOver = true;
		}
		this.numOfTimeSteps ++;
		this.updateAllGameObjects();
		return;
	}
};
// boolean: Checks for completed rows, and flags all blocks in row to be removed. Returns true if a completed row was found.
Tetris.LogicHandler.prototype.removeFilledRows = function() {
	var removed, currentBlock, currentIdx;
	var rowTotals = [];
	var filledRowIdxs = [];

	// Count the number of blocks in each row
	for (block in this.blocks) {
		if (rowTotals[this.blocks[block].gamePosY] == undefined) {
			rowTotals[this.blocks[block].gamePosY] = 1;
		}
		else {
			rowTotals[this.blocks[block].gamePosY] ++;
		}
	}

	// Get the row numbers of all filled rows
	for (row in rowTotals) {
		if (rowTotals[row] == this.numOfColumns) {
			filledRowIdxs.push(row);
		}
	}

	// If there are filled rows...
	if (filledRowIdxs.length > 0) {
		// Loop through all this.blocks...
		for (block in this.blocks) {
			currentBlock = this.blocks[block];
			// Loop through all filledRowIdxs...
			for (idx in filledRowIdxs) {
				currentIdx = filledRowIdxs[idx];
				// If current blocks gamePosY < current idx...
				if (currentBlock.gamePosY < currentIdx) {
					// Move the block down 1 space
					currentBlock.moveDown();
				}
				// Else, If current blocks gamePosY == current idx...
				else if (currentBlock.gamePosY == currentIdx) {
					// Mark the block for removal
					currentBlock.markForRemoval();
					// Set removed to true
					removed = true;
				}
			}
		}
	}

	return removed;
};
// boolean: Moves gravitized blocks down 1 game unit.
Tetris.LogicHandler.prototype.moveGravitizedBlocks = function() {
	var moved = false;

	// Move gravitized settled blocks
	for (block in this.blocks) {
		if (this.blocks[block].isGravitized) {
			this.blocks[block].moveDown();
			this.blocks[block].isGravitized = false;
			moved = true;
		}
	}
	// Move gravitized currentPiece
	if (this.currentPiece != undefined && this.currentPiece.isGravitized) {
		this.currentPiece.moveDown();
		this.currentPiece.setGravitized(false);
		moved = true;
	}

	return moved;
};
// void : Drops a new Piece.
Tetris.LogicHandler.prototype.dropPiece = function() {
	// Create new piece off-screen
	if (this.currentPiece == undefined) {
		// Pick a random one
		this.currentPiece = new Tetris.Piece(this.game, this.pickRandomPiece(), 4, -4, "UP", true);
	}
	else {
		// Use the nextPiece ShapeInfo to make currentPiece
		this.currentPiece = new Tetris.Piece(this.game, this.nextPiece, 4, -4, "UP", true);
	}

	// Push it into the screen
	while (this.checkBoundries() != "none") {
		this.currentPiece.moveDown();
	}

	// Pick a new nextPiece
	this.nextPiece = this.pickRandomPiece();
};
// void: Update all GameObjects on the board.
Tetris.LogicHandler.prototype.updateAllGameObjects = function() {
	// Update this.blocks
	for (block in this.blocks) {
		this.blocks[block].update();
	}
	// Splice removed blocks from this.blocks
	for (i = this.blocks.length - 1; i >= 0; i --) {
		if (this.blocks[i].isRemoved) { this.blocks.splice(i, 1); }
	}
	// Update this.currentPiece
	if (this.currentPiece != undefined) { this.currentPiece.update(); }
};
// ShapeInfo: Returns ShapeInfo for a randomly selected Piece from this.allPossiblePieces.
Tetris.LogicHandler.prototype.pickRandomPiece = function() { 
	return this.allPossiblePieces[Math.floor(Math.random() * this.allPossiblePieces.length)];
};
// string: Check if a block has breached the game board boundries. Returns "none" if no boundries breached. Returns "left" if left boundry breached. Returns "right" if right boundry breached. Returns "ground" if ground is breached. Returns "ceiling" if ceiling is breached.
Tetris.LogicHandler.prototype.checkBoundries = function() {
	var breached, thisBlock;

	breached = "none";
	for (block in this.currentPiece.blocks) {
		thisBlock = this.currentPiece.blocks[block];
		if (thisBlock.gamePosX < 0) {
			breached = "left";
		}
		else if (thisBlock.gamePosX > this.numOfColumns - 1) {
			breached = "right";
		}
		else if (thisBlock.gamePosY < 0) {
			breached = "ceiling";
		}
		else if (thisBlock.gamePosY > this.numOfRows - 1) {
			breached = "ground";
		}
	}

	return breached;
};
// boolean: Returns true if any Blocks in currentPiece are overlapping any Blocks in this.blocks, otherwise returns false.
Tetris.LogicHandler.prototype.checkCollisions = function() {
	var currentPieceBlock, stationaryBlock, collided;
	collided = false;

	for (block1 in this.currentPiece.blocks) {
		currentPieceBlock = this.currentPiece.blocks[block1];
		for (block2 in this.blocks) {
			stationaryBlock = this.blocks[block2];
			if (currentPieceBlock.gamePosX == stationaryBlock.gamePosX && currentPieceBlock.gamePosY == stationaryBlock.gamePosY) {
				collided = true;
			}
		}
	}

	return collided;
};
