// GameObject class
Tetris.GameObject = function(game) {
	// Properties
	this.game = game;
};
// Methods
Tetris.GameObject.prototype.gamePosToCoord = function(gamePos) {
	return ((gamePos * 2 * 16) + 1);
};
Tetris.GameObject.prototype.coordToGamePos = function(coord) {
	return ((coord - 1) / (2 * 16));
};