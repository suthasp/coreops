const { Jimp } = require('jimp');
const fs = require('fs');

async function main() {
  const orig = await Jimp.read('logo.backup.png');
  const width = orig.bitmap.width;
  const height = orig.bitmap.height;

  // 1. Extract the top logo
  const topLogo = orig.clone();
  topLogo.crop({ x: 125, y: 30, w: 315, h: 225 });

  // 2. Scale the top logo
  // Based on calculations, to make the X exactly 86px high,
  // the entire top logo should be scaled to ~106px high.
  let newH = 106;
  let newW = Math.round(315 * (newH / 225));
  topLogo.resize({ w: newW, h: newH });

  // 3. Erase top logo from orig
  for (let y = 30; y <= 260; y++) {
    for (let x = 120; x <= 440; x++) {
      orig.setPixelColor(0x00000000, x, y);
    }
  }

  // 4. Erase bottom X from orig
  for (let y = 265; y <= 370; y++) {
    for (let x = 180; x <= 271; x++) {
      orig.setPixelColor(0x00000000, x, y);
    }
  }

  // 5. Create a new blank image
  const newImg = new Jimp({ width, height, color: 0x00000000 });

  // 6. Calculate position for topLogo
  let startX = Math.round(225.5 - newW / 2);
  let startY = 270; // This aligns the X exactly with E and S (Y=275 to 361)

  // 7. Composite topLogo onto newImg (goes to background)
  newImg.composite(topLogo, startX, startY);

  // 8. Composite orig onto newImg (E and S go over the racks)
  newImg.composite(orig, 0, 0);

  // 9. Save
  await newImg.write('logo.png');
  console.log('Done! logo.png has been updated to version 3.');
}

main().catch(console.error);
