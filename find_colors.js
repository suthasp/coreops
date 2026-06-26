const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png');
  const width = orig.bitmap.width;
  const height = orig.bitmap.height;

  let maxCyanDiff = 0;
  let maxCyanColor = '';
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let color = orig.getPixelColor(x, y);
      let r = (color >> 24) & 255;
      let g = (color >> 16) & 255;
      let b = (color >> 8) & 255;
      let a = color & 255;
      
      if (a > 50) {
        let diff = b - r;
        if (diff > maxCyanDiff) {
          maxCyanDiff = diff;
          maxCyanColor = `[${r},${g},${b}] at X=${x}, Y=${y}`;
        }
      }
    }
  }
  console.log(`Max cyan difference: ${maxCyanDiff}. Color: ${maxCyanColor}`);
  
  // Find where the white building walls are
  let wallColor = orig.getPixelColor(5, 50); // Inside the left rack
  let wr = (wallColor >> 24) & 255;
  let wg = (wallColor >> 16) & 255;
  let wb = (wallColor >> 8) & 255;
  console.log(`Wall color at 5,50: [${wr},${wg},${wb}]`);
}

main().catch(console.error);
