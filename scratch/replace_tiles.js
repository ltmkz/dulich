const fs = require('fs');
const files = ['components/PublicMap.tsx', 'components/AdminMap.tsx', 'components/MapPicker.tsx'];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(
      /url="https:\/\/{s}\.tile\.openstreetmap\.org\/{z}\/{x}\/{y}\.png"/g,
      'url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"'
    ).replace(
      /attribution='&copy; OpenStreetMap'/g,
      'attribution=\'&copy; Google Maps\''
    );
    fs.writeFileSync(f, content);
  }
});
console.log("Replaced TileLayers");
