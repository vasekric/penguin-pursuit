"user strict";

var Line = function(a, b) {
    this.a = a; //a = {x: , y: }
    this.b = b;
};

/**
 * @return {boolean}
 */
Line.prototype.isIntersecting = function(line) {

    if(line === undefined) {
        console.log("line undefined");
        return false;
    }
    var a = this.a;
    var b=this.b;
    var c=line.a;
    var d=line.b;
    if(c === undefined || d === undefined || a === undefined ||  b === undefined) {
        console.log("abcd undefined");
        return false;
    }

    var denominator = ((b.x - a.x) * (d.y - c.y)) - ((b.y - a.y) * (d.x - c.x));
    var numerator1 = ((a.y - c.y) * (d.x - c.x)) - ((a.x - c.x) * (d.y - c.y));
    var numerator2 = ((a.y - c.y) * (b.x - a.x)) - ((a.x - c.x) * (b.y - a.y));

    // Detect coincident lines (has a problem)
    /*if (denominator == 0) {
        return numerator1 == 0 && numerator2 == 0;
    }*/

    var r = numerator1 / denominator;
    var s = numerator2 / denominator;

    return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
};

