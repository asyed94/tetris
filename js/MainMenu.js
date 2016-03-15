Tetris.MainMenu = function(game) {
};

Tetris.MainMenu.prototype = {
	init: function() {

	},

	preload: function() {

		this.load.image("title-img", "../assets/main-menu-title.png");
		this.load.image("deco-img", "../assets/main-menu-deco.png");
		this.load.image("start-text-img", "../assets/main-menu-start-text.png");

	},

	create: function() {
		// Create the title
		var title = this.game.add.image(128 * 2, 55 * 2, "title-img");
		title.scale = new PIXI.Point(2, 2);
		title.anchor = new PIXI.Point(0.5, 0.5);

		// Create the deco
		var deco = this.game.add.image(128 * 2, 160 * 2, "deco-img");
		deco.scale = new PIXI.Point(2, 2);
		deco.anchor = new PIXI.Point(0.5, 0.5);

		// Create the start-text
		var startText = this.game.add.image(128 * 2, 265 * 2, "start-text-img");
		startText.scale = new PIXI.Point(2, 2);
		startText.anchor = new PIXI.Point(0.5, 0.5);

		// On any key press, start the game
		this.game.input.keyboard.onDownCallback = this.startGame;
	},

	startGame: function() {
		this.game.input.keyboard.onDownCallback = null;
		this.game.state.start("Game", true, true);
	}
};
