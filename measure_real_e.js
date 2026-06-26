const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('logo.backup.png');

  // E is roughly at X=110 to 175
  // We need to measure its exact top and bottom Y.
  // But wait! Top logo's left building is at X=125 to 152.
  // E is at X=110 to 175.
  // So they overlap vertically in the same columns!
  // BUT top logo only goes down to Y=252.
  // E is below Y=252.
  
  let topE = -1;
  let botE = -1;
  
  // Scan from Y=255 downwards to avoid top logo
  for (let y = 255; y < 400; y++) {
    let count = 0;
    for (let x = 120; x < 150; x++) {
      let a = (orig.getPixelColor(x, y) >> 24) & 255;
      if (a > 50) count++;
    }
    if (topE === -1 && count > 5) topE = y;
    if (topE !== -1 && count > 5) botE = y;
  }

  console.log(`Real E bounds: Top=${topE}, Bot=${botE}, Height=${botE - topE + 1}`);
}

main().catch(console.error);
