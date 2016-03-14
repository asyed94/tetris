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
	this.logic = new Tetris.LogicHandler(this.game, this.standardTetrisPieces, 700);

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
