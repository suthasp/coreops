const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png');
  const width = orig.bitmap.width;
  const height = orig.bitmap.height;

  // We want to find the true left and right edges, ignoring the bottom line.
  // The bottom line is roughly in the last 15 pixels of the image.
  // Let's scan from Y=0 to height - 20.
  let leftEdge = -1;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height - 20; y++) {
      let a = (orig.getPixelColor(x, y) & 255);
      if (a > 10) {
        leftEdge = x;
        break;
      }
    }
    if (leftEdge !== -1) break;
  }

  let rightEdge = -1;
  for (let x = width - 1; x >= 0; x--) {
    for (let y = 0; y < height - 20; y++) {
      let a = (orig.getPixelColor(x, y) & 255);
      if (a > 10) {
        rightEdge = x;
        break;
      }
    }
    if (rightEdge !== -1) break;
  }

  console.log(`Original width: ${width}. Racks span from X=${leftEdge} to X=${rightEdge}.`);
  console.log(`To crop: x=${leftEdge}, y=0, w=${rightEdge - leftEdge + 1}, h=${height}`);
}

main().catch(console.error);
