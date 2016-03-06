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
