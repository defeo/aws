#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function extract(file) {
    const name = /^(.*)\.json$/.exec(path.basename(file))[1];
    if (!name)
        throw Error('Invalid filename:', file);
    fs.readFile(file, async (err, data) => {
        if (err)
            throw err;
        const names = await Promise.all(JSON.parse(data).map((d, i) => {
            const match = /^data:(audio|video)\/(.*);(.*),(.*)$/.exec(d);
            const outname = `${name}.${i}.${match[2]}`;
            if (!match)
                throw Error(`Invalid data: ${d.substr(0,30)}...`);
            return new Promise((resolve, reject) =>
                               fs.writeFile(outname,
                                            new Buffer(match[4], match[3]),
                                            (err) => err ? reject(err) : resolve(outname)));
        }));

        const ext = path.extname(names[0]);
        fs.writeFile(`${name}.txt`,
                     names.map((n) => `file '${n}'`).join('\n'),
                     (err) => {
                         if (err)
                             throw err;
                         console.log(`ffmpeg -f concat -i ${name}.txt -codec copy ${name}${ext}`);
                     });
    });
}

for (let c of process.argv.slice(2)) {
    extract(c);
}
