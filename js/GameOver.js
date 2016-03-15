Tetris.GameOver = function(game) {
}
Tetris.GameOver.prototype.init = function(score) {
	this.score = score;
};
Tetris.GameOver.prototype.preload = function() {
	this.load.image("game-over-img", "../assets/game-over.png")
	this.load.image("play-again-img", "../assets/play-again.png")
	this.load.image("final-score-label-img", "../assets/score-label.png")
	this.load.image("8bit-digits", "../assets/digits.png")
};
Tetris.GameOver.prototype.create = function() {
	// Create GAME OVER text
	var gameOver = this.game.add.image(this.game.width / 2, this.game.height * 1/4, "game-over-img");
	gameOver.scale = new PIXI.Point(2, 2);
	gameOver.anchor = new PIXI.Point(0.5, 0.5);

	// Create the final score label
	var finalScoreLabel = this.game.add.image(this.game.width / 2, this.game.height * 2/4, "final-score-label-img");
	finalScoreLabel.scale = new PIXI.Point(2, 2);
	finalScoreLabel.anchor = new PIXI.Point(0.5, 0.5);

	// Create the final score display
	var finalScoreFont = this.game.add.retroFont("8bit-digits", 10, 19, "0123456789"); 
	var finalScoreDisplay = this.game.add.image(this.game.width / 2, (this.game.height * 2/4) + 40, finalScoreFont);
	finalScoreDisplay.scale = new PIXI.Point(2, 2);
	finalScoreDisplay.anchor = new PIXI.Point(0.5, 0.5);
	finalScoreFont.text = this.score.toString();

	// Create play again message
	var playAgain = this.game.add.image(this.game.width / 2, this.game.height * 3/4, "play-again-img");
	playAgain.scale = new PIXI.Point(2, 2);
	playAgain.anchor = new PIXI.Point(0.5, 0.5);

	// Create event handler for play again
	this.game.input.keyboard.onDownCallback = function(e) {
		if (e.keyCode == Phaser.Keyboard.ENTER) {
			this.game.state.start("Game");
		}
	};
};
Tetris.GameOver.prototype.update = function() {
};
