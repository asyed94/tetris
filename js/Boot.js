Tetris.Boot = function(game) {
};

Tetris.Boot.prototype = {
	init: function() {

		this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
		this.scale.pageAlignHorizontally = true;

	},

	preload: function() {

	},

	create: function() {

		this.state.start("MainMenu")

	}
};
