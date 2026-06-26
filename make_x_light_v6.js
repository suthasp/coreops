const { Jimp } = require('jimp');

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

      let ratio = r > 0 ? b / r : 999;
      
      // Rule to identify the Cyan Network (both the bright white core and the cyan fringes)
      let isCyanNetwork = (r >= 210 && b >= 230) || (ratio > 1.35);

      if (isCyanNetwork) {
        // It's the cyan network! Keep original color so it glows perfectly.
        // We might want to slightly boost its brightness or color if needed, 
        // but original is best to avoid artifacts.
        continue;
      } else {
        // It's the building wall or its anti-aliased edge!
        // Convert to Navy [30, 41, 59] but preserve original alpha!
        let newColor = ((30 << 24) | (41 << 16) | (59 << 8) | a) >>> 0;
        orig.setPixelColor(newColor, x, y);
      }
    }
  }

  // Erase the hook artifact from the bottom left corner
  for (let y = height - 20; y < height; y++) {
    orig.setPixelColor(0, 0, y); 
  }

  // Save to a NEW filename so the browser cache doesn't trick the user again!
  await orig.write('building_x_light_final.png');
  console.log('Created building_x_light_final.png');
}

main().catch(console.error);
