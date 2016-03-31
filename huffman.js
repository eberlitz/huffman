"use strict";
var tree_1 = require('./tree');
function encode(text) {
    var frequencias = text.split('').reduce(function (a, b) {
        a[b] = (a[b] || 0) + 1;
        return a;
    }, {});
    var tree = buildTree(frequencias);
    var maps = createMapTables(tree);
    var charMap = maps[0];
    var bitMap = maps[1];
    var lastBits = 0;
    var ints = text.split('').map(function (char) {
        return charMap[char];
    }).join('').match(/.{1,32}/g).map(function (chunk) {
        if (chunk.length < 32) {
            lastBits = chunk.length;
            return parseInt((chunk + '00000000000000000000000000000000').substr(0, 32), 2);
        }
        return parseInt(chunk, 2);
    });
    var buf = new Buffer(ints.length * 4);
    ints.reduce(function (position, value) {
        return buf.writeUInt32BE(value, position);
    }, 0);
    var treeBuffer = tree.toBuffer();
    var size = new Buffer(3);
    size.writeInt8(lastBits, 0);
    size.writeUInt16BE(treeBuffer.length, 1);
    return Buffer.concat([size, treeBuffer, buf]);
}
exports.encode = encode;
function decode(buffer) {
    var lastBits = buffer.readInt8(0);
    var size = buffer.readUInt16BE(1);
    var treeBuffer = tree_1.TreeNode.fromBuffer(buffer.slice(3, size + 3));
    var encodedBuffer = buffer.slice(size + 3, buffer.length);
    var bitMap = createMapTables(treeBuffer)[1];
    var values = [];
    for (var i = 0; i < encodedBuffer.length; i += 4) {
        var value = encodedBuffer.readUInt32BE(i).toString(2);
        values.push(('00000000000000000000000000000000' + value).substr(value.length, 32));
    }
    if (lastBits < 32) {
        values[values.length - 1] = values[values.length - 1].substr(0, lastBits);
    }
    var result = [];
    values.join('').split('').reduce(function (buffer, bit) {
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
exports.decode = decode;
function buildTree(freqObj) {
    var table = Object.keys(freqObj).map(function (char) {
        return [freqObj[char], char.charCodeAt(0)];
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
            return new tree_1.TreeNode(0, removeFreq(value[0]), removeFreq(value[1]));
        }
        else {
            return new tree_1.TreeNode(value, null, null);
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
    function WalkNode(node, path) {
        path = path || '';
        if (node.IsLeafNode()) {
            var val = String.fromCharCode(node.Value);
            charMap[val] = path.toString();
            bitMap[path.toString()] = val;
        }
        else {
            WalkNode(node.LeftChild, path + '0');
            WalkNode(node.RightChild, path + '1');
        }
    }
    WalkNode(tree);
    return [charMap, bitMap];
}
//# sourceMappingURL=huffman.js.map