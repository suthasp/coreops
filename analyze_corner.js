const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png');
  const width = orig.bitmap.width;
  const height = orig.bitmap.height;

  console.log('Printing bottom-left corner of building_x.png (bottom 30 pixels, left 15 pixels)');
  for (let y = height - 30; y < height; y++) {
    let row = '';
    for (let x = 0; x < 15; x++) {
      let a = (orig.getPixelColor(x, y) & 255);
      if (a > 128) {
        row += 'X';
      } else if (a > 20) {
        row += 'x';
      } else {
        row += '.';
      }
    }
    console.log(`Y=${y.toString().padStart(3)}: ${row}`);
  }
}

main().catch(console.error);
