const { Jimp } = require('jimp');

async function main() {
  const images = ['building_x.png', 'building_x_light.png'];
  for (const imgName of images) {
    const img = await Jimp.read(imgName);
    const height = img.bitmap.height;
    
    // Erase the 1-pixel base line sticking out at X=0
    for (let y = height - 20; y < height; y++) {
      img.setPixelColor(0, 0, y); // Set to transparent
    }
    
    await img.write(imgName);
    console.log(`Fixed artifact in ${imgName}`);
  }
}

main().catch(console.error);
