const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png');
  // Center of the image has the X.
  // The X arms go diagonally. Let's test an area that is definitely the white X arm.
  // X=70, Y=100 should be the left arm of the X.
  console.log('Testing White X arm');
  for (let y = 98; y < 105; y++) {
    let row = '';
    for (let x = 68; x < 75; x++) {
      let color = orig.getPixelColor(x, y);
      let r = (color >>> 24) & 255;
      let g = (color >>> 16) & 255;
      let b = (color >>> 8) & 255;
      row += `[${r},${g},${b}] `;
    }
    console.log(row);
  }
}

main().catch(console.error);
