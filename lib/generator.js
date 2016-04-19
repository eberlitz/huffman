function pickRandomLetter() {
    return String.fromCharCode(randomIntInc('a'.charCodeAt(0), 'z'.charCodeAt(0)));
}
function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
function generate(qtde) {
    var lastChar = '';
    var charQtde = 0;
    var data = Array.apply(null, { length: qtde + 1 }).reduce(function (a, b) {
        while (charQtde-- >= 0) {
            a.push(lastChar);
            return a;
        }
        charQtde = randomIntInc(20, 40);
        lastChar = pickRandomLetter();
        a.push(lastChar);
        return a;
    }, []);
    return data.join('');
}
//# sourceMappingURL=generator.js.map