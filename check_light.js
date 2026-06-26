const { Jimp } = require('jimp');

async function main() {
  const img = await Jimp.read('building_x_light.png');
  // Check the building wall in the light image
  let color = img.getPixelColor(40, 105);
  let r = (color >>> 24) & 255;
  let g = (color >>> 16) & 255;
  let b = (color >>> 8) & 255;
  console.log(`Wall in light image: [${r}, ${g}, ${b}]`);
  
  color = img.getPixelColor(126, 4);
  r = (color >>> 24) & 255;
  g = (color >>> 16) & 255;
  b = (color >>> 8) & 255;
  console.log(`Top point in light image: [${r}, ${g}, ${b}]`);
  
  color = img.getPixelColor(126, 110);
  r = (color >>> 24) & 255;
  g = (color >>> 16) & 255;
  b = (color >>> 8) & 255;
  console.log(`Center network in light image: [${r}, ${g}, ${b}]`);
}

main().catch(console.error);
