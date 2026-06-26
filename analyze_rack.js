const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png');
  
  console.log('Testing left rack center');
  // Left rack is around X=15 to 30. Y=100 to 120.
  for (let y = 100; y < 110; y++) {
    let row = '';
    for (let x = 15; x < 25; x++) {
      let color = orig.getPixelColor(x, y);
      let r = (color >>> 24) & 255;
      let g = (color >>> 16) & 255;
      let b = (color >>> 8) & 255;
      let a = color & 255;
      if (a > 50) {
        row += `[${r},${g},${b}] `;
      } else {
        row += `(...) `;
      }
    }
    console.log(`Y=${y}: ${row}`);
  }
}

main().catch(console.error);
