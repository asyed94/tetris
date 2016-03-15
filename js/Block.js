// Block class extends GameObject
Tetris.Block = function(game, gamePosX, gamePosY, color, initGravitation) {
	// Properties
	Tetris.GameObject.call(this, game);
	// Phaser.Sprite; Phaser Sprite object associated with this block.
	this.sprite = this.game.add.sprite(this.gamePosToCoord(gamePosX), this.gamePosToCoord(gamePosY), color);
	this.sprite.scale = new PIXI.Point(2, 2);
	// num; Horizontal position of this block on the game board in block units. 0 is the left most position.
	this.gamePosX = gamePosX; 
	// num; Vertical position of this block on the game board in block units. 0 is the top most position.
	this.gamePosY = gamePosY; 
	// boolean;  Will gravity pull down this block by 1 unit in the next time step?
	this.isGravitized = initGravitation;
	// boolean; Will this block be removed from the game in the next time step? Init to false.
	this.isRemoved = false;
};
// Methods
Tetris.Block.prototype = Object.create(Tetris.GameObject.prototype);
// void: Moves this block up by 1 game unit.
Tetris.Block.prototype.moveUp = function() {
	this.gamePosY -= 1;
};
// void: Moves this block down by 1 game unit.
Tetris.Block.prototype.moveDown = function() {
	this.gamePosY += 1;
};
// void: Moves this block right by 1 game unit.
Tetris.Block.prototype.moveRight = function() {
	this.gamePosX += 1;
};
// void: Moves this block left by 1 game unit.
Tetris.Block.prototype.moveLeft = function() {
	this.gamePosX -= 1;
};
// void: Apply this block's game properties to its sprite.
Tetris.Block.prototype.update = function() {
	this.sprite.x = this.gamePosToCoord(this.gamePosX);
	this.sprite.y = this.gamePosToCoord(this.gamePosY);

	// If this block is to be removed, destroy it
	if (this.isRemoved) { this.destroy(); }
};
// void: Set this blocks isRemoved to true.
Tetris.Block.prototype.markForRemoval = function() {
	this.isRemoved = true;
};
// void: Destroy the block
Tetris.Block.prototype.destroy = function() {
	// Destroy the associated sprite
	this.sprite.destroy();
};