"use strict";
var fs = require('fs');
fs.readFile('sample2.txt', 'ascii', function (error, texto) {
    var output = encode(texto);
    console.log('Encoded: \r\n', output);
    var decoded = decode(output);
    console.log('Decoded: \r\n', decoded == texto, decoded);
});
function encode(text) {
    var frequencias = text.split('').reduce(function (a, b) {
        a[b] = (a[b] || 0) + 1;
        return a;
    }, {});
    var tree = buildTree(frequencias);
    var maps = createMapTables(tree);
    var charMap = maps[0];
    var bitMap = maps[1];
    var output = JSON.stringify(bitMap) + text.split('').map(function (char) {
        return charMap[char];
    }).join('');
    return new Buffer(output);
}
function decode(buffer) {
    var text = buffer.toString('utf8');
    var endOfTree = text.lastIndexOf('}');
    var bitMap = JSON.parse(text.substring(0, endOfTree + 1));
    text = text.substring(endOfTree + 1);
    var result = [];
    text.split('').reduce(function (buffer, bit) {
        buffer.push(bit);
        var char = bitMap[buffer.join('')];
        if (char) {
            result.push(char);
            return [];
        }
        return buffer;
    }, []);
    return result.join('');
}
function buildTree(freqObj) {
    var table = Object.keys(freqObj).map(function (char) {
        return [freqObj[char], char];
    }).sort(frequencySorter);
    var first, second;
    while (table.length > 1) {
        first = table.shift();
        second = table.shift();
        table.push([first[0] + second[0], [first, second]]);
        table.sort(frequencySorter);
    }
    var tree = table[0];
    function removeFreq(table) {
        var value;
        value = table[1];
        if (Array.isArray(value)) {
            return [removeFreq(value[0]), removeFreq(value[1])];
        }
        else {
            return value;
        }
    }
    ;
    return removeFreq(tree);
}
function frequencySorter(a, b) {
    if (a[0] > b[0]) {
        return 1;
    }
    else {
        if (a[0] < b[0]) {
            return -1;
        }
        else {
            return 0;
        }
    }
}
function createMapTables(tree) {
    var charMap = {};
    var bitMap = {};
    function walk(val, path) {
        path = path || '';
        if (Array.isArray(val)) {
            val.forEach(function (a, i) {
                walk(a, path + i.toString());
            });
        }
        else {
            charMap[val] = path.toString();
            bitMap[path.toString()] = val;
        }
    }
    walk(tree);
    return [charMap, bitMap];
}
//# sourceMappingURL=teste.js.map