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
Tetris.Block.prototype.constructor = Tetris.Block;
// Destroy the block
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
	// boolean; Will all blocks in this piece be removed from the game in the next time step? Init to false.
	this.isRemoved = false;

	// Create blocks for the current orientation using the ShapeInfo object.
};
// Methods
Tetris.Piece.prototype = Object.create(Tetris.GameObject.prototype);
Tetris.Piece.prototype.constructor = Tetris.Piece;
// Refresh this Piece's Blocks by deleting them then creating them anew.
Tetris.Piece.prototype.remakeBlocks = function() {
	var currentBlock, gridWidth, gridLength, relevantBlockArray, arrayLen, globalBlockX, globalBlockY, blockColor, newBlock;

	// Destroy all Blocks in this.blocks[]
	for (block in this.blocks) {
		currentBlock = this.blocks[block];
		currentBlock.destroy();
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
			newBlock = new Tetris.Block(this.game, this.gamePosToCoord(globalBlockX), this.gamePosToCoord(globalBlockY), this.isGravitized);
			this.blocks.push(newBlock);
		}
	}
}
Tetris.Piece.prototype.moveDown = function() { // void: Moves all blocks in this piece down by 1 game unit.
};
Tetris.Piece.prototype.moveRight = function() { // void: Moves all blocks in this piece right by 1 game unit.
};
Tetris.Piece.prototype.moveLeft = function() { // void: Moves all blocks in this piece left by 1 game unit.
};
Tetris.Piece.prototype.rotate = function() { // void: Cycles the Piece's currentOrientation (UP, RIGHT, DOWN, LEFT).
};
Tetris.Piece.prototype.settle = function() { // Block[]: Makes the Piece stationary, empties and returns its blocks.
};


// LogicHandler class extends GameObject
Tetris.LogicHandler = function(shapeInfoArray) {
	// Properties
	Tetris.GameObject.call(this, game);

	// ShapeInfo[]; Holds ShapeInfo objects for all possible types of Pieces in the game.
	this.allPossiblePieces = shapeInfoArray;
	// Piece; The current, actively-falling piece.
	this.currentPiece
	// Piece; The next piece to drop once the current piece has settled.
	this.nextPiece
	// Block[]; Holds all Block objects on the game board that are not part of the currentPiece. Once current piece has settled, its blocks get added too.
	this.blocks
	// num; Number of time steps elapsed since the start of the game.
	this.numOfTimeSteps
	// num; The current player score.
	this.score
};
// Methods
Tetris.LogicHandler.prototype = Object.create(Tetris.GameObject.prototype);
Tetris.LogicHandler.prototype.constructor = Tetris.LogicHandler;
Tetris.LogicHandler.prototype.constructor = Tetris.LogicHandler;
Tetris.LogicHandler.prototype.executeStep = function() { // void: Executes the subroutines for 1 time step of the game.
};
Tetris.LogicHandler.prototype.moveGravitizedBlocks = function() { // void: Moves gravitized blocks down 1 game unit.
};
Tetris.LogicHandler.prototype.updateBlockPositions = function() { // void: Move blocks whose gamePos's have changed.
};
Tetris.LogicHandler.prototype.checkCompletedRows = function() { // void: Check for completed rows, mark all blocks in said rows for removal, and increment the score.
};
Tetris.LogicHandler.prototype.deleteRemovedBlocks = function() { // void: Deletes blocks that have been flagged for removal from the game.
};
Tetris.LogicHandler.prototype.pickNextPiece = function() { // Piece: Returns a randomly selected Piece from allPossiblePieces.
};
Tetris.LogicHandler.prototype.dropNextPiece = function() { // void: Transfer currentPiece blocks to blocks[] and delete currentPiece. Pick a piece from allPossiblePieces and deploy a copy of it as currentPiece.
};
Tetris.LogicHandler.prototype.checkBlockConditions = function() { // void: Check ground conditions on all blocks not in currentPiece; set gravity accordingly.
};
Tetris.LogicHandler.prototype.checkCurrentPieceConditions = function() { // void: Check ground conditions on all currentPiece blocks; set gravity accordingly.
};

// Game class: Its functions (init, preload, create, etc.) are called by the Phaser State Manager
Tetris.Game = function(game) {
};
// Called by the State Manager before anything else.
Tetris.Game.prototype.init = function() {
};
// Called by the State Manager after init and before create.
Tetris.Game.prototype.preload = function() {
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

	// Create a LogicHandler object
	var logic = new Tetris.LogicHandler();

	// Create a timer to determine the duration between each "step" of the game
	var stepTimer = this.game.time.create(false) // autoDestroy false
	stepTimer.loop(500, logic.executeStep, this);
	stepTimer.start();
};




/*
=
=
=
=
=
Tetris.Game = function(game) {
};

Tetris.Game.prototype = {

	init: function() {
		// Define global variables

		// Number of rows in the game
		this.numOfRows = 20;

		// Number of blocks in a row
		this.numOfBlocksInRow = 10;

		// Holds all block objects in the game
		this.blocks = [];

		// Holds all block objects in the current piece
		this.currentPiece = [];

		// Holds the type number for the next block
		this.nextPieceCode = undefined;
	},

	preload: function() {
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
	},

	create: function() {
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

		// Create a timer to determine the duration between each "step" of the game
		var stepTimer = this.game.time.create(false) // autoDestroy false
		stepTimer.loop(500, this.executeStep, this);
		stepTimer.start();
	},

	update: function() {
	},

	executeStep: function() {

		// Check for rows to clear
		if (this.clearCompletedRows()) {
			this.updateBlocks();
			return;
		}
		// Or, update blocks with gravity
		else if (this.applyGravity()) {
			this.updateBlocks();
			return;
		}
		// Or, introduce new piece
		else {
			this.createRandStandardPiece();
			this.updateBlocks();
		}
	},

	updateBlocks: function() {
		// For all blocks
		var currentBlock = undefined;
		for (block in this.blocks) {
			currentBlock = this.blocks[block]

			// Delete sprite/obj for removed blocks
			if (currentBlock.removed) {
				currentBlock.sprite.destroy();
				this.blocks.splice(block);
				continue;
			}

			// Change block sprites pixel pos to reflect game pos
			currentBlock.sprite.x = this.gamePosToCoord(currentBlock.gamePosX);
			currentBlock.sprite.y = this.gamePosToCoord(currentBlock.gamePosY);
		}
	},

	clearCompletedRows: function() {
		return false;
	},

	applyGravity: function() {
		var didBlockMove = false;

		// Move the blocks with gravity
		for (block in this.blocks) {
			if (this.blocks[block].gravity == 1) {
				this.blocks[block].gamePosY += 1;
				didBlockMove = true;
			}
		}

		// Check if any block in currentPiece has hit a stationary block or the floor
		// if so, stop the currentPiece
		for (block in this.currentPiece) {
			var currentBlock = this.currentPiece[block];

			// Get the object occupying the space below the currentBlock
			var belowCurrentBlock = undefined;
			for (block2 in this.blocks) {
				if (this.blocks[block2].gamePosX == currentBlock.gamePosX && this.blocks[block2].gamePosY == currentBlock.gamePosY + 1) {
					belowCurrentBlock = this.blocks[block2];
				}
			}

			// If the currentBlock is on the bottomRow...
			if (currentBlock.gamePosY == this.numOfRows - 1) {
				// Freeze the currentPiece
				for (block3 in this.currentPiece) {
					this.currentPiece[block3].gravity = 0;
				}
				// Stop the loop
				break;
			}
			// Else, if the belowCurretBlock is a static block...
			else if (belowCurrentBlock != undefined && belowCurrentBlock.gravity == 0) {
				// Freeze the currentPiece
				for (block3 in this.currentPiece) {
					this.currentPiece[block3].gravity = 0;
				}
				// Stop the loop
				break;
			}
		}
		return didBlockMove;
	},

	// Using this.nextPiece, puts nextPiece on the board and picks a new random nextPiece.
	createRandStandardPiece: function() {
		var currentPieceCode = undefined;

		// If nextPiece exists, make it currentPiece and pick another one.
		if (this.nextPieceCode != undefined) {
			currentPieceCode = this.nextPieceCode;
			this.nextPieceCode = Math.floor(Math.random() * 7);
		}
		// Else, pick 2
		else {
			currentPieceCode = Math.floor(Math.random() * 7);
			this.nextPieceCode = Math.floor(Math.random() * 7);
		}

		// Make the piece
		switch (currentPieceCode) {
			// I shape
			case 0:
				this.currentPiece = this.createPiece(
					[ 1, 0, 0, 0,
					  1, 0, 0, 0,
					  1, 0, 0, 0,
					  1, 0, 0, 0 ],
					4,
					0,
					1
				);
				break;
			// J shape
			case 1:
				this.currentPiece = this.createPiece(
					[ 0, 2, 0, 0,
					  0, 2, 0, 0,
					  2, 2, 0, 0,
					  0, 0, 0, 0 ],
					4,
					0,
					1
				);
				break;
			// L shape
			case 2:
				this.currentPiece = this.createPiece(
					[ 3, 0, 0, 0,
					  3, 0, 0, 0,
					  3, 3, 0, 0,
					  0, 0, 0, 0 ],
					4,
					0,
					1
				);
				break;
			// O shape
			case 3:
				this.currentPiece = this.createPiece(
					[ 4, 4, 0, 0,
					  4, 4, 0, 0,
					  0, 0, 0, 0,
					  0, 0, 0, 0 ],
					4,
					0,
					1
				);
				break;
			// Z shape
			case 4:
				this.currentPiece = this.createPiece(
					[ 5, 5, 0, 0,
					  0, 5, 5, 0,
					  0, 0, 0, 0,
					  0, 0, 0, 0 ],
					4,
					0,
					1
				);
				break;
			// T shape
			case 5:
				this.currentPiece = this.createPiece(
					[ 0, 6, 0, 0,
					  6, 6, 6, 0,
					  0, 0, 0, 0,
					  0, 0, 0, 0 ],
					4,
					0,
					1
				);
				break;
			// S shape
			case 6:
				this.currentPiece = this.createPiece(
					[ 0, 4, 4, 0,
					  4, 4, 0, 0,
					  0, 0, 0, 0,
					  0, 0, 0, 0 ],
					4,
					0,
					1
				);
				break;
		}
	},

	createPiece: function(blockArray, gamePosX, gamePosY, initGravity) {
		var len, blockPosX, blockPosY, blockColor;
		var newPiece = [];

		len = blockArray.length;
		for (i = 0; i < len; i++) {
			if (blockArray[i] == 0) { continue; }
			else {
				// Get the blocks global position
				blockPosX = gamePosX + (i % 4);
				blockPosY = gamePosY + Math.floor(i/4);

				// Resolve the blocks color
				switch(blockArray[i]) {
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
			}

			// Create the block and add it to newPiece 
			newPiece.push(this.createBlock(blockPosX, blockPosY, blockColor, 1));
		}

		return newPiece
	},

	// Creates a new block at the given gamePos and adds it to this.blocks
	// Returns the newly created block.
	createBlock: function(gamePosX, gamePosY, color, initGravity) {
		var newBlock = {
			sprite: this.game.add.sprite(this.gamePosToCoord(gamePosX), this.gamePosToCoord(gamePosY), color),
			gravity: initGravity,
			gamePosX: gamePosX,
			gamePosY: gamePosY,
			removed: false
		};
		newBlock.sprite.scale = new PIXI.Point(1.5, 1.5);

		// Add this block to the global blocks array
		this.blocks.push(newBlock);

		return newBlock;
	},

	// Converts the given game position into a pos index in this.blocks
	gamePosToPosIndex: function(posX, posY) {
		return ((posY * 10) + posX);
	},

	// Converts the given pos index from this.blocks into a game position
	posIndexToGamePos: function(posIndex) {
		var blockPosX = posIndex % 10;
		var blockPosY = Math.floor(posIndex / 10);
		return [blockPosX, blockPosY];
	},

	// Converts the given gamePosition into a pixel coordinate.
	gamePosToCoord: function(pos) {
		return ((pos * 1.5 * 16) + 1);
	},

	// Converts the given pixel coordinate into a gamePosition.
	coordToGamePos: function(coord) {
		return ((coord - 1) / (1.5 * 16));
	}

};
*/