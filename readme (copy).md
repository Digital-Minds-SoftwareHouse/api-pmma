## SISTEMA DE GERENCIAMENTO DE INFORMAÇÕES 26 BPM
### BACK-END FOR FRONT-END

*SISTEMA DESENVOLVIDO PARA SANAR OS PROBLEMAS RELACIONADOS
*AO ARMAZENAMENTO, MANUIPULAÇÃO E ATUALIZAÇÃO DE INFORMAÇÕES
*REFERENTES AO EFETIVO, OCORRENCIAS, E RESERVA DE ARMAMENTO
*DO 26 BATALHÃO DE POLICIA MILITAR DO MARANHÃO

=============================================================
*   NOME: SIS-ADM-26BPM
*   VERSÃO:2.0
*   AUTOR: JUNIOR MUNIZ(jrpalhano)
*   OBSERVAÇÃO: Desenvolvedo soba supervisão do:
*    2º Ten QOAPM Alex

=============================================================

Pra deletar um registro, os dados são pássados pelo
corpo da requisição, ja para atualizar um registro, o Id do
policial no qual deseja atualizar deve ser passado na url da
requisição, do mesmo modo para procurar um policial especifco.
TODAS AS ROTAS, exceto a rota de login possuem um midleware
de autenticação que verifica se o usuario possui um token válido
o tempo de expiração do token é de 12 horas. 
 
O upload dos arquivos é feito com o multer, no cabeçalho da
requisição de upload da imagem não esquecer de adicionar a linha 
de referencia de form conforme o seguinte:
enctype="multipart/form-data"
ou documentação mais atual do multer
 