// Define game classes here

// GameObject class
Tetris.GameObject = function(game) {
	// Properties
	this.game = game;
};
// Methods
Tetris.GameObject.prototype.gamePosToCoord = function(gamePos) {
	return ((gamePos * 1.5 * 16) + 1);
};
Tetris.GameObject.prototype.coordToGamePos = function(coord) {
	return ((coord - 1) / (1.5 * 16));
};

// Block class extends GameObject
Tetris.Block = function(game, gamePosX, gamePosY, color, initGravitation) {
	// Properties
	Tetris.GameObject.call(this, game);
	// Phaser.Sprite; Phaser Sprite object associated with this block.
	this.sprite = this.game.add.sprite(this.gamePosToCoord(gamePosX), this.gamePosToCoord(gamePosY), color);
	this.sprite.scale = new PIXI.Point(1.5, 1.5);
	// num; Horizontal position of this block on the game board in block units. 0 is the left most position.
	this.gamePosX = gamePosX; 
	// num; Vertical position of this block on the game board in block units. 0 is the top most position.
	this.gamePosY = gamePosY; 
	// boolean;  Will gravity pull down this block by 1 unit in the next time step?
	this.isGravitized = initGravitation;
	// boolean; Will this block be removed from the game in the next time step? Init to false.
	this.isRemoved = false;
};
// Methods
Tetris.Block.prototype = Object.create(Tetris.GameObject.prototype);
// void: Moves this block up by 1 game unit.
Tetris.Block.prototype.moveUp = function() {
	this.gamePosY -= 1;
}
// void: Moves this block down by 1 game unit.
Tetris.Block.prototype.moveDown = function() {
	this.gamePosY += 1;
}
// void: Moves this block right by 1 game unit.
Tetris.Block.prototype.moveRight = function() {
	this.gamePosX += 1;
}
// void: Moves this block left by 1 game unit.
Tetris.Block.prototype.moveLeft = function() {
	this.gamePosX -= 1;
}
// void: Apply this block's game properties to its sprite.
Tetris.Block.prototype.update = function() {
	this.sprite.x = this.gamePosToCoord(this.gamePosX);
	this.sprite.y = this.gamePosToCoord(this.gamePosY);

	// If this block is to be removed, destroy it
	if (this.isRemoved) { this.destroy(); }
}
// void: Destroy the block
Tetris.Block.prototype.destroy = function() {
	// Destroy the associated sprite
	this.sprite.destroy();
}

// Piece class extends GameObject
Tetris.Piece = function(game, shapeInfo, gamePosX, gamePosY, initOrientation, initGravitation) {
	// Properties
	Tetris.GameObject.call(this, game);
	// Block[]; Holds all blocks that belong to this piece.
	this.blocks = [];
	// ShapeInfo; An object that contains all shape information for the piece. See planning.txt for details.
	this.shapeInfo = shapeInfo;
	// string; The current orientation of the piece.
	this.currentOrientation = initOrientation;
	// num; Horizontal position of the top-left block of this piece on the game board in block units. 0 is the left most position.
	this.gamePosX = gamePosX;
	// num; Vertical position of the top-left block of this piece on the game board in block units. 0 is the top most position.
	this.gamePosY = gamePosY;
	// boolean;  Will gravity pull down all blocks in this piece by 1 unit in the next time step?
	this.isGravitized = initGravitation;

	// Create blocks for the current orientation in the this.shapeInfo object.
	this.remakeBlocks();
};
// Methods
Tetris.Piece.prototype = Object.create(Tetris.GameObject.prototype);
Tetris.Piece.prototype.constructor = Tetris.Piece;
// void: Refresh this Piece's Blocks by deleting them then creating them anew.
Tetris.Piece.prototype.remakeBlocks = function() {
	var gridWidth, gridLength, relevantBlockArray, arrayLen, globalBlockX, globalBlockY, blockColor, newBlock;

	// Destroy all Blocks in this.blocks[]
	for (block in this.blocks) {
		this.blocks[block].destroy();
	}
	this.blocks = [];

	// Create and position Blocks from the 2D array describing the currentOrientation.
	gridWidth = this.shapeInfo.gridWidth;
	gridLength = this.shapeInfo.gridLength;
	relevantBlockArray = this.shapeInfo.orientation[this.currentOrientation];
	arrayLen = relevantBlockArray.length;

	// For each block in the relevantBlockArray...
	for (i = 0; i < arrayLen; i ++) {
		// No block if it's a 0
		if (relevantBlockArray[i] == 0) { continue; }
		else {
			// Get the blocks global position
			globalBlockX = this.gamePosX + (i % gridWidth);
			globalBlockY = this.gamePosY + (Math.floor(i / gridLength));

			// Get the blocks color
			switch (relevantBlockArray[i]) {
				case 1:
					blockColor = "red-block-img";
					break;
				case 2:
					blockColor = "orange-block-img";
					break;
				case 3:
					blockColor = "yellow-block-img";
					break;
				case 4:
					blockColor = "green-block-img";
					break;
				case 5:
					blockColor = "blue-block-img";
					break;
				case 6:
					blockColor = "violet-block-img";
					break;
			}

			// Create the Block and add it to this.blocks
			newBlock = new Tetris.Block(this.game, globalBlockX, globalBlockY, blockColor, this.isGravitized);
			this.blocks.push(newBlock);
		}
	}
}
// void: Moves all blocks in this piece up by 1 game unit.
Tetris.Piece.prototype.moveUp = function() {
	this.gamePosY -= 1;
	for (block in this.blocks) {
		this.blocks[block].moveUp();
	}
};
// void: Moves all blocks in this piece down by 1 game unit.
Tetris.Piece.prototype.moveDown = function() {
	this.gamePosY += 1;
	for (block in this.blocks) {
		this.blocks[block].moveDown();
	}
};
// void: Moves all blocks in this piece right by 1 game unit.
Tetris.Piece.prototype.moveRight = function() {
	this.gamePosX += 1;
	for (block in this.blocks) {
		this.blocks[block].moveRight();
	}
};
// void: Moves all blocks in this piece left by 1 game unit.
Tetris.Piece.prototype.moveLeft = function() {
	this.gamePosX -= 1;
	for (block in this.blocks) {
		this.blocks[block].moveLeft();
	}
};
// void: Cycles the Piece's currentOrientation (UP, RIGHT, DOWN, LEFT) to the left.
Tetris.Piece.prototype.rotateLeft = function() {
	var orientationCycle = {
		UP: "LEFT",
		RIGHT: "UP",
		DOWN: "RIGHT",
		LEFT: "DOWN"
	};

	this.currentOrientation = orientationCycle[this.currentOrientation];

	this.remakeBlocks();
};
// void: Cycles the Piece's currentOrientation (UP, RIGHT, DOWN, LEFT) to the right.
Tetris.Piece.prototype.rotateRight = function() {
	var orientationCycleRight = {
		UP: "RIGHT",
		RIGHT: "DOWN",
		DOWN: "LEFT",
		LEFT: "UP"
	};

	this.currentOrientation = orientationCycleRight[this.currentOrientation];

	this.remakeBlocks();
};
// void: Apply this Piece's game properties to its block's sprites.
Tetris.Piece.prototype.update = function() {
	for (block in this.blocks) {
		this.blocks[block].isGravitized = this.isGravitized;
		this.blocks[block].update();
	}
};
// void: Sets isGravitized for all Block objects in this Piece to given value.
Tetris.Piece.prototype.setGravitized = function(value) {
	// Set the pieces isGravitized to value
	this.isGravitized = value;
	// Apply it to all this.blocks
	this.update();
};
// Block[]: Sets isGravitized for all Block objects in this Piece to false. Empties and returns its Blocks.
Tetris.Piece.prototype.settle = function() {
	var myBlocks = [];

	// Set all this.currentPiece.blocks.isGravitized to false
	this.isGravitized = false;
	this.update();

	// Empty and return them
	for (block in this.blocks) {
		myBlocks.push(this.blocks[block]);
	}
	this.blocks = [];
	return myBlocks;
};


// LogicHandler class extends GameObject
Tetris.LogicHandler = function(game, allPossiblePieces, initStepDuration) {
	// Properties
	Tetris.GameObject.call(this, game);
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

	// Remove filled rows
	if (this.removeFilledRows()) {
		this.updateAllGameObjects();
		this.numOfTimeSteps ++;
		return;
	}
	// Or, Move gravitized blocks down
	else if (this.moveGravitizedBlocks()) {
		// Check if a ground breach has occured.
		if (this.checkBoundries() == "ground") {
			// Move piece up, settle it, and drop a new piece
			this.currentPiece.moveUp();
			pieceBlocks = this.currentPiece.settle();
			for (block in pieceBlocks) {
				this.blocks.push(pieceBlocks[block]);
			}
			this.dropPiece();
		}
		// Check if a piece collision has occured.
		else if (this.checkCollisions()) {
			// Move piece up, settle it, and drop a new piece
			this.currentPiece.moveUp();
			pieceBlocks = this.currentPiece.settle();
			for (block in pieceBlocks) {
				this.blocks.push(pieceBlocks[block]);
			}
			this.dropPiece();
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
		this.numOfTimeSteps ++;
		return;
	}
};
// boolean: Checks for completed rows, and flags all blocks in row to be removed. Returns true if a completed row was found.
Tetris.LogicHandler.prototype.removeFilledRows = function() {
	// Keep a running total of how many blocks are in a given row
	var removed, rowTotals;
	removed = false;
	rowTotals = [];

	for (block in this.blocks) {
		rowTotals[this.blocks[block].gamePosY] += 1;
	}
	for (row in rowTotals) {
		// If any of the rowTotals == this.numOfColumns...
		if (rowTotals[row] == this.numOfColumns) {
			// Mark the blocks in that row for removal.	
			for (block in this.blocks) {
				if (this.blocks[block].gamePosY == row) {
					this.blocks[block].isRemoved = true;
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
	if (this.currentPiece == undefined) {
		this.currentPiece = new Tetris.Piece(this.game, this.pickRandomPiece(), 4, 0, "UP", true);
		this.nextPiece = this.pickRandomPiece();
	}
	else {
		this.currentPiece = new Tetris.Piece(this.game, this.nextPiece, 4, 0, "UP", true);
		this.nextPiece = this.pickRandomPiece();
	}
};
// void: Update all GameObjects on the board.
Tetris.LogicHandler.prototype.updateAllGameObjects = function() {
	// Update this.blocks
	for (block in this.blocks) {
		this.blocks[block].update();
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

// Game class: Its functions (init, preload, create, etc.) are called by the Phaser State Manager
Tetris.Game = function(game) {
};
// Called by the State Manager before anything else.
Tetris.Game.prototype.init = function() {
};
// Called by the State Manager after init and before create.
Tetris.Game.prototype.preload = function() {
	// Create a ShapeInfo[] that contains all standard tetris piece shapes
	this.standardTetrisPieces = [
		// The I piece
		{
			gridWidth: 4,
			gridLength: 4,
			orientation: {
				UP:	[ 0, 1, 0, 0,
					  0, 1, 0, 0,
					  0, 1, 0, 0,
					  0, 1, 0, 0 ],

				RIGHT: [ 0, 0, 0, 0,
					     1, 1, 1, 1,
					     0, 0, 0, 0,
					     0, 0, 0, 0 ],

				DOWN: [ 0, 0, 1, 0,
					    0, 0, 1, 0,
					    0, 0, 1, 0,
					    0, 0, 1, 0 ],

				LEFT: [ 0, 0, 0, 0,
					    0, 0, 0, 0,
					    1, 1, 1, 1,
					    0, 0, 0, 0 ]
			}
		},
		// The L piece
		{
			gridWidth: 3,
			gridLength: 3,
			orientation: {
				UP:	[ 0, 2, 0,
					  0, 2, 0,
					  0, 2, 2 ],

				RIGHT:	[ 0, 0, 0,
					      2, 2, 2,
					      2, 0, 0 ],

				DOWN:	[ 2, 2, 0,
					      0, 2, 0,
					      0, 2, 0 ],

				LEFT:	[ 0, 0, 2,
					      2, 2, 2,
					      0, 0, 0 ]
			}
		},
		// The J piece
		{
			gridWidth: 3,
			gridLength: 3,
			orientation: {
				UP:	[ 0, 3, 0,
					  0, 3, 0,
					  3, 3, 0 ],

				RIGHT:	[ 3, 0, 0,
					      3, 3, 3,
					      0, 0, 0 ],

				DOWN:	[ 0, 3, 3,
					      0, 3, 0,
					      0, 3, 0 ],

				LEFT:	[ 0, 0, 0,
					      3, 3, 3,
					      0, 0, 3 ]
			}
		},
		// The S piece
		{
			gridWidth: 3,
			gridLength: 3,
			orientation: {
				UP:	[ 0, 0, 0,
					  0, 4, 4,
					  4, 4, 0 ],

				RIGHT:	[ 0, 4, 0,
					      0, 4, 4,
					      0, 0, 4 ],

				DOWN:	[ 0, 4, 4,
					      4, 4, 0,
					      0, 0, 0 ],

				LEFT:	[ 4, 0, 0,
					      4, 4, 0,
					      0, 4, 0 ]
			}
		},
		// The Z piece
		{
			gridWidth: 3,
			gridLength: 3,
			orientation: {
				UP:	[ 0, 0, 0,
					  5, 5, 0,
					  0, 5, 5 ],

				RIGHT:	[ 0, 0, 5,
					      0, 5, 5,
					      0, 5, 0 ],

				DOWN:	[ 5, 5, 0,
					      0, 5, 5,
					      0, 0, 0 ],

				LEFT:	[ 0, 5, 0,
					      5, 5, 0,
					      5, 0, 0 ]
			}
		},
		// The O piece
		{
			gridWidth: 2,
			gridLength: 2,
			orientation: {
				UP:	[ 6, 6,
					  6, 6 ],

				RIGHT:	[ 6, 6,
					      6, 6 ],

				DOWN:	[ 6, 6,
					      6, 6 ],

				LEFT:	[ 6, 6,
					      6, 6 ]
			}
		},
	];

	// Create the logic handler
	this.logic = new Tetris.LogicHandler(this.game, this.standardTetrisPieces, 500);

	// Load image assets
	this.load.image("divider-img", "../assets/divider.png")
	this.load.image("score-label-img", "../assets/score-label.png")
	this.load.image("next-label-img", "../assets/next-label.png")
	this.load.image("red-block-img", "../assets/red-block.png")
	this.load.image("orange-block-img", "../assets/orange-block.png")
	this.load.image("yellow-block-img", "../assets/yellow-block.png")
	this.load.image("green-block-img", "../assets/green-block.png")
	this.load.image("blue-block-img", "../assets/blue-block.png")
	this.load.image("violet-block-img", "../assets/violet-block.png")
};
// Called by the State Manager after init and preload.
Tetris.Game.prototype.create = function() {
	// Create the divider sprite
	var divider = this.game.add.sprite(241.5, 0, "divider-img");
	divider.scale = new PIXI.Point(1.5, 1.5);
	divider.anchor = new PIXI.Point(0, 0);
	this.game.physics.arcade.enable(divider);

	// Create "Next" label
	var nextLabel = this.game.add.sprite(312, 39, "next-label-img");
	nextLabel.scale = new PIXI.Point(1.5, 1.5);
	nextLabel.anchor = new PIXI.Point(0.5, 0.5);

	// Create "Score" label
	var scoreLabel = this.game.add.sprite(312, 411, "score-label-img");
	scoreLabel.scale = new PIXI.Point(1.5, 1.5);
	scoreLabel.anchor = new PIXI.Point(0.5, 0.5);

	// Create event handler for user input
	this.game.input.keyboard.onDownCallback = function(e) {
		var breachedWall;

		switch (e.keyCode) {
			case Phaser.Keyboard.UP:
				this.logic.currentPiece.rotateRight();
				// If the rotation breaches a boundry, move the piece to correct it. In Tetris terms, perform a "wall kick".
				while (this.logic.checkBoundries() != "none") {
					if (this.logic.checkBoundries() == "left") {
						this.logic.currentPiece.moveRight();
					}
					if (this.logic.checkBoundries() == "right") {
						this.logic.currentPiece.moveLeft();
					}
				}
				// If the rotation causes a block collision, undo the rotation.
				if (this.logic.checkCollisions()) {
					this.logic.currentPiece.rotateLeft();
				}
				this.logic.updateAllGameObjects();
				break;
			case Phaser.Keyboard.RIGHT:
				this.logic.currentPiece.moveRight();
				// If the movement breaches a boundry, undo it.
				if (this.logic.checkBoundries() == "right") {
					this.logic.currentPiece.moveLeft();
				}
				// If this movement causes a block collision, undo it.
				if (this.logic.checkCollisions()) {
					this.logic.currentPiece.moveLeft();
				}
				this.logic.updateAllGameObjects();
				break;
			case Phaser.Keyboard.DOWN:
				this.logic.executeStep();
				break;
			case Phaser.Keyboard.LEFT:
				this.logic.currentPiece.moveLeft();
				// If the movement breaches a boundry, undo it.
				if (this.logic.checkBoundries() == "left") {
					this.logic.currentPiece.moveRight();
				}
				// If this movement causes a block collision, undo it.
				if (this.logic.checkCollisions()) {
					this.logic.currentPiece.moveRight();
				}
				this.logic.updateAllGameObjects();
				break;
		}
	}.bind(this);

	// Start the game
	this.logic.start();
};
// Called by World.update ~60hz.
Tetris.Game.prototype.update = function() {
};
