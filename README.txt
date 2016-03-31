# Huffman

Programa que codifica e decodifica textos ASCII utilizando o método de codificação Huffman.

## Pré-requisitos

- Windows x64

## Comprimir em códificação Huffman

    node main.js sample2.txt >> .data

## Descomprimir

    node main.js .data --decode >> decoded.txt

## Testar compressão em um arquivo

    node main.js sample2.txt --test

---

Enunciado do trabalho


Observações importantes:



entrega via e-mail  do fonte e executável , compactados:
    incluir texto descritivo (como executar, funcionalidades, observações que forem julgadas pertinentes, etc.);
    incluir todos arquivos necessários para execução.

Descrição:


na codificação ler os bytes de um arquivo, considerando o alfabeto-fonte como a codificação ASCII:
varrer o texto, criando o texto codificado, e armazendo-o em um arquivo auxiliar;
mostrar para o usuário :
texto original;
texto codificado;
na decodificação, ler o arquivo auxiliar contendo o texto codificado e em seguida, decodificar o texto, apresentando para o usuário o resultado desta operação, que deverá corresponder ao arquivo original.

Obs.: o texto original deve conter pelo menos 500 símbolos (bytes). 
