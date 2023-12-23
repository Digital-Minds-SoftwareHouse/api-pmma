const postgres = require('../../dbConfig')

function contarPalavras(lista) {
    const contador = {};
  
    for (let palavra of lista) {
      if (contador[palavra]) {
        contador[palavra]++;
      } else {
        contador[palavra] = 1;
      }
    }
    return contador;
  }
  function ordenarPorQuantidade(resultado) {
    const palavras = Object.keys(resultado);
  
    palavras.sort((a, b) => resultado[b] - resultado[a]);
  
    const resultadoOrdenado = {};
  
    for (let palavra of palavras) {
      resultadoOrdenado[palavra] = resultado[palavra];
    }
  
    return resultadoOrdenado;
  }

exports.reportsAllQuantity = async function (req, res, err){
    const total = ''
    const lista = []
    
    const response = (await postgres.query('SELECT * FROM report' )).rowCount
    const reportsNatureQuantityRaw = (await postgres.query('SELECT nature FROM natures')).rows
    reportsNatureQuantityRaw?.map(item=>lista.push(item.nature))
    let reportsNatureQuantity = ordenarPorQuantidade(contarPalavras(lista))
    console.log(reportsNatureQuantity)
    
    res.status(200).send({total_reports: response, reportsNatureQuantity:reportsNatureQuantity })
}