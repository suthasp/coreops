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
  // Target X height is 146 (height of E and S). Original X height is 167.
  let scale = 146 / 167; // 0.87425
  let newH = Math.round(225 * scale); // 197
  let newW = Math.round(315 * scale); // 275
  topLogo.resize({ w: newW, h: newH });

  // 3. Erase top logo from orig
  for (let y = 30; y <= 260; y++) {
    for (let x = 120; x <= 440; x++) {
      orig.setPixelColor(0x00000000, x, y);
    }
  }

  // 4. Erase bottom X from orig
  for (let y = 240; y <= 390; y++) {
    for (let x = 165; x <= 265; x++) {
      orig.setPixelColor(0x00000000, x, y);
    }
  }

  // 5. Create a new blank image
  const newImg = new Jimp({ width, height, color: 0x00000000 });

  // 6. Calculate position for topLogo
  // X Top flat Y in orig is 49. In crop it's 49-30=19. Scaled is 19 * scale = 16.6 (17)
  // Target Y for top of E is 244.
  // startY + 17 = 244 -> startY = 227
  let startY = 244 - Math.round(19 * scale);
  
  // Gap center is 215
  let startX = Math.round(215 - newW / 2);

  // 7. Composite topLogo onto newImg
  newImg.composite(topLogo, startX, startY);

  // 8. Composite orig onto newImg
  newImg.composite(orig, 0, 0);

  // 9. Save
  await newImg.write('logo.png');
  console.log('Done! logo.png has been updated to version 5.');
}

main().catch(console.error);
