function pickRandomLetter() {
    return String.fromCharCode(randomIntInc('a'.charCodeAt(0), 'z'.charCodeAt(0)));
}

function randomIntInc(low: number, high: number) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function generate(qtde: number) {
    let lastChar = '';
    let charQtde = 0;
    let data = Array.apply(null, { length: qtde + 1 }).reduce(function(a, b) {
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

//qtde = Math.max(200, qtde || 0);



// Etapas:

// 1) criar gerador de arquivo que simula imagem (composto por sequencias de letras ( a-z  minúsculo) e cujo comprimento estejam entre 20 e 40 letras); 
// o usuário determina o número de colunas e linhas da imagem e em seguida o programa começa a gravar no arquivo sequencias de letras (RUNs) até "preencher " a imagem.

// 2) codificação fase 1:  (RLE)

//     grava em um buffer a informação de cada sequencia (RUN) do arquivo imagem; cada sequencia é representada por um par <letra, comprimento RUN>

// 3) codificação fase 2:  (Huffman)

//     monta uma árvore Huffman a partir dos pares <letra, comprimento RUN> gerados pela fase 1 da codificação; cada par é tratado como um terminal da árvore;

//     grava no arquivo codificado:

//       cabeçalho (número de colunas e linhas) seguido dos codewords Huffman gerados no início da fase 2.

//      a árvore Huffmann também deve ser armazenada no arquivo codificado.

// O decoder deve abrir um arquivo codificado e gerar o arquivo original; para isso deve primeiro realizar o de-Huffman e em seguida o de-RLE.
