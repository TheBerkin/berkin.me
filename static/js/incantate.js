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

  var ib = function(rgb) {
    var x = (1 - clamp(rgb.b, 0, 1)) * clamp(1 - (rgb.g + rgb.r) / 2, 0, 1);
    rgb.r *= x;
    rgb.g *= x;
    rgb.b *= x;
  }

  var ig = function(rgb) {
    var x = (1 - clamp(rgb.g, 0, 1)) * clamp(1 - (rgb.b + rgb.r) / 2, 0, 1);
    rgb.r *= x;
    rgb.g *= x;
    rgb.b *= x;
  }

  var ir = function(rgb) {
    var x = (1 - clamp(rgb.r, 0, 1)) * clamp(1 - (rgb.g + rgb.b) / 2, 0, 1);
    rgb.r *= x;
    rgb.g *= x;
    rgb.b *= x;
  }

  var invert = function(rgb) {
    rgb.r = 1 - rgb.r;
    rgb.g = 1 - rgb.g;
    rgb.b = 1 - rgb.b;
  }

  var yellowize = function(rgb, amount) {
    rgb.g += amount;
    rgb.r += amount;
  }

  var hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255
    ] : null;
  }

  var guess = function(str)
  {
    var x = 0;
    var g = [0, 0, 0];
    var l = str.length;
    for(var i = 0; i < l; i++)
    {
      var col = guessTable[str.charAt(i).toLowerCase()] || [.5, .5, .5, .5];
      var m = col[3];
      g[0] = (g[0] * m * x + col[0]) / (x + 1);
      g[1] = (g[1] * m * x + col[1]) / (x + 1);
      g[2] = (g[2] * m * x + col[2]) / (x + 1);
      x++;
    }
    return g;
  }

  var guessTable = {
    "a": [7, 5, .01, .1],
    "b": [.5, .1, .001, .5],
    "c": [.1, .4, .05, .8],
    "d": [.5, .2, .1, .65],
    "e": [.8, .5, .1, .3],
    "f": [-3, .5, -1, 1.1],
    "g": [.05, .12, .19, 1],
    "h": [.85, .5, .4, 0.4],
    "i": [5, 5, 9, 0.5],
    "j": [.6, .5, 1, 0.32],
    "k": [.3, .1, .45, 0.77],
    "l": [-.1, -.1, .22, 0.9],
    "m": [.4, 0, 0.01, 1],
    "n": [.6, .24, 0.01, 1],
    "o": [.9, .32, -9, 1],
    "p": [.98, .03, 0.07, 1],
    "q": [-.5, 0, 0, 1.5],
    "r": [2, 0, -1, 1.2],
    "s": [2, 3, 5, 0.3],
    "t": [0, 0, .1, 0.6],
    "u": [1, 1, .5, 1],
    "v": [.1, .9, .22, .9],
    "w": [.9, .3, .2, .9],
    "x": [.1, .1, .3, .65],
    "y": [.1, .45, .1, .98],
    "z": [0, .01, .46, 1],
    "#": [-1, -1, 1, .2],
    "1": [1, .1, .1, .9],
    "2": [1, 0, 2, .9],
    "3": [2, 0, 1, .9],
    "4": [.4, 0, .1, .9],
    "5": [1, 2, 3, .9],
    "6": [8, 6, 1, .9],
    "7": [5, 6, 1, .9],
    "8": [0, .3, .4, .9],
    "9": [0, 0, .1, .9],
    "0": [2, 2, 2.5, .9],
    "'": [3, 2, 2.5, .9],
  }

  var bases = {
    "black": [0, 0, 0],
    "grey": [.5, .5, .5],
    "gray": [.5, .5, .5],
    "white": [1, 1, 1],
    "red": [1, 0, 0],
    "grass": "229920",
    "fog": "9ebfb8",
    "chill": "c9dddd",
    "reddish": [.4, 0, 0],
    "crimson": [.863, .079, .236],
    "maroon": [.502, 0, 0],
    "vermillion": [.890, .259, .204],
    "facepunch": [.72, 0, 0],
    "puce": [.447, .203, .215],
    "orange": [1, .55, 0],
    "gold": [1, .9, 0],
    "yellow": [1, 1, 0],
    "lemon": [1, .97, 0],
    "beige": [.961, .961, .863],
    "khaki": [.76, .69, .57],
    "sepia": [1, .9, .5],
    "blond": [.98, .94, .75],
    "blonde": [.98, .94, .72],
    "brown": [.4, .3, .1],
    "rust": [.7, .4, .1],
    "brick": [.75, .2, .1],
    "burgundy": [.5647, 0, .1254],
    "cream": [.961, .961, .8],
    "peach": [1, .899, .706],
    "amber": [1, .75, 0],
    "green": [0, 1, 0],
    "greenish": [0, .5, 0],
    "forest": [0, .7, 0],
    "chartreuse": [.5, 1, 0],
    "lime": [.75, 1, 0],
    "vomit": [.5, .9, .24],
    "puke": [.25, .4, .15],
    "blue": [0, 0, 1],
    "bluish": [0, 0, .5],
    "navy": [0, 0, .4],
    "blueberry": [.2, .22, .45],
    "indigo": [.295, 0, .51],
    "lilac": [.785, .636, .785],
    "magenta": [1, 0, 1],
    "fuchsia": [.65, .22, .65],
    "pink": [1, .6, .6],
    "grape": [.45, .15, .3],
    "mauve": [.87, .64, 1],
    "cyan": [0, 1, 1],
    "aqua": [0, .8, .75],
    "cerulean": [0, .25, 1],
    "aquamarine": [.5, 1, .832],
    "teal": [0, .5, .5],
    "turquoise": [.1, .6, .7],
    "sky": [.4, .63, 1],
    "azure": [0, .5, .1],
    "ochre": [.8, .467, .135],
    "taupe": [.282, .235, .196],
    "umber": [.388, .318, .278],
    "coffee": [.31, .235, .06],
    "cornflower": [.392, .584, .929],
    "periwinkle": [.8, .8, 1],
    "olive": [.5, .5, 0],
    "violet": [.4, 0, .45],
    "purple": [.3, 0, .3],
    "grapefruit": [1, .35, .35],
    "walnut": "7a6940",
    "midnight": "211626",
    "moon": "c9cbcc",
    "moonlight": "cdd4d6",
    "scab": "60483f",
    "bone": "edeae1",
    "ass": "dda277",
    "why": [-0.2, .3, .2],
    "sunset": "d65519",
    "licorice": "0b0611",
    "espresso": "23170c",
    "taco": "eac035",
    "burrito": "f2e093",
    "meth": "f4f7f7",
    "lavender": "a370ad",
    "taint": "ba997a",
    "sea-floor": "4d8e74",
    "celery": "74bf2a",
    "space": "242535",
    "passion": "c60519",
    "love": "b72840",
    "heartbreak": "843341",
    "lust": "f46235",
    "pruple": "b531c4"
  };

  var filters = {
    "breeze": function(rgb) {
      lighten(rgb, .6);
      rgb.b += .06;
    },
    "sea": function(rgb) {
      darken(rgb, .5);
      desat(rgb, .3);
      rgb.g += rgb.b;
      rgb.g += .3;
      rgb.b += .4;
      rgb.r *= .1;
    },
    "ocean": function(rgb) {
      darken(rgb, .5);
      desat(rgb, .4);
      rgb.g += rgb.b;
      rgb.g += .25;
      rgb.b += .45;
      rgb.r *= .1;
    },
    "royal": function(rgb) {
      sat(rgb, 1);
      lighten(rgb, .2);
      if (rgb.b > rgb.r + rgb.g)
      {
        rgb.g += .4;
        rgb.r += .1;
      }
      darken(rgb, .3);
    },
    "rusty": function(rgb) {
      darken(rgb, .7);
      lean(rgb, .7, .4, .1);
    },
    "soup": function(rgb) {
      darken(rgb, .7);      
      rgb.r += 0.3;
      rgb.g += 2.5;
      rgb.g *= 0.1;
      rgb.b *= 0.01;  
      rgb.b -= 0.5;   
      desat(rgb, 0.25);
    },
    "amaranth": function(rgb) {
      desat(rgb, .1);
      darken(rgb, .5);
      lean(rgb, .9, .17, .31);
    },
    "dull": function(rgb) {
      desat(rgb, .75);
    },
    "antique": function(rgb) {
      desat(rgb, .1);
      darken(rgb, .1);
      rgb.b *= .9;
    },
    "bitter": function(rgb) {
      desat(rgb, .12);
      rgb.r += .12;
      rgb.g += .08;
      rgb.g *= 1.1;
    },
    "pale": function(rgb) {
      lighten(rgb, .2);
    },
    "light": function(rgb) {
      lighten(rgb, .4);
    },
    "dank": function(rgb) {
      rgb.b *= 0.3;
      darken(rgb, .45);
      rgb.g *= 1.2;
    },
    "baby": function(rgb) {
      rgb.r += 0.4;
      rgb.r *= 2.0;
      rgb.g += 0.3;
      rgb.g *= 2.0;
      rgb.b += 0.3;
      rgb.b *= 2.0;
    },
    "babies": function(rgb)
    {
      filters["baby"](rgb);
      rgb.r += 0.02;
      darken(rgb, 0.03);
    },
    "vanilla": function(rgb) {
      lighten(rgb, .2);
      lerp(rgb, 1, 1, .75, .75);
    },
    "dark": function(rgb) {
      darken(rgb, .5);
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
    "turd": function(rgb) {
      rgb.r = (rgb.r + 1) * .22;
      rgb.g = (rgb.g + 1) * .155;
      rgb.b *= 0.12;
    },
    "chocolate": function(rgb) {
      rgb.r = (rgb.r + 1) * .5;
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
    "friend": function(rgb) {
      rgb.r += .72;
      rgb.g += .45;
      rgb.b += .2;
      rgb.r *= 1.5;
      desat(rgb, .15);
      lighten(rgb, .18);
    },
    "buddy": function(rgb) {
      rgb.r += .72;
      rgb.g += .45;
      rgb.b += .25;
      rgb.r *= 1.5;
      desat(rgb, .15);
      lighten(rgb, .20);
    },
    "guy": function(rgb) {
      rgb.r += .69;
      rgb.g += .42;
      rgb.b += .2;
      rgb.r *= 1.7;
      desat(rgb, .12);
      lighten(rgb, .18);
    },
    "woman": function(rgb) {
      rgb.r += .7;
      rgb.g += .3;
      rgb.b += .12;
      rgb.r *= 1.4;
      desat(rgb, .03);
      lighten(rgb, .22);
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
    "day": function(rgb) {
      desat(rgb, .2);
      lighten(rgb, .65);
      rgb.g *= 1.2;
      rgb.r *= 1.3;
      rgb.b *= .78;
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
      rgb.r *= 1.4;
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
    "tea": function(rgb) {
      darken(rgb, .8);
      lighten(rgb, .3);
      sat(rgb, .5);
      rgb.r *= 1.35;
      rgb.b *= .8;
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
    "cheery": function(rgb) {
      desat(rgb, .35);
      rgb.r *= 1.5;
      rgb.g *= 1.1;
      sat(rgb, .25);
    },
    "happy": function(rgb) {
      desat(rgb, .35);
      rgb.r *= 1.5;
      rgb.g *= 1.25;
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
    "salty": function(rgb) {
      desat(rgb, .12);
      lighten(rgb, .08);
    },
    "salted": function(rgb) {
      desat(rgb, .14);
      lighten(rgb, .1);
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
    "cum": function(rgb) {
      desat(rgb, .8);
      lighten(rgb, .75);
      rgb.b *= .875;
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
    "fire": function(rgb) {
      rgb.r += .55;
      rgb.g += .3;
      sat(rgb, .65);
    },
    "spicy": function(rgb) {
      darken(rgb, .3);
      rgb.r += .45;
      rgb.g += .2;
      rgb.b += .05;
      sat(rgb, .3);
      darken(rgb, .2);
    },
    "spice": function(rgb) {
      darken(rgb, .65);
      rgb.r += .25;
      rgb.g += .2;
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
    "dick": function(rgb) {
      desat(rgb, .2);
      rgb.r += .25;
      rgb.b *= .65;
      rgb.g *= .65;
      sat(rgb, .2);
      lighten(rgb, .4);
      rgb.r += .2;
    },
    "cock": function(rgb) {
      desat(rgb, .2);
      rgb.r += .29;
      rgb.b *= .85;
      rgb.g *= .65;
      sat(rgb, .2);
      lighten(rgb, .4);
      rgb.r += .2;
    },
    "anus": function(rgb) {
      desat(rgb, .2);
      rgb.r += .18;
      rgb.b *= .62;
      rgb.g *= .635;
      sat(rgb, .23);
      lighten(rgb, .45);
      rgb.r += .15;
    },
    "nipple": function(rgb) {
      desat(rgb, .2);
      rgb.r += .24;
      rgb.b *= .58;
      rgb.g *= .63;
      sat(rgb, .26);
      lighten(rgb, .45);
      rgb.r += .15;
    },
    "asshole": function(rgb) {
      desat(rgb, .2);
      rgb.r += .18;
      rgb.b *= .22;
      rgb.g *= .635;
      sat(rgb, .23);
      lighten(rgb, .35);
      rgb.r += .15;
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
    },
    "compliment": invert,
    "inverted": invert,
    "inverse": invert,
    "of": function(rgb) {
      var b = rgb.isBright();
      sat(rgb, 2.5);
      if (b)
      {
        darken(rgb, .3);
      }
      else
      {
        lighten(rgb, .3);
      }
    },
    "creamy": function(rgb) {      
      yellowize(rgb, 0.2);
      desat(rgb, 0.14);
      lighten(rgb, 0.3);
    },
    "surprise": function(rgb) {
      rgb.r += 0.4;
      rgb.g += 0.6;
      lighten(rgb, 0.6);
      sat(rgb, 0.2);
      rgb.r += 0.1;
      rgb.b -= 0.05;
      rgb.g += 0.12;
      darken(rgb, rgb.g - rgb.r);
    },
    "a": function(rgb) {
      lighten(rgb, 0.01);
      rgb.g *= 1.05;
      rgb.r *= 1.07;
    },
    "an": function(rgb) {
      lighten(rgb, 0.01);
      rgb.g *= 1.12;
      rgb.r *= 1.07;
      rgb.b -= 0.02;
    },
    "dull": function(rgb) {
      darken(rgb, 0.05);
      desat(rgb, 0.35);
      rgb.r *= rgb.r;
    },
    "moist": function(rgb) {      
      desat(rgb, 0.2);
      lighten(rgb, 0.03);
      rgb.b *= 1.1;
    },
    "towelette": function(rgb) {   
      desat(rgb, 0.7);   
      rgb.r += 0.7;
      rgb.g += 0.7;
      rgb.b += 0.8;
    },
    "tropical": function(rgb) {
      lean(rgb, .2, .12, -.1);
    },
    "bleached": function(rgb) {
      desat(rgb, 0.85);
      lighten(rgb, 0.25);
      rgb.r += 0.05;
      rgb.g += 0.065;
    },
    "fucking": function(rgb) {
      rgb.r += 0.15;
      rgb.g *= rgb.r;
      lighten(rgb, 0.1);
      sat(rgb, 0.1);
      rgb.b -= 0.1;
      rgb.b *= rgb.r;
      lean(rgb, 0.2, 0.1, 0);
      lighten(rgb, 0.2);
      sat(rgb, 0.3);
    },
    "juicy": function(rgb) {
      sat(rgb, 0.2);
      rgb.r *= 1.2;
      rgb.g *= 1.1;
      rgb.g += (rgb.r + rgb.g) * 0.5 - 0.45;
      rgb.b += rgb.r * 0.1 + 0.1;      
      yellowize(rgb, 0.5);
      darken(rgb, 0.37);
    },
    "fresh": function(rgb) {
      lighten(rgb, 0.11);
      sat(rgb, 0.1);
    },
    "brotherly": function(rgb) {
      darken(rgb, .1);
      rgb.r *= 1.4;
      rgb.g *= 1.2;
      sat(rgb, .1);
      rgb.b *= rgb.g;
      darken(rgb, .2);
    }
  };
  Incantate = {
    getColor: function(colorName) {
      if (colorName == undefined || colorName.length == 0)
      {
        return new RGB(0, 0, 0);
      }

      var color = new RGB(0, 0, 0);
      var n = 0;
      var parts = colorName.toLowerCase().split(/[^\w]/);
      var component = undefined;
      for(var i = parts.length - 1; i >= 0; i--)
      {
        if (parts[i].length === 0) continue;
        if (component = bases[parts[i]])
        {
          // Convert hex codes
          if (typeof component === 'string' || component instanceof String)
          {
            component = hexToRgb(component);            
          }
          color.r = (color.r * n + (component[0])) / (n + 1);
          color.g = (color.g * n + (component[1])) / (n + 1);
          color.b = (color.b * n + (component[2])) / (n + 1);
        }
        else if (component = filters[parts[i]])
        {
          component(color);
        }
        else
        {
          component = guess(parts[i]);
          color.r = (color.r * n + (component[0])) / (n + 1);
          color.g = (color.g * n + (component[1])) / (n + 1);
          color.b = (color.b * n + (component[2])) / (n + 1);
        }
        n++;
      }
      color.normalize();
      return color;
    }
  };
})();
