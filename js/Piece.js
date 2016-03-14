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
