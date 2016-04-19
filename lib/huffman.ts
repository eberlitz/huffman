import {TreeNode} from './tree';

/**
 * Códifica um texto.
 */
export function encode(text: string) {
    var frequencias = text.split('').reduce(function(a, b) {
        a[b] = (a[b] || 0) + 1
        return a;
    }, {});
    // console.log(frequencias);

    var tree = buildTree(frequencias);
    //console.log(JSON.stringify(tree, null, 4));
    var maps = createMapTables(tree);
    var charMap = maps[0];
    var bitMap: {} = maps[1];

    // caracter para bits
    // console.log(charMap);
    // Bits para caracter
    ////console.log(bitMap);

    var lastBits = 0;
    var ints = text.split('').map(function(char) {
        return charMap[char];
    }).join('').match(/.{1,32}/g).map((chunk) => {
        if (chunk.length < 32) {
            lastBits = chunk.length;
            return parseInt((chunk + '00000000000000000000000000000000').substr(0, 32), 2);
        }
        return parseInt(chunk, 2);
    });


    var buf = new Buffer(ints.length * 4);
    ints.reduce((position, value) => {
        return buf.writeUInt32BE(value, position);
    }, 0);


    //console.log(JSON.stringify(tree));

    //http://stackoverflow.com/questions/759707/efficient-way-of-storing-huffman-tree


    var treeBuffer = tree.toBuffer();
    var size = new Buffer(3);
    size.writeInt8(lastBits, 0);
    size.writeUInt16BE(treeBuffer.length, 1);
    return Buffer.concat([size, treeBuffer, buf]);
    // var bitMapString = new Buffer(JSON.stringify(bitMap));
    // var size = new Buffer(5);
    // size.writeInt8(lastBits, 0);
    // size.writeUInt32BE(bitMapString.length, 1);
    // return Buffer.concat([size, bitMapString, buf]);
}

/**
 * Decodifica a partir de um buffer 
 */
export function decode(buffer: Buffer) {
    var lastBits = buffer.readInt8(0);
    var size = buffer.readUInt16BE(1);
    var treeBuffer = TreeNode.fromBuffer(buffer.slice(3, size + 3));
    var encodedBuffer = buffer.slice(size + 3, buffer.length);
    var bitMap = createMapTables(treeBuffer)[1];
    //console.log(bitMap);
    var values = [];
    for (var i = 0; i < encodedBuffer.length; i += 4) {
        let value = encodedBuffer.readUInt32BE(i).toString(2);
        values.push(('00000000000000000000000000000000' + value).substr(value.length, 32));
    }

    if (lastBits < 32) {
        values[values.length - 1] = values[values.length - 1].substr(0, lastBits);
    }


    var result = [];
    values.join('').split('').reduce(function(buffer, bit) {
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


function buildTree(freqObj): TreeNode {
    // formata as frequencias em uma "tabela" de frequencias
    var table = Object.keys(freqObj).map(function(char) {
        return [freqObj[char], char.charCodeAt(0)];
    }).sort(frequencySorter);
    //console.log('\r\nFreqs:\r\n', table);

    // Combina todos os caracteres dois a dois pelo menor numero de frequencia
    var first, second;
    while (table.length > 1) {
        first = table.shift();
        second = table.shift();
        table.push([first[0] + second[0], [first, second]]);
        table.sort(frequencySorter);
    }
    var tree = table[0];

    // Remove a informação das frequencias, restando somente uma "arvore" de caracteres
    function removeFreq(table) {
        var value;
        value = table[1];
        if (Array.isArray(value)) {
            return new TreeNode(0, removeFreq(value[0]), removeFreq(value[1]));
        } else {
            return new TreeNode(value, null, null);
        }
    };
    return removeFreq(tree);
}

function frequencySorter(a, b) {
    if (a[0] > b[0]) {
        return 1;
    } else {
        if (a[0] < b[0]) {
            return -1;
        } else {
            return 0;
        }
    }
}

function createMapTables(tree: TreeNode) {
    var charMap = {};
    var bitMap = {};

    // function walk(val: TreeNode, path?) {
    //     path = path || '';
    //     if (Array.isArray(val)) {
    //         val.forEach(function(a, i) {
    //             walk(a, path + i.toString());
    //         });
    //     } else {
    //         val = String.fromCharCode(val);
    //         charMap[val] = path.toString();
    //         bitMap[path.toString()] = val;
    //     }
    // }
    function WalkNode(node: TreeNode, path?: string) {
        path = path || '';
        if (node.IsLeafNode()) {
            let val = String.fromCharCode(node.Value);
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







