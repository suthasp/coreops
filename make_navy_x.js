const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png'); // Read the cleanly cropped original graphic
  const width = orig.bitmap.width;
  const height = orig.bitmap.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let color = orig.getPixelColor(x, y);
      let a = color & 255;

      if (a === 0) continue;

      // Make the pixel solid Navy (30, 41, 59) but preserve original alpha
      // This creates a perfectly smooth, monochrome Navy graphic with zero jagged artifacts!
      let newColor = ((30 << 24) | (41 << 16) | (59 << 8) | a) >>> 0;
      orig.setPixelColor(newColor, x, y);
    }
  }

  // Erase the hook artifact from the bottom left corner
  for (let y = height - 20; y < height; y++) {
    orig.setPixelColor(0, 0, y); 
  }

  await orig.write('building_x_navy.png');
  console.log('Created smooth building_x_navy.png');
}

main().catch(console.error);
