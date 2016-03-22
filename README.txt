# Huffman

## Pré-requisitos

- Windows x64

## Comprimir em códificação Huffman

node main.js sample2.txt >> .data

## Descombrir

node main.js .data --decode >> decoded.txt

---

Enunciado do trabalho

enunciado trabalho T1 - 2016/1
Observações importantes:

entrega em 25/abril/2016;
pode ser desenvolvido em duplas;
entrega via e-mail  do fonte e executável , compactados:
    incluir texto descritivo (como executar, funcionalidades, observações que forem julgadas pertinentes, etc.);
    incluir todos arquivos necessários para execução.

Descrição:

Elaborar um programa que codifique e decodifique textos ASCII utilizando o método de codificação Huffman.


na codificação ler os bytes de um arquivo, considerando o alfabeto-fonte como a codificação ASCII:
varrer o texto, criando o texto codificado, e armazendo-o em um arquivo auxiliar;
mostrar para o usuário :
texto original;
texto codificado;
na decodificação, ler o arquivo auxiliar contendo o texto codificado e em seguida, decodificar o texto, apresentando para o usuário o resultado desta operação, que deverá corresponder ao arquivo original.

Obs.: o texto original deve conter pelo menos 500 símbolos (bytes). 

Última atualização: segunda, 14 Mar 2016, 13:27