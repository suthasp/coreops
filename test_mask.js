const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('building_x.png');
  const width = orig.bitmap.width;
  const height = orig.bitmap.height;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let color = orig.getPixelColor(x, y);
      let a = color & 255;
      if (a === 0) continue;

      let r = (color >>> 24) & 255;
      let g = (color >>> 16) & 255;
      let b = (color >>> 8) & 255;

      let isCyan = false;

      // 1. Center Network Bounding Box (A diamond shape is better, but let's use a rectangle for the core nodes)
      // The nodes are at approx: Top(128, 65), Bottom(128, 145), Left(95, 105), Right(161, 105), Center(128, 105)
      if (x > 85 && x < 171 && y > 60 && y < 150) {
        // Only target the cyan lines and white core, not the X outline.
        // The X outline is thick white lines. The network is thin lines.
        // We can just use the B/R ratio > 1.15 to catch the cyan fringe, 
        // and let the white core be Navy?
        // Actually, if we just keep B-R > 70, the core becomes Navy.
        // We WANT the core to be Cyan!
        // Let's use distance to the nodes/lines!
        
        // Simpler: if B/R > 1.05 and it's not the X outline...
      }

      // Let's just use the true cyan rule (B-R > 70) and dilate it by 1 pixel, not 3!
      // A 1-pixel dilation might be enough to cover the core without leaking into the racks!
    }
  }
}
