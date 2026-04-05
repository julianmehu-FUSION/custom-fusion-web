import fs from 'fs';
const buffer = fs.readFileSync('public/assets/outer_sphere.glb');
const chunkLength = buffer.readUInt32LE(12);
const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
const json = JSON.parse(jsonStr);
console.log("Outer Nodes:", json.nodes.map(n => n.name));

const buffer2 = fs.readFileSync('public/assets/inner_1.glb');
const chunkLength2 = buffer2.readUInt32LE(12);
const jsonStr2 = buffer2.toString('utf8', 20, 20 + chunkLength2);
const json2 = JSON.parse(jsonStr2);
console.log("Inner Nodes:", json2.nodes.map(n => n.name));
