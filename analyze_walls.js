const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png');
  console.log('Testing building walls (left side)');
  for (let y = 105; y < 115; y++) {
    let row = '';
    for (let x = 40; x < 50; x++) {
      let color = orig.getPixelColor(x, y);
      let r = (color >> 24) & 255;
      let g = (color >> 16) & 255;
      let b = (color >> 8) & 255;
      row += `[${r},${g},${b}] `;
    }
    console.log(row);
  }
}

main().catch(console.error);
