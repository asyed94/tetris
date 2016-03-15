Tetris.MainMenu = function(game) {
};

Tetris.MainMenu.prototype = {
	init: function() {

	},

	preload: function() {

		this.load.image("menu-spinner", "../assets/menu-spinner.png");

	},

	create: function() {

		// Make a funky menuSpinner
		var menuSpinner = this.add.sprite(this.game.width / 2, this.game.height / 3, "menu-spinner");
		menuSpinner.anchor = new PIXI.Point(0.5, 0.5);
		menuSpinner.scale = new PIXI.Point(2, 2);
		this.game.physics.arcade.enable(menuSpinner);
		menuSpinner.body.angularAcceleration = 20 * Math.PI;

		// Menu screen text
		var startText = this.add.text(this.game.width / 2, this.game.height / 3 * 2, "press any key\n to start", {
			font: "bold 20pt Courier",
			fontVariant: "small-caps",
			fill: "yellow",
			align: "center"
		});
		startText.anchor = new PIXI.Point(0.5, 0.5);

		// On any key press, start the game
		this.game.input.keyboard.onDownCallback = this.startGame;
	},

	startGame: function() {
		this.game.input.keyboard.onDownCallback = null;
		this.game.state.start("Game");
	}
};
