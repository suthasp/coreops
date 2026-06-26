const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('logo.backup.png');

  let eRight = -1;
  for (let x = 160; x > 100; x--) {
    let count = 0;
    for (let y = 244; y < 390; y++) {
      if (((orig.getPixelColor(x, y) >> 24) & 255) > 50) count++;
    }
    if (eRight === -1 && count > 10) {
      eRight = x;
      break;
    }
  }

  let sLeft = -1;
  for (let x = 270; x < 320; x++) {
    let count = 0;
    for (let y = 244; y < 390; y++) {
      if (((orig.getPixelColor(x, y) >> 24) & 255) > 50) count++;
    }
    if (sLeft === -1 && count > 10) {
      sLeft = x;
      break;
    }
  }

  console.log(`E Right: ${eRight}, S Left: ${sLeft}, Gap Center: ${(eRight + sLeft)/2}`);
}

main().catch(console.error);
