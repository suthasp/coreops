const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png');
  const width = orig.bitmap.width;
  const height = orig.bitmap.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let color = orig.getPixelColor(x, y);
      let r = (color >> 24) & 255;
      let g = (color >> 16) & 255;
      let b = (color >> 8) & 255;
      let a = color & 255;

      if (a === 0) continue;

      // Cyan check: blue is significantly higher than red
      // The cyan nodes have r~79, g~195, b~247. b-r = 168.
      if (b - r > 40) {
        // Keep cyan as is
        continue;
      } else {
        // It's white or gray (anti-aliased edge)
        // Set RGB to dark navy (30, 41, 59) but preserve original alpha!
        // Wait, if it was an anti-aliased pixel against black, its RGB might be dark.
        // But if we just force RGB to navy and keep alpha, it will be a perfect navy shape!
        let newColor = (30 << 24) | (41 << 16) | (59 << 8) | a;
        orig.setPixelColor(newColor, x, y);
      }
    }
  }

  await orig.write('building_x_light.png');
  console.log('Created building_x_light.png smoothly!');
}

main().catch(console.error);
