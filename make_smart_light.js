const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png');
  const width = orig.bitmap.width;
  const height = orig.bitmap.height;

  // Create a 2D array for the cyan mask
  const cyanMask = Array.from({ length: height }, () => new Array(width).fill(false));

  // 1. Identify true cyan pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let color = orig.getPixelColor(x, y);
      let r = (color >>> 24) & 255;
      let g = (color >>> 16) & 255;
      let b = (color >>> 8) & 255;
      let a = color & 255;

      // True cyan has significantly more blue than red
      if (a > 20 && (b - r > 70)) {
        cyanMask[y][x] = true;
      }
    }
  }

  // 2. Dilate the cyan mask to cover the white cores of the cyan lines
  const dilatedMask = Array.from({ length: height }, () => new Array(width).fill(false));
  const DILATION_RADIUS = 3; // 3 pixels radius should cover the core

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (cyanMask[y][x]) {
        // Mark all pixels within radius as true in dilated mask
        for (let dy = -DILATION_RADIUS; dy <= DILATION_RADIUS; dy++) {
          for (let dx = -DILATION_RADIUS; dx <= DILATION_RADIUS; dx++) {
            if (dx*dx + dy*dy <= DILATION_RADIUS*DILATION_RADIUS) {
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
  }

  // 3. Apply the mask to create the final image
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let color = orig.getPixelColor(x, y);
      let a = color & 255;

      if (a === 0) continue;

      if (dilatedMask[y][x]) {
        // Inside the cyan network region: keep original color!
        // This preserves the white core and the cyan fringes perfectly.
        continue;
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

  await orig.write('building_x_light.png');
  console.log('Created smart masked building_x_light.png');
}

main().catch(console.error);
