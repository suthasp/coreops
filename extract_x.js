const { Jimp } = require('jimp');

async function main() {
  const orig = await Jimp.read('logo.backup.png');
  
  // Extract just the top logo graphic
  const buildingX = orig.clone();
  buildingX.crop({ x: 125, y: 30, w: 315, h: 225 });
  
  await buildingX.write('building_x.png');
  console.log('Extracted building_x.png successfully!');
}

main().catch(console.error);
