const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png');
  // Center of X is around width/2, height/2 (x=128, y=112)
  // Let's print colors around there
  for (let y = 105; y < 115; y += 2) {
    let row = '';
    for (let x = 120; x < 135; x += 2) {
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
