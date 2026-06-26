const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('logo.backup.png');

  let topE = -1;
  let botE = -1;
  for (let y = 200; y < 400; y++) {
    // E is around X=110 to 178
    let count = 0;
    for (let x = 120; x < 150; x++) {
      let a = (orig.getPixelColor(x, y) >> 24) & 255;
      if (a > 50) count++;
    }
    if (topE === -1 && count > 10) topE = y;
    if (topE !== -1 && count > 10) botE = y;
  }

  console.log(`E bounds: Top=${topE}, Bot=${botE}, Height=${botE - topE}`);
}

main().catch(console.error);
