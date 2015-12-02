"use strict";

var Maze = function() {
    var level = 1;
    var score = 0;
    var FPS = 30;
    var map;
    var player;
    var enemy;
    var direction = "";
    var enemyDirection = "";
    var shoudRender = true;

    var fontSize = canvas.height/25;
    var startPoint = {x:canvas.width/40, y:canvas.height/10};
    var size = {width:canvas.width-startPoint.x*2, height:canvas.width-startPoint.x*2};
    var endPoint = {x:startPoint.x+size.width, y:startPoint.y+size.height};
    var restart = function() {

        $.get(url+"lvl1.json" , function(rawData) {
            var data = JSON.parse(rawData);
            var tiles = new Image();
            tiles.src = 'images/tiles.png';
            map = new Map([data], tiles, 32, 32, startPoint, endPoint);
            var penguin = new Image();
            penguin.src = 'images/penguin.png';
            var penguinSize = data.tilewidth * 0.8;
            penguinSize *= (map.bottomRight.x - map.upLeft.x) / (data.width * data.tilewidth);
            player = new Penguin(penguin, map.startPoint, {width: penguinSize, height: penguinSize}, map);
            var enemyStartx = map.startPoint.x + ((map.upLeft.x + (map.bottomRight.x - map.upLeft.x) / 2) - map.startPoint.x);
            var enemyStarty = map.startPoint.y + 0;
            enemy = new Penguin(penguin, {x: enemyStartx, y: enemyStarty}, {
                width: penguinSize,
                height: penguinSize
            }, map);
            dirCount = 0;
            enemyDirection = enemyMoves[level - 1][dirCount];
            shoudRender = true;
            level = 1;
            score = 0;
        });
    };
    $(function() {
       restart();
    });
    var lvl;

    var angleStart = 0;
    var angleEnd = 0;
    var rotationStarted = 0;
    var rotationTime = 1000;
    var translateX = startPoint.x+size.width/2;
    var translateY = startPoint.y+size.height/2;
    var rotation = 0;
    var render = function(lvl) {

        var now = new Date().getTime();
        if(rotationStarted+rotationTime >= now) {
                rotation = angleStart + ((now-rotationStarted)/rotationTime) * angleEnd;
        }
        else {
            rotation = angleStart + angleEnd;
        }
        context.translate(translateX, translateY);
        context.rotate(rotation);
        context.translate(-translateX, -translateY);

        if(map === undefined || player === undefined || enemy === undefined) {
            return;
        }
        if(shoudRender) {
            player.move(direction, 3);
            enemy.move(enemyDirection, 1+level/10);
        }
        if(enemy.wasInCollision) {
            dirCount++;
            if(dirCount < enemyMoves[level-1].length && dirCount >= 0) {
                enemyDirection = enemyMoves[level-1][dirCount];
            }
        }

        context.beginPath();
        context.fillStyle = "cyan";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        context.fillRect(startPoint.x, startPoint.y, size.width, size.height);
        map.render(context, angleEnd);
        player.render(context, angleEnd);
        enemy.render(context, angleEnd);

        context.translate(translateX, translateY);
        context.rotate(-rotation);
        context.translate(-translateX, -translateY);

        $('canvas').on('click', function(event) {
            if(enemy.inFinish) {
                restart();
            }
        });

        if(enemy.inFinish) {
            shoudRender = false;
            context.font=(fontSize*1.5)+"px Verdana";
            context.fillStyle="#2222FF";
            context.fillText("You Lost!",startPoint.x+(endPoint.x-startPoint.x)/2-fontSize*2.5, endPoint.y-startPoint.y*2-fontSize);
        }
        if(player.inFinish) {
            if(!shoudRender) {
                context.font=(fontSize*1.5)+"px Verdana";
                context.fillStyle="#2222FF";
                context.fillText("Finish!",startPoint.x+(endPoint.x-startPoint.x)/2-fontSize*2.5, endPoint.y-startPoint.y*2-fontSize);
                return;
            }
            level++;
            var finalScore = score + 1000;
            setInterval(function () {
                if (score < finalScore) {
                    score += 10;
                }
            }, 10);
            shoudRender = false;

            setTimeout(function () {
                $.get(url+'lvl' + level + '.json' , function(rawData) {
                    var data = JSON.parse(rawData);
                    var tiles = new Image();
                    tiles.src = 'images/tiles.png';
                    map = new Map([data], tiles, 32, 32, startPoint, endPoint);
                    var penguin = new Image();
                    penguin.src = 'images/penguin.png';
                    var penguinSize = data.tilewidth * 0.8;
                    penguinSize *= (map.bottomRight.x - map.upLeft.x) / (data.width * data.tilewidth);
                    player = new Penguin(penguin, map.startPoint, {width: penguinSize, height: penguinSize}, map);
                    var enemyStartx = map.startPoint.x + ((map.upLeft.x+(map.bottomRight.x-map.upLeft.x)/2) - map.startPoint.x);
                    var enemyStarty = map.startPoint.y + 0;
                    enemy = new Penguin(penguin, {x:enemyStartx, y:enemyStarty}, {width:penguinSize, height:penguinSize}, map);
                    dirCount = 0;
                    enemyDirection = enemyMoves[level-1][dirCount];
                    shoudRender = true;
                });
            }, 1500);

        }
        context.fillStyle="#333333";
        context.font= fontSize+"px Verdana";
        context.fillText("Level: "+level+" Score: "+score, startPoint.x, (startPoint.y-fontSize)/3+fontSize);

        context.stroke();
    };

    function getRandomArbitrary(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }


    setInterval(function () {render(lvl)}, 1000/FPS);
    setInterval(function () {
        if(!shoudRender) {
            return;
        }
        angleStart += angleEnd;
        angleStart = angleStart % (Math.PI*2);
        var rnd = getRandomArbitrary(0, 2) - 1;
        angleEnd =  angleStart + 90 * rnd *(Math.PI/180);
        angleEnd = angleEnd % (Math.PI*2);
        rotationStarted = new Date().getTime();
    }, 5000);


    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) {
            direction = "left";
        }
        else if(event.keyCode == 38) {
            direction = "up";
        }
        else if(event.keyCode == 39) {
            direction = "right";
        }
        else if(event.keyCode == 40) {
            direction = "down";
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 37) {
            if(direction == "left") direction = "";
        }
        else if(event.keyCode == 38) {
            if(direction == "up") direction = "";
        }
        else if(event.keyCode == 39) {
            if(direction == "right") direction = "";
        }
        else if(event.keyCode == 40) {
            if(direction == "down") direction = "";
        }
    });

    $( function() {
        GameController.init( {
            left: {
                position: {
                    left: '50%',
                    bottom: '20%'
                },
                type: 'joystick',
                joystick: {
                    touchStart: function() {
                    },
                    touchEnd: function() {
                        //direction = "";
                    },
                    touchMove: function( details ) {
                        if(Math.abs(details.dx) > Math.abs(details.dy)) {
                            if(details.dx > 0) {
                                direction = "right";
                            }
                            else {
                                direction = "left";
                            }
                        }
                        else {
                            if(details.dy > 0) {
                                direction = "up";
                            }
                            else {
                                direction = "down";
                            }
                        }
                    }
                }
            },
            right: false
        } );
    } );


};

