export class TreeNode {
    public Value: number;
    public LeftChild: TreeNode;
    public RightChild: TreeNode;

    constructor(value: number, leftChild: TreeNode, rightChild: TreeNode) {
        this.Value = value;
        this.LeftChild = leftChild;
        this.RightChild = rightChild;
    }

    public IsLeafNode() {
        return this.LeftChild == null;
    }

    public toBuffer() {
        let bitBuffer = new BitBuffer();
        EncodeNode(this, bitBuffer);
        return bitBuffer.toNodeJSBuffer();
    }

    public static fromBuffer(buffer: Buffer) {
        let bitBuffer = BitBuffer.fromNodeJSBuffer(buffer);
        return ReadNode(bitBuffer);
    }
}
export default TreeNode;


// var tree = [[[[[100, [103, 44]], 108], 101], [[114, 110], [[[[[[85, [76, 70]], [120, [69, 67]]], [80, [65, 68]]], [102, [[[73, 106], 83], 104]]], [112, [98, 118]]], 116]]], [[[115, 97], [117, [[46, [113, [[77, 10], [78, 13]]]], 99]]], [32, [[109, 111], 105]]]];
// var root = ArrayToTreeNode(tree);
// var bitBuffer = new BitBuffer();
// EncodeNode(root, bitBuffer);
// var rootBuffer = bitBuffer.toNodeJSBuffer();
// var decoded = BitBuffer.fromNodeJSBuffer(rootBuffer);
// var decodedTree = ReadNode(decoded);
// console.log(JSON.stringify(decodedTree) === JSON.stringify(root));


class BitBuffer {
    data: string = '';
    cursor: number = 0;

    WriteBit(bit: number) {
        this.data += bit.toString();
    }

    WriteByte(value: number) {
        var text = parseInt(<any>value, 10).toString(2);
        this.data += ('00000000' + text).substr(0 + text.length, 8);
    }

    ReadBit(): number {
        let value = parseInt(this.data.substr(this.cursor, 1), 2);
        this.cursor += 1;
        return value;
    }

    ReadByte(): number {
        let value = parseInt(this.data.substr(this.cursor, 8), 2);
        this.cursor += 8;
        return value;
    }


    toNodeJSBuffer() {
        var ints = this.data.match(/.{1,8}/g).map((chunk) => {
            if (chunk.length < 8) {
                return parseInt((chunk + '00000000').substr(0, 8), 2);
            }
            return parseInt(chunk, 2);
        });
        var buf = new Buffer(ints.length);
        ints.reduce((position, value) => {
            return buf.writeUInt8(value, position);
        }, 0);
        return buf;
    }

    static fromNodeJSBuffer(buffer: Buffer) {
        var bitBuffer = new BitBuffer();
        for (var i = 0; i < buffer.length; i++) {
            let value = buffer.readUInt8(i).toString(2);
            bitBuffer.data += ('00000000' + value).substr(value.length, 8);
        }
        return bitBuffer;
    }

}

function EncodeNode(node: TreeNode, writer: BitBuffer) {
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

function ReadNode(reader: BitBuffer) {
    if (reader.ReadBit() == 1) {
        return new TreeNode(reader.ReadByte(), null, null);
    }
    else {
        let leftChild: TreeNode = ReadNode(reader);
        let rightChild: TreeNode = ReadNode(reader);
        return new TreeNode(0, leftChild, rightChild);
    }
}

function ArrayToTreeNode(table) {
    var value = table;
    if (Array.isArray(value)) {
        return new TreeNode(0, ArrayToTreeNode(value[0]), ArrayToTreeNode(value[1]));
    } else {
        return new TreeNode(value, null, null);
    }
};


// var tree = [[[[[100, [103, 44]], 108], 101], [[114, 110], [[[[[[85, [76, 70]], [120, [69, 67]]], [80, [65, 68]]], [102, [[[73, 106], 83], 104]]], [112, [98, 118]]], 116]]], [[[115, 97], [117, [[46, [113, [[77, 10], [78, 13]]]], 99]]], [32, [[109, 111], 105]]]];
// var root = ArrayToTreeNode(tree);
// var bitBuffer = new BitBuffer();
// EncodeNode(root, bitBuffer);
// var rootBuffer = bitBuffer.toNodeJSBuffer();
// var decoded = BitBuffer.fromNodeJSBuffer(rootBuffer);
// var decodedTree = ReadNode(decoded);
// console.log(JSON.stringify(decodedTree) === JSON.stringify(root));




