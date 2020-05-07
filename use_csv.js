const fs = require('fs');
const csvSync = require('csv-parse/lib/sync'); // requiring sync module

const file = 'reply.csv';

function read_csv(file) {
    let data = fs.readFileSync(file);
    let res = csvSync(data);
    return res;
}
console.log(read_csv(file));

function reply(text, file) {//こんにちはだけ判別してくれない
    let reply_text = "";
    const data = read_csv(file);
    for (let i in data) {
        //console.log(text == data[i][0]);
        if (text == data[i][0]) {
            //console.log(data[i][0]);
            reply_text = data[i][1];
            break;
        }
    }
    return reply_text;
}

console.log(reply('おはよう', file));

/*const fs = require('fs');
const csv = require('csv');
//const JSONStream = require('JSONStream');

const filename = 'reply.csv';

const columns = [
    'post',
    'reply',
];

function read_csv(file) {
    var read_data = []
    //return new Promise((resolve) => {
    const parser = csv.parse({ columns: columns });
    const readableStream = fs.createReadStream(file, { encoding: 'utf-8' });

    readableStream.pipe(parser);

    parser.on('readable', () => {
        var data;
        while (data = parser.read()) {
            read_data.push(data);
            //console.log(data);
        }
    });
    //console.log(read_data);
    parser.on('end', () => {
        //console.log(read_data);
    });
    //resolve(read_data);});
    return read_data
}
result = read_csv(filename);
console.log(result);*/