import fs = require('fs');
import Huffman = require('./lib/huffman');

// node main.js sample2.txt >> .data
// node main.js .data --decode >> decoded.txt

var fileName = process.argv[2];
var isTest = process.argv[3] === '--test';
var isDecode = process.argv[3] === '--decode';

if (isTest) {
    fs.readFile(fileName, function (error, buffer) {
        let originalFileSize = buffer.length;
        let originalFileString = buffer.toString('ascii');

        var encodedBuffer = Huffman.encode(originalFileString);
        let compressedFileSize = encodedBuffer.length;

        var decodedString = Huffman.decode(encodedBuffer);

        console.log(fileName, ':', originalFileSize, ' bytes');
        console.log('encoded', ':', compressedFileSize, ' bytes');
        console.log('decoded == original:', decodedString === originalFileString);
        console.log('Tamanho do arquivo após códificação:', (100 * compressedFileSize) / originalFileSize, '%');
    });
} else if (isDecode) {
    fs.readFile(fileName, function (error, data) {
        if (error) {
            throw error;
        } else {
            var decodedBuffer = Huffman.decode(data);
            process.stdout.write(decodedBuffer);
        }
    });
} else {
    fs.readFile(fileName, 'ascii', function (error, texto) {
        if (error) {
            throw error;
        } else {
            var encodedBuffer = Huffman.encode(texto);
            process.stdout.write(encodedBuffer);
        }
    });
}