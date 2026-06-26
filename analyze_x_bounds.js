const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('logo.backup.png');
  // We know the X is around X=240 to 320.
  // Let's find the top horizontal line of the X. It should be a long continuous horizontal line of white pixels.
  // The center of X is roughly 280.
  
  // Let's just print the alpha values for a vertical slice down the middle of the X's left/right arms.
  // Actually, let's just find the first Y from top where we have a solid block of white pixels from X=245 to 255 (top left of X)
  
  let topFlatY = -1;
  for (let y = 30; y < 150; y++) {
    let count = 0;
    for (let x = 245; x <= 265; x++) {
      let a = (orig.getPixelColor(x, y) >> 24) & 255;
      if (a > 50) count++;
    }
    if (count > 15) { // found a solid horizontal-ish line for the tip
      topFlatY = y;
      break;
    }
  }

  let botFlatY = -1;
  for (let y = 250; y > 150; y--) {
    let count = 0;
    for (let x = 245; x <= 265; x++) {
      let a = (orig.getPixelColor(x, y) >> 24) & 255;
      if (a > 50) count++;
    }
    if (count > 15) {
      botFlatY = y;
      break;
    }
  }

  console.log(`Top Flat Y: ${topFlatY}`);
  console.log(`Bot Flat Y: ${botFlatY}`);
}

main().catch(console.error);
