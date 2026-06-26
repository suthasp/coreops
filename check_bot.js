const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png');
  const width = orig.bitmap.width;
  const height = orig.bitmap.height;

  let botY = -1;
  for (let y = height - 1; y >= 0; y--) {
    let hasPixel = false;
    for (let x = 0; x < width; x++) {
      let a = (orig.getPixelColor(x, y) & 255);
      if (a > 10) {
        hasPixel = true;
        break;
      }
    }
    if (hasPixel) {
      botY = y;
      break;
    }
  }

  console.log(`Bottom most pixel in building_x.png is at Y=${botY}. Total height is ${height}. Padding = ${height - 1 - botY}`);
}

main().catch(console.error);
