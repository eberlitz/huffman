var encoding = require("encoding");
var fs = require("fs");

var fileName = process.argv[2] || 'sample2.txt';


console.log(fileName, ':', getFilesizeInBytes(fileName), ' bytes')

fs.readFile(fileName, function(error, data) {
    console.log(data);
    var resultBuffer = encoding.convert(data, "ascii");
    fs.writeFile(fileName, resultBuffer, 'binary', function(error) {
        console.log(error ? error : 'ok');
        console.log(fileName, ':', getFilesizeInBytes(fileName), ' bytes')

    });
});

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats["size"]
    return fileSizeInBytes
}
