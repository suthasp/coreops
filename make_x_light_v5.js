const { Jimp } = require('jimp');

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

async function main() {
  const orig = await Jimp.read('building_x.png');
  const width = orig.bitmap.width;
  const height = orig.bitmap.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let color = orig.getPixelColor(x, y);
      let r = (color >>> 24) & 255;
      let g = (color >>> 16) & 255;
      let b = (color >>> 8) & 255;
      let a = color & 255;

      if (a === 0) continue;

      let ir = 255 - r;
      let ig = 255 - g;
      let ib = 255 - b;

      let [h, s, l] = rgbToHsl(ir, ig, ib);
      h = (h + 0.5) % 1.0;
      let [hr, hg, hb] = hslToRgb(h, s, l);

      // Map pure black [0,0,0] to [30,41,59]
      // And we scale this addition based on the lightness of the inverted image so we don't blow out the whites
      let fr = Math.min(255, hr + 30);
      let fg = Math.min(255, hg + 41);
      let fb = Math.min(255, hb + 59);

      let newColor = ((fr << 24) | (fg << 16) | (fb << 8) | a) >>> 0;
      orig.setPixelColor(newColor, x, y);
    }
  }

  // Erase the hook artifact from the bottom left corner since we are using building_x.png
  for (let y = height - 20; y < height; y++) {
    orig.setPixelColor(0, 0, y); 
  }

  await orig.write('building_x_light.png');
  console.log('Created perfect building_x_light.png');
}

main().catch(console.error);
