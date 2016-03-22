var fs = require('fs');
var Huffman = require('./huffman');

// node main.js sample2.txt >> .data
// node main.js .data --decode >> decoded.txt

var fileName = process.argv[2];
var isDecode = process.argv[3] === '--decode';


if (isDecode) {
    fs.readFile(fileName, function(error, data) {
        var decodedBuffer = Huffman.decode(data);
        process.stdout.write(decodedBuffer);
    });
} else {
    fs.readFile(fileName, 'ascii', function(error, texto) {
        var encodedBuffer = Huffman.encode(texto);
        process.stdout.write(encodedBuffer);
    });
}