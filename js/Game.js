// Game class: Its functions (preload, create, etc.) are called by the Phaser State Manager
Tetris.Game = function(game) {
};
// Called by the State Manager before anything else.
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
		// The T piece
		{
			gridWidth: 3,
			gridLength: 3,
			orientation: {
				UP:	[ 0, 2, 0,
					  2, 2, 2,
					  0, 0, 0],

				RIGHT: [ 0, 2, 0,
					     0, 2, 2,
					     0, 2, 0],

				DOWN: [ 0, 0, 0,
					    2, 2, 2,
					    0, 2, 0],

				LEFT: [ 0, 2, 0,
					    2, 2, 0,
					    0, 2, 0]
			}
		},
		// The L piece
		{
			gridWidth: 3,
			gridLength: 3,
			orientation: {
				UP:	[ 0, 3, 0,
					  0, 3, 0,
					  0, 3, 3 ],

				RIGHT:	[ 0, 0, 0,
					      3, 3, 3,
					      3, 0, 0 ],

				DOWN:	[ 3, 3, 0,
					      0, 3, 0,
					      0, 3, 0 ],

				LEFT:	[ 0, 0, 3,
					      3, 3, 3,
					      0, 0, 0 ]
			}
		},
		// The J piece
		{
			gridWidth: 3,
			gridLength: 3,
			orientation: {
				UP:	[ 0, 4, 0,
					  0, 4, 0,
					  4, 4, 0 ],

				RIGHT:	[ 4, 0, 0,
					      4, 4, 4,
					      0, 0, 0 ],

				DOWN:	[ 0, 4, 4,
					      0, 4, 0,
					      0, 4, 0 ],

				LEFT:	[ 0, 0, 0,
					      4, 4, 4,
					      0, 0, 4 ]
			}
		},
		// The S piece
		{
			gridWidth: 3,
			gridLength: 3,
			orientation: {
				UP:	[ 0, 0, 0,
					  0, 5, 5,
					  5, 5, 0 ],

				RIGHT:	[ 0, 5, 0,
					      0, 5, 5,
					      0, 0, 5 ],

				DOWN:	[ 0, 5, 5,
					      5, 5, 0,
					      0, 0, 0 ],

				LEFT:	[ 5, 0, 0,
					      5, 5, 0,
					      0, 5, 0 ]
			}
		},
		// The Z piece
		{
			gridWidth: 3,
			gridLength: 3,
			orientation: {
				UP:	[ 0, 0, 0,
					  6, 6, 0,
					  0, 6, 6 ],

				RIGHT:	[ 0, 0, 6,
					      0, 6, 6,
					      0, 6, 0 ],

				DOWN:	[ 6, 6, 0,
					      0, 6, 6,
					      0, 0, 0 ],

				LEFT:	[ 0, 6, 0,
					      6, 6, 0,
					      6, 0, 0 ]
			}
		},
		// The O piece
		{
			gridWidth: 2,
			gridLength: 2,
			orientation: {
				UP:	[ 1, 1,
					  1, 1 ],

				RIGHT:	[ 1, 1,
					      1, 1 ],

				DOWN:	[ 1, 1,
					      1, 1 ],

				LEFT:	[ 1, 1,
					      1, 1 ]
			}
		},
	];

	// Create the logic handler
	this.logic = new Tetris.LogicHandler(this.game, this.standardTetrisPieces, 700);

	// Create the nextPiece holder
	this.nextPiece = undefined;

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
	this.load.image("8bit-digits", "../assets/digits.png")
};
// Called by the State Manager after init and preload.
Tetris.Game.prototype.create = function() {
	// Create the divider sprite
	var divider = this.game.add.image(322, 0, "divider-img");
	divider.scale = new PIXI.Point(2, 2);
	divider.anchor = new PIXI.Point(0, 0);
	this.game.physics.arcade.enable(divider);

	// Create "Next" label
	var nextLabel = this.game.add.image(416, 52, "next-label-img");
	nextLabel.scale = new PIXI.Point(2, 2);
	nextLabel.anchor = new PIXI.Point(0.5, 0.5);

	// Create "Score" label
	var scoreLabel = this.game.add.image(416, 548, "score-label-img");
	scoreLabel.scale = new PIXI.Point(2, 2);
	scoreLabel.anchor = new PIXI.Point(0.5, 0.5);

	// Create score display font
	this.scoreDisplayFont = this.game.add.retroFont('8bit-digits', 10, 19, "0123456789");
	this.scoreDisplayFont.text = "000000";

	// Create score display
	var scoreDisplay = this.game.add.image(416, 596, this.scoreDisplayFont);
	scoreDisplay.scale = new PIXI.Point(2, 2);
	scoreDisplay.anchor = new PIXI.Point(0.5, 0.5);

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
					if (this.logic.checkBoundries() == "ground") {
						this.logic.currentPiece.moveUp();
					}
					if (this.logic.checkBoundries() == "ceiling") {
						this.logic.currentPiece.moveDown();
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
	if (this.logic.gameOver) {
		this.game.state.start("GameOver", true, true, this.logic.numOfTimeSteps);
	}

	this.scoreDisplayFont.text = this.logic.numOfTimeSteps.toString();

	if (this.logic.nextPiece != undefined) {
		if (this.nextPiece == undefined) {
			this.nextPiece = new Tetris.Piece(this.game, this.logic.nextPiece, 0, 0, "UP", false);
			this.nextPiece.setPosition(208 * 2, 70 * 2);
		}
		else if (this.nextPiece.shapeInfo != this.logic.nextPiece) {
			for (block in this.nextPiece.blocks) {
				this.nextPiece.blocks[block].destroy();
			}
			this.nextPiece = new Tetris.Piece(this.game, this.logic.nextPiece, 0, 0, "UP", false);
			this.nextPiece.setPosition(208 * 2, 70 * 2);
		}
	}
};
// Called by the Phaser State manager before switching to another state
Tetris.Game.prototype.shutdown = function() {
	this.game.input.keyboard.onDownCallback = null;
};
