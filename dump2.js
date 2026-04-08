import fs from 'fs';

const dumpNodes = (filename) => {
    try {
        const buffer = fs.readFileSync(filename);
        const chunkLength = buffer.readUInt32LE(12);
        const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
        const json = JSON.parse(jsonStr);
        console.log(`\nNodes in ${filename}:`);
        json.nodes.forEach((n, i) => {
            console.log(`${i}: ${n.name}`);
        });
        console.log(`\nMaterials in ${filename}:`);
        json.materials?.forEach((m, i) => {
            console.log(`${i}: ${m.name}`);
        });
        console.log(`\nMeshes in ${filename}:`);
        json.meshes?.forEach((m, i) => {
            console.log(`${i}: ${m.name}`);
        });
    } catch (e) {
        console.error(e);
    }
}

dumpNodes('public/assets/autocabinet.glb');
