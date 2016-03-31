"use strict";
var TreeNode = (function () {
    function TreeNode(value, leftChild, rightChild) {
        this.Value = value;
        this.LeftChild = leftChild;
        this.RightChild = rightChild;
    }
    TreeNode.prototype.IsLeafNode = function () {
        return this.LeftChild == null;
    };
    TreeNode.prototype.toBuffer = function () {
        var bitBuffer = new BitBuffer();
        EncodeNode(this, bitBuffer);
        return bitBuffer.toNodeJSBuffer();
    };
    TreeNode.fromBuffer = function (buffer) {
        var bitBuffer = BitBuffer.fromNodeJSBuffer(buffer);
        return ReadNode(bitBuffer);
    };
    return TreeNode;
}());
exports.TreeNode = TreeNode;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TreeNode;
var BitBuffer = (function () {
    function BitBuffer() {
        this.data = '';
        this.cursor = 0;
    }
    BitBuffer.prototype.WriteBit = function (bit) {
        this.data += bit.toString();
    };
    BitBuffer.prototype.WriteByte = function (value) {
        var text = parseInt(value, 10).toString(2);
        this.data += ('00000000' + text).substr(0 + text.length, 8);
    };
    BitBuffer.prototype.ReadBit = function () {
        var value = parseInt(this.data.substr(this.cursor, 1), 2);
        this.cursor += 1;
        return value;
    };
    BitBuffer.prototype.ReadByte = function () {
        var value = parseInt(this.data.substr(this.cursor, 8), 2);
        this.cursor += 8;
        return value;
    };
    BitBuffer.prototype.toNodeJSBuffer = function () {
        var ints = this.data.match(/.{1,8}/g).map(function (chunk) {
            if (chunk.length < 8) {
                return parseInt((chunk + '00000000').substr(0, 8), 2);
            }
            return parseInt(chunk, 2);
        });
        var buf = new Buffer(ints.length);
        ints.reduce(function (position, value) {
            return buf.writeUInt8(value, position);
        }, 0);
        return buf;
    };
    BitBuffer.fromNodeJSBuffer = function (buffer) {
        var bitBuffer = new BitBuffer();
        for (var i = 0; i < buffer.length; i++) {
            var value = buffer.readUInt8(i).toString(2);
            bitBuffer.data += ('00000000' + value).substr(value.length, 8);
        }
        return bitBuffer;
    };
    return BitBuffer;
}());
function EncodeNode(node, writer) {
    if (node.IsLeafNode()) {
        writer.WriteBit(1);
        writer.WriteByte(node.Value);
    }
    else {
        writer.WriteBit(0);
        EncodeNode(node.LeftChild, writer);
        EncodeNode(node.RightChild, writer);
    }
}
function ReadNode(reader) {
    if (reader.ReadBit() == 1) {
        return new TreeNode(reader.ReadByte(), null, null);
    }
    else {
        var leftChild = ReadNode(reader);
        var rightChild = ReadNode(reader);
        return new TreeNode(0, leftChild, rightChild);
    }
}
function ArrayToTreeNode(table) {
    var value = table;
    if (Array.isArray(value)) {
        return new TreeNode(0, ArrayToTreeNode(value[0]), ArrayToTreeNode(value[1]));
    }
    else {
        return new TreeNode(value, null, null);
    }
}
;
//# sourceMappingURL=tree.js.map