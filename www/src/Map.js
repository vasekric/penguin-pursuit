"use strict";

Map = function(lvls, tiles, tileWidth, tileHeight, ul, br) {
    this.lvls = lvls;
    this.tiles = tiles;
    this.actualLevel = 0;
    this.upLeft = ul;
    this.bottomRight = br;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.collisionLines = this.initCollisionLines(1);
    this.startPoint;
    this.finishCollisionLines = this.initCollisionLines(3);
    this.fish = new Image();
    this.fish.src = "images/fish.png";
    this.fishSize = tileWidth*0.8;
    var data = this.lvls[this.actualLevel];
    this.fishSize *= (this.bottomRight.x-this.upLeft.x) / (data.width*data.tilewidth);

    this.initStartPoint();
};

Map.prototype.initStartPoint = function() {
    var lvl = this.lvls[this.actualLevel];
    this.startPoint = lvl.layers[2].objects[0];
    this.startPoint.x *= (this.bottomRight.x-this.upLeft.x) / (lvl.width*lvl.tilewidth);
    this.startPoint.x += this.upLeft.x;
    this.startPoint.y *= (this.bottomRight.y-this.upLeft.y) / (lvl.width*lvl.tilewidth);
    this.startPoint.y += this.upLeft.y;
};

Map.prototype.initCollisionLines = function(layer) {
    var collisionLines = [];
    var lvl = this.lvls[this.actualLevel];
    var mapSize = (lvl.width*lvl.tilewidth);
    var collisionLayer = lvl.layers[layer];
    //console.log(JSON.stringify(collisionLayer.objects[0].polyline));
    for(var i = 0; i < collisionLayer.objects.length; i++) {
        var polyline = collisionLayer.objects[i].polyline;
        for(var j = 1; j < polyline.length; j++) {
            var point = Object.create(polyline[j-1]);
            var point2 = Object.create(polyline[j]);
            var x = collisionLayer.objects[i].x;
            var y = collisionLayer.objects[i].y;
            var x1 = point.x + x;
            var y1 = point.y + y;
            var x2 = point2.x + x;
            var y2 = point2.y + y;
            x1 *= (this.bottomRight.x-this.upLeft.x) / mapSize;
            x1 += this.upLeft.x;
            y1 *= (this.bottomRight.x-this.upLeft.x) / mapSize;
            y1 += this.upLeft.y;
            x2 *= (this.bottomRight.x-this.upLeft.x) / mapSize;
            x2 += this.upLeft.x;
            y2 *= (this.bottomRight.x-this.upLeft.x) / mapSize;
            y2 += this.upLeft.y;
            collisionLines.push(new Line({x:x1, y:y1}, {x:x2, y:y2}));
        }
    }
    return collisionLines;
};

Map.prototype.isValidMove = function(from, to, size, direction) {
    var tileSize = this.getScaledTileSize();
    if(direction === "up") {
        return true;
    }
    return true;
};
Map.prototype.getTileStart = function(number) {
    number = number-1;
    var w = this.tiles.width;
    var h = this.tiles.height;
    var left = number % (w/this.tileWidth);
    var top = Math.floor(number/(h/this.tileHeight));
    return {
        x: left*this.tileWidth,
        y: top*this.tileHeight
    };
};
Map.prototype.getScaledTileSize = function() {
    var w = this.bottomRight.x - this.upLeft.x;
    var h = this.bottomRight.y - this.upLeft.y;
    var lvl = this.lvls[this.actualLevel];
    var bgLayer = lvl.layers[0];
    return {
        width: (w/bgLayer.width),
        height: (h/bgLayer.height)
    }
};
Map.prototype.getImgStart = function(number) {
    var lvl = this.lvls[this.actualLevel];
    var bgLayer = lvl.layers[0];
    var left = number % (bgLayer.width);
    var top = Math.floor(number / (bgLayer.height));
    var scaledTile = this.getScaledTileSize();
    return {
        x: scaledTile.width*left+this.upLeft.x,
        y: scaledTile.height*top+this.upLeft.y
    };
};
Map.prototype.render = function(context, angle) {
    var lvl = this.lvls[this.actualLevel];
    var bgLayer = lvl.layers[0];
    var scaledTileSize = this.getScaledTileSize();

    /*for(var i = 0; i < bgLayer.data.length; i++) {
        var tilePoint = this.getTileStart(bgLayer.data[i]);
        var imgPoint = this.getImgStart(i);

        context.drawImage(this.tiles, tilePoint.x, tilePoint.y, this.tileWidth, this.tileHeight,
            imgPoint.x, imgPoint.y, scaledTileSize.width, scaledTileSize.height);
    }*/

    for(var j = 0; j < this.collisionLines.length; j++) {
        context.moveTo(this.collisionLines[j].a.x, this.collisionLines[j].a.y);
        context.lineTo(this.collisionLines[j].b.x, this.collisionLines[j].b.y);
    }
    var x = this.finishCollisionLines[0].a.x-this.fishSize/2;
    var y = this.finishCollisionLines[0].a.y;
    context.drawImage(this.fish, 0,0, this.fish.width, this.fish.height, x, y, this.fishSize, this.fishSize);
};