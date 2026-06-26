const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('logo.backup.png');

  // Find the top of the center building (highest point of the logo)
  let logoTopY = -1;
  for (let y = 0; y < 100; y++) {
    for (let x = 200; x < 350; x++) {
      let a = (orig.getPixelColor(x, y) >> 24) & 255;
      if (a > 50) {
        logoTopY = y;
        break;
      }
    }
    if (logoTopY !== -1) break;
  }

  // Find the base line (bottom of the top logo)
  let logoBotY = -1;
  for (let y = 260; y > 150; y--) {
    let count = 0;
    for (let x = 150; x < 400; x++) {
      let a = (orig.getPixelColor(x, y) >> 24) & 255;
      if (a > 50) count++;
    }
    // The base line is very wide.
    if (count > 200) {
      logoBotY = y;
      break;
    }
  }

  // Find the top tips of the X.
  // The X is between X=220 and X=340.
  // The top tips are below the center building. 
  // Let's just scan columns 240-250 (left tip) and see where it starts.
  let xTopY = -1;
  for (let y = logoTopY; y < logoBotY; y++) {
    let count = 0;
    for (let x = 240; x < 250; x++) {
      let color = orig.getPixelColor(x, y);
      let a = (color >> 24) & 255;
      let r = (color >> 16) & 255;
      let g = (color >> 8) & 255;
      let b = color & 255;
      // Look for the white or cyan part of the tip
      if (a > 50) count++;
    }
    // if we see solid pixels in this column range, it's the tip
    if (count > 5) {
      xTopY = y;
      break;
    }
  }

  console.log(`Logo Top: ${logoTopY}`);
  console.log(`X Top Tip: ${xTopY}`);
  console.log(`Logo Base Line: ${logoBotY}`);
  console.log(`X Height: ${logoBotY - xTopY}`);
}

main().catch(console.error);
