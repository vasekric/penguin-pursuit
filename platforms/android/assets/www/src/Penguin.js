"use strict";

var Penguin = function(imgs, startPos, size, map) {
    this.imgs = imgs;
    this.size = size;
    this.actualPos = startPos;
    this.map = map;
    this.collisionLines = [];
    this.inFinish = false;
    this.wasInCollision = false;

    this.back = new Image();
    this.back.src = 'images/back.png';
    this.front = new Image();
    this.front.src = 'images/front.png';
    this.left = new Image();
    this.left.src = 'images/left.png';
    this.right = new Image();
    this.right.src = 'images/right.png';

    this.imgs = this.front;

    this.actualPos.x += size.width/8;
    this.actualPos.y += size.height/8;

    this.updateCollisionLines();
};
Penguin.prototype.render = function(context, angle) {
    context.drawImage(this.imgs, 0,0, this.imgs.width, this.imgs.height, this.actualPos.x, this.actualPos.y, this.size.width, this.size.height);
};
Penguin.prototype.updateCollisionLines = function() {
    var startPos = this.actualPos;
    var size = this.size;
    this.collisionLines = [
        new Line({x:startPos.x, y:startPos.y},{x:startPos.x+size.width, y:startPos.y}),
        new Line({x:startPos.x, y:startPos.y},{x:startPos.x, y:startPos.y+size.height}),
        new Line({x:startPos.x+size.width, y:startPos.y},{x:startPos.x+size.width, y:startPos.y+size.height}),
        new Line({x:startPos.x, y:startPos.y+size.height},{x:startPos.x+size.width, y:startPos.y+size.height}),
    ];
};
Penguin.prototype.isInCollision = function() {
    for(var i = 0; i < this.map.collisionLines.length; i++) {
        for(var j = 0; j < this.collisionLines.length; j++) {
            if(this.map.collisionLines[i].isIntersecting(this.collisionLines[j])) {
                this.wasInCollision = true;
                return true;
            }
        }
    }
    this.wasInCollision = false;
    return false;
};

Penguin.prototype.isFinishCollision = function() {
    for(var i = 0; i < this.map.finishCollisionLines.length; i++) {
        for(var j = 0; j < this.collisionLines.length; j++) {
            if(this.map.finishCollisionLines[i].isIntersecting(this.collisionLines[j])) {
                return true;
            }
        }
    }
    return false;
};

Penguin.prototype.move = function(direction, distance) {

    switch(direction) {
        case "up":
            this.imgs = this.back;
            this.actualPos.y -= distance;
            this.updateCollisionLines();
            if(this.isInCollision()) {
                this.actualPos.y += distance;
            }
            break;
        case "down":
            this.imgs = this.front;
            this.actualPos.y += distance;
            this.updateCollisionLines();
            if(this.isInCollision()) {
                this.actualPos.y -= distance;
            }
            break;
        case "left":
            this.imgs = this.left;
            this.actualPos.x -= distance;
            this.updateCollisionLines();
            if(this.isInCollision()) {
                this.actualPos.x += distance;
            }
            break;
        case "right":
            this.imgs = this.right;
            this.actualPos.x += distance;
            this.updateCollisionLines();
            if(this.isInCollision()) {
                this.actualPos.x -= distance;
            }
            break;
    }
    this.updateCollisionLines();
    if(this.isFinishCollision()) {
        this.inFinish = true;
    }
};

