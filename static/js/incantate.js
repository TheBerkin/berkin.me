(function() {
  var clamp = function(x, min, max) {
    return x > max ? max : x < min ? min : x;
  }

  var colorComponent = function(n) {
    var ns = Math.floor(clamp(n, 0, 1) * 255).toString(16).substr(0, 2);
    return ns.length == 1 ? "0" + ns : ns;
  }

  function RGB(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  };

  RGB.prototype.normalize = function() {
    var max = Math.max(this.r, Math.max(this.g, this.b));
    if (max > 1)
    {
      this.r /= max;
      this.g /= max;
      this.b /= max;
    }
  };

  RGB.prototype.toString = function() {
    var max = Math.max(this.r, Math.max(this.g, this.b));
    if (max > 1)
    {
      return "#"
      + colorComponent(this.r / max)
      + colorComponent(this.g / max)
      + colorComponent(this.b / max);
    }
    return "#"
    + colorComponent(this.r)
    + colorComponent(this.g)
    + colorComponent(this.b);
  };

  RGB.prototype.isBright = function() {
    return (this.r * 1.3 + this.g * 1.8 + this.b * .3) / 3 > .5;
  };

  var lean = function(color, rr, gg, bb) {
    if (color.r > 0)
    {
      color.r = (color.r + color.r + rr) / 2.0;
    }
    else
    {
      color.r += rr;
    }

    if (color.g > 0)
    {
      color.g = (color.g + color.g + gg) / 2.0;
    }
    else
    {
      color.g += gg;
    }

    if (color.b > 0)
    {
      color.b = (color.b + color.b + bb) / 2.0;
    }
    else
    {
      color.b += bb;
    }
  }

  var desat = function(rgb, amount) {
    var x = (rgb.r + rgb.g + rgb.b) / 3;
    rgb.r += (x - rgb.r) * amount;
    rgb.g += (x - rgb.g) * amount;
    rgb.b += (x - rgb.b) * amount;
  }

  var sat = function(rgb, amount) {
    var x = (rgb.r + rgb.g + rgb.b) / 3;
    rgb.r += (rgb.r - x) * amount;
    rgb.g += (rgb.g - x) * amount;
    rgb.b += (rgb.b - x) * amount;
    x = Math.max(rgb.r, Math.max(rgb.g, rgb.b));
    if (x > 1)
    {
      rgb.r /= x;
      rgb.g /= x;
      rgb.b /= x;
    }
  };

  var grey = function(rgb) {
    desat(rgb, .5);
    lean(rgb, .5, .5, .5);
  };

  var addmul = function(rgb, add, mul) {
    rgb.r = (rgb.r + add) * mul;
    rgb.g = (rgb.g + add) * mul;
    rgb.b = (rgb.b + add) * mul;
  };

  var lighten = function(rgb, amount) {
    rgb.r += (1 - rgb.r) * amount;
    rgb.g += (1 - rgb.g) * amount;
    rgb.b += (1 - rgb.b) * amount;
  };

  var darken = function(rgb, amount) {
    rgb.r -= rgb.r * amount;
    rgb.g -= rgb.g * amount;
    rgb.b -= rgb.b * amount;
  };

  var lerp = function(rgb, r, g, b, amount) {
    rgb.r += (r - rgb.r) * amount;
    rgb.g += (g - rgb.g) * amount;
    rgb.b += (b - rgb.b) * amount;
  }

  var funcs =  {
    "black": function(rgb) {
      rgb.r *= .2;
      rgb.g *= .2;
      rgb.b *= .2;
    },
    "grey": grey,
    "gray": grey,
    "white": function(rgb) {
      lean(rgb, 1, 1, 1);
    },
    "red": function(rgb) {
      lean(rgb, 1, 0, 0);
    },
    "yellow": function(rgb) {
      lean(rgb, 1, 1, 0);
    },
    "green": function(rgb) {
      lean(rgb, 0, 1, 0);
    },
    "blue": function(rgb) {
      lean(rgb, 0, 0, 1);
    },
    "magenta": function(rgb) {
      lean(rgb, 1, 0, 1);
    },
    "cyan": function(rgb) {
      lean(rgb, 0, 1, 1);
    },
    "teal": function(rgb) {
      lean(rgb, .1, .4, .7);
    },
    "turquoise": function(rgb) {
      lean(rgb, .1, .6, .7);
    },
    "reddish": function(rgb) {
      lean(rgb, .5, 0, 0);
    },
    "yellowish": function(rgb) {
      lean(rgb, .5, .5, 0);
    },
    "greenish": function(rgb) {
      lean(rgb, 0, .5, 0);
    },
    "bluish": function(rgb) {
      lean(rgb, 0, 0, .5);
    },
    "violet": function(rgb) {
      lean(rgb, .4, 0, .45);
    },
    "purple": function(rgb) {
      lean(rgb, .3, 0, .3);
    },
    "orange": function(rgb) {
      lean(rgb, 1, .55, 0);
    },
    "grape": function(rgb) {
      lean(rgb, .45, .15, .3);
    },
    "blueberry": function(rgb) {
      lean(rgb, .2, .22, .45);
    },
    "pink": function(rgb) {
      lean(rgb, 1, .6, .6);
    },
    "brown": function(rgb) {
      lean(rgb, .4, .3, .1);
    },
    "brick": function(rgb) {
      lean(rgb, .75, .2, .1);
    },
    "grapefruit": function(rgb) {
      lean(rgb, 1, .35, .35);
    },
    "dull": function(rgb) {
      desat(rgb, .75);
    },
    "pale": function(rgb) {
      lighten(rgb, .2);
    },
    "light": function(rgb) {
      lighten(rgb, .4);
    },
    "baby": function(rgb) {
      rgb.r += 0.4;
      rgb.r *= 2.0;
      rgb.g += 0.3;
      rgb.g *= 2.0;
      rgb.b += 0.3;
      rgb.b *= 2.0;
    },
    "vanilla": function(rgb) {
      lighten(rgb, .2);
      lerp(rgb, 1, 1, .75, .75);
    },
    "dark": function(rgb) {
      darken(rgb, .5);
    },
    "sepia": function(rgb) {
      lean(rgb, 1, .9, .5);
    },
    "vintage": function(rgb) {
      desat(rgb, .75);
      rgb.b *= .5;
      rgb.g *= .9;
    },
    "rotten": function(rgb) {
      rgb.r *= .8;
      rgb.g += .05;
      rgb.b *= .75;
      desat(rgb, .7);
    },
    "moldy": function(rgb) {
      rgb.r *= .8;
      rgb.g += .15;
      rgb.b *= .85;
      desat(rgb, .7);
    },
    "old": function(rgb) {
      rgb.r *= 1.1;
      rgb.g *= 1.2;
      desat(rgb, .7);
    },
    "gold": function(rgb) {
      desat(rgb, .4);
      lean(rgb, 1, .9, 0);
    },
    "golden": function(rgb) {
      desat(rgb, .6);
      rgb.b *= .1;
      rgb.g *= 1.5;
      rgb.r *= 1.6;
    },
    "dead": function(rgb) {
      desat(rgb, .25);
      rgb.b *= 1.2;
      rgb.g *= 1.1;
    },
    "shit": function(rgb) {
      rgb.r = (rgb.r + 1) * .24;
      rgb.g = (rgb.g + 1) * .18;
      rgb.b *= 0.1;
    },
    "poo": function(rgb) {
      rgb.r = (rgb.r + 1) * .34;
      rgb.g = (rgb.g + 1) * .24;
      rgb.b *= 0.1;
    },
    "poop": function(rgb) {
      rgb.r = (rgb.r + 1) * .24;
      rgb.g = (rgb.g + 1) * .2;
      rgb.b *= 0.1;
    },
    "feces": function(rgb) {
      rgb.r = (rgb.r + 1) * .2;
      rgb.g = (rgb.g + 1) * .12;
      rgb.b *= 0.1;
    },
    "chocolate": function(rgb) {
      rgb.r = (rgb.r + 1) * .3;
      rgb.g = (rgb.g + 1) * .2;
      rgb.b *= 0.1;
    },
    "piss": function(rgb) {
      desat(rgb, .3);
      lean(rgb, 1, .9, .3);
    },
    "banana": function(rgb) {
      desat(rgb, .3);
      lean(rgb, 1, .9, .3);
      sat(rgb, .25);
    },
    "lips": function(rgb) {
      desat(rgb, .2);
      rgb.r += 0.3;
      rgb.r *= 1.8;
      rgb.g += 0.2;
      rgb.g *= 1.2;
      rgb.b += 0.2;
      rgb.b *= 1.2;
    },
    "man": function(rgb) {
      rgb.r += .6;
      rgb.g += .44;
      rgb.b += .22;
      rgb.r *= 1.5;
      desat(rgb, .15);
      lighten(rgb, .23);
    },
    "dude": function(rgb) {
      rgb.r += .65;
      rgb.g += .44;
      rgb.b += .22;
      rgb.r *= 1.5;
      desat(rgb, .15);
      lighten(rgb, .18);
    },
    "guy": function(rgb) {
      rgb.r += .69;
      rgb.g += .42;
      rgb.b += .2;
      rgb.r *= 1.7;
      desat(rgb, .12);
      lighten(rgb, .18);
    },
    "true": function(rgb) {
      var m = (rgb.r * 1.4 + rgb.g * 1.8 + rgb.b * .4) / 3;
      rgb.b += .02;
      lighten(rgb, .3);
      desat(rgb, .1);
      rgb.r *= m;
      rgb.g *= m;
      rgb.b *= m;
    },
    "night": function(rgb) {
      rgb.r *= .1;
      rgb.g *= .1;
      rgb.b += .2;
      desat(rgb, .1);
    },
    "rustic": function(rgb) {
      desat(rgb, .9);
      rgb.r *= 1.3;
      rgb.g *= 1.1;
      rgb.b *= .8;
    },
    "hot": function(rgb) {
      sat(rgb, .7);
      rgb.r += .05;
      rgb.r *= 2;
    },
    "warm": function(rgb) {
      rgb.b *= .75;
      rgb.r += .15;
      rgb.g += .1;
    },
    "cool": function(rgb) {
      rgb.b += .2;
      rgb.r *= .6;
      rgb.g *= .9;
    },
    "cold": function(rgb) {
      desat(rgb, .3);
      rgb.b += .2;
      rgb.g += .05;
      rgb.b *= 1.1;
    },
    "charcoal": function(rgb) {
      lighten(rgb, .1);
      desat(rgb, .8);
      rgb.r *= .4;
      rgb.g *= .4;
      rgb.b *= .4;
    },
    "blood": function(rgb) {
      rgb.g *= .3;
      rgb.b *= .3;
      lean(rgb, .6, 0, 0);
    },
    "summer": function(rgb) {
      rgb.r *= .3;
      rgb.g *= .3;
      sat(rgb, .45);
    },
    "summertime": function(rgb) {
      rgb.r *= .5 + rgb.r;
      rgb.g *= .5 + rgb.g;
      sat(rgb, .5);
      lean(rgb, .2, .3, .05);
    },
    "minion": function(rgb) {
      desat(rgb, .3);
      lean(rgb, 1, .9, .3);
      sat(rgb, .4);
    },
    "playful": function(rgb) {
      desat(rgb, .35);
      rgb.r *= 1.4;
      rgb.g *= 1.1;
      sat(rgb, .25);
    },
    "toasted": function(rgb) {
      rgb.r *= .8;
      rgb.g *= .75;
      rgb.b *= .5;
    },
    "roasted": function(rgb) {
      rgb.r *= .7;
      rgb.g *= .65;
      rgb.b *= .4;
    },
    "death": function(rgb) {
      desat(rgb, .65);
      rgb.r += .2;
      rgb.r *= 1.5;
      rgb.g += .05;
      rgb.g *= 1.1;
      rgb.b += .05;
      rgb.b *= 1.1;
      darken(rgb, .5);
    },
    "frog": function(rgb) {
      rgb.r += .1;
      rgb.g += .4;
      rgb.b += .1;
      lean(rgb, .35, .6, .35);
    },
    "crazy": function(rgb) {
      var t = rgb.r;
      rgb.r = rgb.g;
      rgb.g = rgb.b;
      rgb.b = t;
    },
    "jizz": function(rgb) {
      desat(rgb, .8);
      lighten(rgb, .8);
      rgb.b *= .95;
    },
    "semen": function(rgb) {
      desat(rgb, .8);
      lighten(rgb, .7);
      rgb.b *= .85;
    },
    "alien": function(rgb) {
      desat(rgb, .25);
      lean(rgb, 0, 1, .2);
    },
    "pug": function(rgb) {
      desat(rgb, .45);
      lean(rgb, .3, .3, .1);
      lighten(rgb, .65);
      rgb.b *= .75;
    },
    "pugs": function(rgb) {
      desat(rgb, .45);
      lean(rgb, .3, .3, .1);
      lighten(rgb, .65);
      rgb.b *= .55;
    },
    "dog": function(rgb) {
      lighten(rgb, .3);
      desat(rgb, .05);
      rgb.b *= .6;
      rgb.g *= .85;
      sat(rgb, .05);
    },
    "apple": function(rgb) {
      var f = (rgb.r + rgb.g) / 2;
      rgb.r *= rgb.r * rgb.r;
      rgb.g *= rgb.g * rgb.g;
      rgb.r += .6;
      rgb.g += .5;
      rgb.r *= 1.6;
      rgb.g *= 1.5;
      rgb.b *= .6;
      darken(rgb, f);
    },
    "pie": function(rgb) {
      lean(rgb, .45, .4, 0);
      rgb.r += .1;
      rgb.b *= .6;
      rgb.g *= .7;
    },
    "vibrant": function(rgb) {
      sat(rgb, .8);
      lighten(rgb, .2);
    },
    "bright": function(rgb) {
      sat(rgb, .6);
    },
    "deep": function(rgb) {
      darken(rgb, .9);
      sat(rgb, .3);
      rgb.r *= 10;
      rgb.g *= 10;
      rgb.b *= 10;
    },
    "miracle": function(rgb) {
      rgb.g += .25;
      rgb.r += .3;
      desat(rgb, .1);
      lighten(rgb, .45);
      rgb.b *= .8;
    },
    "disaster": function(rgb) {
      lean(rgb, .95, .2, .05);
      darken(rgb, .75);
      sat(rgb, .8);
      rgb.g += .05;
      darken(rgb, .3);
    },
    "catastrophic": function(rgb) {
      rgb.g += rgb.r;
      rgb.b += rgb.r;
      rgb.r *= 2;
      darken(rgb, .1);
      sat(rgb, .35);
    },
    "violent": function(rgb) {
      rgb.r += .1;
      sat(rgb, .6);
    },
    "shitty": function(rgb) {
      rgb.b *= .2;
      rgb.r += .3;
      rgb.g += .1;
      darken(rgb, .5);
    },
    "dirty": function(rgb) {
      darken(rgb, .3);
      rgb.b *= 1.05;
      rgb.r *= 1.1;
      rgb.g *= 1.1;
    },
    "electric": function(rgb) {
      rgb.g += .8;
      rgb.b += 1.5;
      rgb.r *= .9;
      rgb.r += .3;
      desat(rgb, .2);
      lighten(rgb, .3);
    },
    "cherry": function(rgb) {
      darken(rgb, .5);
      rgb.r += .4;
      rgb.g *= .2;
      rgb.b *= .2;
    },
    "cinnamon": function(rgb) {
      darken(rgb, .5);
      rgb.r += .25;
      rgb.g += .1;
      rgb.b += .05;
    },
    "bloody": function(rgb) {
      desat(rgb, .1);
      rgb.g *= .65;
      rgb.b *= .6;
      darken(rgb, .5);
      rgb.r *= 1.4;
    },
    "penis": function(rgb) {
      desat(rgb, .2);
      rgb.r += .2;
      rgb.b *= .65;
      rgb.g *= .65;
      sat(rgb, .2);
      lighten(rgb, .4);
      rgb.r += .2;
    },
    "dream": function(rgb) {
      desat(rgb, .1);
      rgb.g += .1;
      rgb.b += .22;
      lighten(rgb, .3);
    },
    "denim": function(rgb) {
      rgb.b += .6;
      rgb.r += .5;
      rgb.r *= .2;
      rgb.g += .6;
      rgb.g *= .3;
    }
  };
  Incantate = {
    getColor: function(colorName) {
      if (colorName == undefined || colorName.length == 0)
      {
        return "#000000";
      }

      var color = new RGB(0, 0, 0);
      var parts = colorName.toLowerCase().split(/[^\w]/);
      var func = undefined;
      for(var i = parts.length - 1; i >= 0; i--)
      {
        func = funcs[parts[i]];
        if (func)
        {
          func(color);
        }
      }
      color.normalize();
      return color;
    }
  };
})();
