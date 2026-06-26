const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png');
  const width = orig.bitmap.width;
  const height = orig.bitmap.height;

  const cyanMask = Array.from({ length: height }, () => new Array(width).fill(false));

  // 1. Identify true cyan pixels and explicit regions
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let color = orig.getPixelColor(x, y);
      let r = (color >>> 24) & 255;
      let g = (color >>> 16) & 255;
      let b = (color >>> 8) & 255;
      let a = color & 255;

      if (a < 20) continue;

      // True cyan fringe
      if (b - r > 60) {
        cyanMask[y][x] = true;
      }

      // Left server rack cyan lines (X: 16-29, Y: 95-135)
      // We only want the glowing horizontal lines, which are very bright (R+G+B > 650)
      if (x >= 16 && x <= 29 && y >= 95 && y <= 135) {
         if (r + g + b > 650) {
           cyanMask[y][x] = true;
         }
      }

      // Right server rack cyan lines (X: 227-240, Y: 95-135)
      if (x >= 227 && x <= 240 && y >= 95 && y <= 135) {
         if (r + g + b > 650) {
           cyanMask[y][x] = true;
         }
      }
    }
  }

  // 2. Dilate the cyan mask by EXACTLY 1 pixel
  const dilatedMask = Array.from({ length: height }, () => new Array(width).fill(false));
  const DILATION_RADIUS = 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (cyanMask[y][x]) {
        for (let dy = -DILATION_RADIUS; dy <= DILATION_RADIUS; dy++) {
          for (let dx = -DILATION_RADIUS; dx <= DILATION_RADIUS; dx++) {
            let ny = y + dy;
            let nx = x + dx;
            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              dilatedMask[ny][nx] = true;
            }
          }
        }
      }
    }
  }

  // 3. Apply the mask to create the final image
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let color = orig.getPixelColor(x, y);
      let a = color & 255;

      if (a === 0) continue;

      if (dilatedMask[y][x]) {
        // Inside the cyan network region:
        // Tint the pure white core to Cyan so it pops on a light background!
        let r = (color >>> 24) & 255;
        let b = (color >>> 8) & 255;
        if (b - r < 30) {
           let newColor = ((0 << 24) | (180 << 16) | (216 << 8) | a) >>> 0;
           orig.setPixelColor(newColor, x, y);
        } else {
           orig.setPixelColor(color, x, y);
        }
      } else {
        // Outside the cyan network region: it's the building/racks.
        // Convert to Navy [30, 41, 59] and preserve alpha.
        let newColor = ((30 << 24) | (41 << 16) | (59 << 8) | a) >>> 0;
        orig.setPixelColor(newColor, x, y);
      }
    }
  }

  // Erase the hook artifact from the bottom left corner
  for (let y = height - 20; y < height; y++) {
    orig.setPixelColor(0, 0, y); 
  }

  await orig.write('building_x_light_final3.png');
  console.log('Created building_x_light_final3.png');
}

main().catch(console.error);
