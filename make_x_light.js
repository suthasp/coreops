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

      // If the pixel is close to white, make it dark slate gray (#1e293b)
      if (r > 200 && g > 200 && b > 200 && a > 50) {
        // Change white to dark color: RGB(30, 41, 59)
        let newColor = (30 << 24) | (41 << 16) | (59 << 8) | a;
        orig.setPixelColor(newColor, x, y);
      }
    }
  }

  await orig.write('building_x_light.png');
  console.log('Created building_x_light.png');
}

main().catch(console.error);
