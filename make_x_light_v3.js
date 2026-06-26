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

      let [h, s, l] = rgbToHsl(r, g, b);
      
      // The cyan nodes have high saturation and hue around 0.5 - 0.6.
      // White buildings have very high lightness, or low saturation.
      // If a pixel is heavily saturated and is in the cyan/blue range, we keep it.
      // Cyan network lines might be very bright, so their saturation might be lower.
      // But they will still have the cyan hue (0.5 to 0.6).
      // If hue is cyan (approx 0.45 to 0.65) AND saturation > 0.2 AND it's not purely white (l < 0.98), maybe it's cyan?
      
      // Actually, let's just use a simple distance to pure white vs distance to cyan.
      let distToWhite = Math.sqrt((r-255)**2 + (g-255)**2 + (b-255)**2);
      // Cyan node average: 75, 167, 214
      let distToCyan = Math.sqrt((r-75)**2 + (g-167)**2 + (b-214)**2);
      
      // We want to turn the white/gray building into navy (30, 41, 59).
      // What if we just blend it?
      // If the pixel is closer to white than to cyan, we turn it navy?
      
      // Let's test a simple rule: if it's mostly white/gray (r, g, b are all close to each other, e.g. within 30 of each other)
      // AND it's bright (r > 100), it's the building.
      let maxColor = Math.max(r, g, b);
      let minColor = Math.min(r, g, b);
      
      // Cyan has high maxColor (B) and low minColor (R).
      if (maxColor - minColor > 40 || (b > r + 30 && b > g)) {
        // It's a colored pixel (cyan)
        continue;
      } else {
        // It's a white/gray pixel. Convert to navy.
        // We preserve the original alpha.
        // And we can even scale the brightness!
        // But the original buildings are bright white. So mapping them flatly to navy is fine.
        let newColor = (30 << 24) | (41 << 16) | (59 << 8) | a;
        orig.setPixelColor(newColor, x, y);
      }
    }
  }

  await orig.write('building_x_light.png');
  console.log('Created better building_x_light.png');
}

main().catch(console.error);
