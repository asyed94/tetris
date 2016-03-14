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