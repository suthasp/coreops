const { Jimp } = require('jimp');

async function main() {
  const img1 = await Jimp.read('building_x.png');
  img1.crop({ x: 28, y: 0, w: 256, h: 225 });
  await img1.write('building_x.png');
  
  const img2 = await Jimp.read('building_x_light.png');
  img2.crop({ x: 28, y: 0, w: 256, h: 225 });
  await img2.write('building_x_light.png');

  console.log('Images cropped successfully!');
}

main().catch(console.error);
