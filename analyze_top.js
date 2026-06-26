const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png'); // Original cropped image before light conversion
  // Top of the building is around x=128 (since width is 256, center is 128)
  // Let's find the top pixel.
  let topY = -1;
  let topX = -1;
  for (let y = 0; y < 20; y++) {
    for (let x = 0; x < orig.bitmap.width; x++) {
      if ((orig.getPixelColor(x, y) & 255) > 10) {
        topY = y;
        topX = x;
        break;
      }
    }
    if (topY !== -1) break;
  }
  console.log(`Top pixel at X=${topX}, Y=${topY}`);
  
  // Let's print the colors of the top 5x5 area
  for (let y = topY; y < topY + 5; y++) {
    for (let x = topX - 2; x <= topX + 2; x++) {
      let color = orig.getPixelColor(x, y);
      let r = (color >> 24) & 255;
      let g = (color >> 16) & 255;
      let b = (color >> 8) & 255;
      let a = color & 255;
      console.log(`X=${x}, Y=${y} -> R:${r} G:${g} B:${b} A:${a} | B-R: ${b-r}`);
    }
  }
}

main().catch(console.error);
