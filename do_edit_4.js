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
  // X physical height is 167 (from Y=49 to 215). Target is 87.
  // Scale factor = 87 / 167 = 0.520958
  let scale = 87 / 167;
  let newH = Math.round(225 * scale); // 117
  let newW = Math.round(315 * scale); // 164
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
  // X Top flat Y in crop is 49 - 30 = 19. Scaled is 19 * scale = 9.9 (round to 10)
  // Target Y for top of X is 275.
  let startX = Math.round(225.5 - newW / 2);
  let startY = 275 - Math.round(19 * scale); // 275 - 10 = 265

  // 7. Composite topLogo onto newImg
  newImg.composite(topLogo, startX, startY);

  // 8. Composite orig onto newImg (E and S go over the racks)
  newImg.composite(orig, 0, 0);

  // 9. Save
  await newImg.write('logo.png');
  console.log('Done! logo.png has been updated to version 4.');
}

main().catch(console.error);
