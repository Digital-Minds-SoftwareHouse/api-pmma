const  PDFPrinter = require('pdfmake')

/*
 * @param {Object} report 
*/


exports.pdfReportDefinitions = function(report ){
    const data = report

    let ropNumber = data[0]?.number_report
    let battalion = data[0]?.battalion
    let reportNatures = data[0]?.natures
    let staffCommander = ''
    let reportCity = data[0]?.report_city
    let reportDate = new Date(data[0]?.date_time)
    let dateFormat = `${reportDate.getDate()}/${reportDate.getMonth()+1}/${reportDate.getFullYear()}`
    let timeFormat = `${("00" + reportDate.getHours()).slice(-2)}:${('00' + reportDate.getMinutes()).slice(-2)}`
    let policeGarison = data[0]?.police_garrison
    let involvedObject = data[0]?.envolveds
    let objects = data[0]?.objects

    for(let k in data[0]?.police_staff){
        if(data[0].police_staff[k]?.staff_function === 'COMANDANTE'){
            staffCommander = `${data[0].police_staff[k].graduation_rank} ${data[0].police_staff[k].war_name}`
        }
    }

    function dateBrFormat(item){
        let date = new Date(item)
        let dateFormat = `${('00' + date.getDate()).slice(-2)}/${('00' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`
        return dateFormat
    }

    let dd = {
            pageSize: 'A4',
            orientation: 'landscape',
            pageMargins: 25,
            defaultStyle: {
                font: 'Times',
                lineHeight:1.3,
                fontSize: 9,
                bold: false, 
            },

        content: [
        {
            columns:[
                {
                    alignment: 'left',
                    width: '15%',
                    text: 'Logo\nBatalhão',
                },
                {
                    width: '70%',
                    fontSize: 9,
                    alignment: 'center',
                    text: `ESDADO DO MARANHÃO
                    SECRETARIA DE ESTADO DA SEGURANÇA PÚBLICA
                    POLÍCIA MILITAR DO MARANHÃO
                    COMANDO DE POLICIAMENTO DO INTERIOR ÁREA 3 - CPA-1/3
                    ${battalion} DE POLÍCIA MILIOTAR DO MARANHÃO`
                },
                {
                    alignment: 'right',
                    width: '15%',
                    text: 'Logo\nPMMA'
                }  
            ]
        },        
        {
            marginTop: 15 ,
            text: `NUMERO DO ROP:  ${ropNumber} - ${battalion}` 
        },
        {
            text: `NATUREZA(S) DA OCORRÊNCIA:  ${reportNatures?.map(item=>` ${item.nature}`)}` 
        },
        {
            marginTop: 15 ,
            text: `Sr.(a) Delegado(a), eu ${staffCommander}, no dia ${dateFormat} às ${timeFormat} nesta cidade de ${reportCity}, de serviço na guarnição: ${policeGarison}. Conduzo a vossa presença nesta delegacia de polícia civil as seguintes pessoas:\n ` 
        },

        involvedObject?.map((item, index)=>(
            
            {                
                style: 'tableMultiple',
                table:{
                    widths: '33.3%',
                    body:[
                        [{text: `PESSOA ${("000" + (index+1)).slice(-3)}: ${item.type_of_involvement}`, colSpan:3, fillColor: '#ccc'}, {},{}],
                        [{text: `NOME:  ${item.name}`, colSpan:2}, {text: ``}, {text: `RAÇA/COR: ${item.race_color}`}],
                        [{text: `SEXO: ${item.sex}`},{text: `GÊNERO: ${item.gender}`},{text: 'PROFISSÃO: '}],
                        [{text: `IDENTIDADE:  ${item.rg}`},{text: `C.P.F.: ${item.cpf} ` },{text: `TELEFONE: ${item.phone_number}`}],
                        [{text: `NASCIMENTO:  ${dateBrFormat(item.birthdate)}`},{text: `NOME DA MÃE:${item.mother}`, colSpan:2}],
                        [{text: `NATURAL DE: ${item.naturalness}`},{text: `ENDEREÇO: ${item.address}`},{text: `ENDEREÇO: ${item.city}`}],
                        [{text: `SINAIS PARTICULARES: ${item.particular_signs ? item.particular_signs : 'SEM SINAIS PARTICULARES' }`, colSpan:3}],
                        [{text: `LESÕES CORPORAIS: ${item.bodily_injuries ? item.bodily_injuries : 'SEM LESÕES CORPORAIS' }`, colSpan:3}],
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }
        )),
        {
            style: 'tableExample',
            table:{
                widths: '50%',
                body:[
                    [{text: `INFORMAÇÕES GERAIS DA OCORRÊNCIA `, colSpan:2, fillColor: '#ccc', style: 'tableHeader'}, {}],
                    [{text: `ORIGEM: `},{text: `HORÁRIO DA OCORRÊNCIA: ${timeFormat}`}],
                    [{text: `ENDEREÇO DA OCORRÊNCIA: ${data[0]?.report_address.toUpperCase()} - ${data[0]?.report_district} `, colSpan:2}],
                    [{text: `COORDENADAS DE GEOLOCALIZAÇÃO`, colSpan:2}],
                    [{text: `LATITUDE: ${data[0]?.latitude}`},{text: `LONGITUDE: ${data[0]?.longitude}`}],
                    [{text: `USO DE ALGEMA: `},{text: `JUSTIFICATIVA: `}],
            ]
            },
            layout:{
                hLineWidth: function () {return 0.5},
                vLineWidth: function () {return 0.5},
                paddingTop: function () {return 4},
            }
        },
        {
            style: 'tableExample',
            table:{
                widths: '50%',
                body:[
                    [{text: `INFORMAÇÕES ADCIONAIS `, colSpan:2, fillColor: '#ccc', style: 'tableHeader'}, {}],
                    [{text: `OBSERVAÇÕES: `, colSpan:2},{}],
                    [{text: `CONTATO DA UPM:  `, colSpan:2}],
            ]
            },
            layout:{
                hLineWidth: function () {return 0.5},
                vLineWidth: function () {return 0.5},
                paddingTop: function () {return 4},
            }
        },
        {
            style: 'tableExample',
            table:{
                widths:'100%',
                body:[
                    [{text:"HISTÓRICO DA OCORRÊNCIA", fillColor: '#ccc', style: 'tableHeader'}],
                    [{text:`MOTIVAÇÃO DA ABORDAGEM:\nABORDAGEM MOTIVADA POR FUNCADA SUSPEITA CONTRA O ABORDADO`}],
                    [{text: `RELATO DOS FATOS:\n${data[0]?.history.toUpperCase()}`,}]
                ]
            },
            layout:{
                hLineWidth: function () {return 0.5},
                vLineWidth: function () {return 0.5},
                paddingTop: function () {return 4},
            }
        },
       objects == [] || objects == null || objects ==='' ? null : 
        {
            style: 'tableExample2',
            table:{
                widths: '50%',
                body:[
                    [{text: `OBJETOS APREENDIDOS `, colSpan:2, fillColor: '#ccc', style: 'tableHeader'}, {}],
            ]
            },
            layout:{
                hLineWidth: function () {return 0.5},
                vLineWidth: function () {return 0.5},
                paddingTop: function () {return 4},
            }
        },
        objects?.map((item)=>(
            
            item?.type === "VEÍCULOS" ? 
            {                
                style: 'tableExample3',
                table:{
                    widths: '33.3%',
                    body:[
                        [{text: `TIPO: ${item?.type}` }, {text: `MARCA: ${item?.brand}`},{text: `MODELO: ${item?.model}`}],
                        [{text: `CHASSIS: ${item?.chassis}`, colSpan:2, }, {},{text: `MODELO: ${item?.plate}`}],
                        [{text: item?.stolen_recovered === true ? 'VEÍCULO FURTADO  RECUPERADO' :item?.stolen_recovered === false ? 'VEÍCULO APREENDIDO': null , colSpan:3, }, {},{}],
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }           
            
            : item?.type === "DROGAS" ?
            {                
                style: 'tableExample3',
                table:{
                    widths: '33.3%',
                    body:[
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE SUBST.: ${item?.subtype}`},{text: `QUANTIDADE: ${item?.quantity}g`}],
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }             
            : item?.type === "ARMAS" && item?.subtype === 'PISTOLA' ? 
            {                
                style: 'tableExample3',
                table:{
                    widths: '33.3%',
                    body:[
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE ARMA.: ${item?.subtype}`},{text: `MARCA: ${item?.brand}`}],
                        [{text: `MODELO: ${item?.model}` }, {text: `Nº DE SÉRIE.: ${item?.serial_number}`},{text: `CALIBRE: ${item?.caliber}`}],
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }   
            : item?.type === "ARMAS" && item?.subtype === 'REVOLVER' ? 
            {                
                style: 'tableExample3',
                table:{
                    widths: '33.3%',
                    body:[
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE ARMA.: ${item?.subtype}`},{text: `MARCA: ${item?.brand}`}],
                        [{text: `MODELO: ${item?.model}` }, {text: `Nº DE SÉRIE.: ${item?.serial_number}`},{text: `CALIBRE: ${item?.caliber}`}],
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            } 
            : item?.type === "ARMAS" && item?.subtype === 'ESPINGARDA' ? 
            {                
                style: 'tableExample3',
                table:{
                    widths: '33.3%',
                    body:[
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE ARMA.: ${item?.subtype}`},{text: `MARCA: ${item?.brand}`}],
                        [{text: `MODELO: ${item?.model}` }, {text: `Nº DE SÉRIE.: ${item?.serial_number}`},{text: `CALIBRE: ${item?.caliber}`}],
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            } 
            : item?.type === "ARMAS" && item?.subtype === 'FUZIL/CARABINA' ? 
            {                
                style: 'tableExample3',
                table:{
                    widths: '33.3%',
                    body:[
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE ARMA.: ${item?.subtype}`},{text: `MARCA: ${item?.brand}`}],
                        [{text: `MODELO: ${item?.model}` }, {text: `Nº DE SÉRIE.: ${item?.serial_number}`},{text: `CALIBRE: ${item?.caliber}`}],
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }  
                     
            : item?.type === "ARMAS" && item?.subtype === 'ARMA CASEIRA'  ?
            {                
                style: 'tableExample3',
                table:{
                    widths: '50%',
                    body:[
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE ARMA.: ${item?.subtype}`}],
                        [{text: `QUANTIDADE: ${item?.quantity}` }, {text: `DESCRIÇÃO: ${item?.description}`}],
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }   
            : item?.type === "ARMAS" && item?.subtype === 'ARMA BRANCA'  ?
            {                
                style: 'tableExample3',
                table:{
                    widths: '50%',
                    body:[
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE ARMA.: ${item?.subtype}`}],
                        [{text: `QUANTIDADE: ${item?.quantity}` }, {text: `DESCRIÇÃO: ${item?.description}`}],
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            } 
            : item?.type === "ARMAS" && item?.subtype === 'SIMULACRO'  ?
            {                
                style: 'tableExample3',
                table:{
                    widths: '50%',
                    body:[
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE ARMA.: ${item?.subtype}`}],
                        [{text: `QUANTIDADE: ${item?.quantity}` }, {text: `DESCRIÇÃO: ${item?.description}`}],
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }
            :item?.type === 'OUTROS'  ?
            {                
                style: 'tableExample3',
                table:{
                    widths: ['15% ', '*'],
                    body:[
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE ARMA.: ${item?.description.toUpperCase()}`}],
                        
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }  
            : item?.type === "DINHEIRO" ?
            {                
                style: 'tableExample3',
                table:{
                    widths: ['15%','20%', '*'],
                    body:[
                        [{text: `TIPO: ${item?.type}` }, {text: `QTD.: R$ ${item?.quantity}`},{text: `DESCRIÇÃO: ${item?.description}`}],
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }       
            :null
        )),
        {
            style: 'tableExample2',
            table:{
                widths: '50%',
                body:[
                    [{text: `EFETIVO EMPREGADO`, colSpan:2, fillColor: '#ccc', style: 'tableHeader'}, {}],
            ]
            },
            layout:{
                hLineWidth: function () {return 0.5},
                vLineWidth: function () {return 0.5},
                paddingTop: function () {return 4},
            }
        },
        data[0]?.police_staff.map((item)=>(
            item?.staff_function === 'COMANDANTE'?
            {                
                style: 'tableExample2',
                table:{
                    widths: ['28% ', '*'],
                    body:[
                        [{text: item?.staff_function, bold:true }, {text: `${item?.graduation_rank} - ${item?.war_name} ${item?.id_policial}`}],
                        
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }
            :null
        )),
        data[0]?.police_staff.map((item)=>(
            item?.staff_function === 'PATRULHEIRO'?
            {                
                style: 'tableExample2',
                table:{
                    widths: ['28% ', '*'],
                    body:[
                        [{text: item?.staff_function, bold:true }, {text: `${item?.graduation_rank} - ${item?.war_name} ${item?.id_policial}`}],
                        
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }
            :null
        )),
        data[0]?.police_staff.map((item)=>(
            item?.staff_function === 'APOIO'?
            {                
                style: 'tableExample2',
                table:{
                    widths: ['28% ', '*'],
                    body:[
                        [{text: item?.staff_function, bold:true }, {text: `${item?.graduation_rank} - ${item?.war_name} ${item?.id_policial}`}],
                        
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }
            :null
        )),
        data[0]?.police_staff.map((item)=>(
            item?.staff_function === 'CENTRAL DE OPERAÇÕES'?
            {                
                style: 'tableExample2',
                table:{
                    widths: ['28% ', '*'],
                    body:[
                        [{text: item?.staff_function, bold:true }, {text: `${item?.graduation_rank} - ${item?.war_name} ${item?.id_policial}`}],
                        
                ]
                },
                layout:{
                    hLineWidth: function () {return 0.5},
                    vLineWidth: function () {return 0.5},
                    paddingTop: function () {return 4}
                }
            }
            :null
        )),
        {
            text:`RECEBIDO POR:`,
            style: 'subheader' ,
        },
        {
            text: `CARGO/NOME:___________________________________________________   MATRICULA:______________   CPF:______________________\n
            DATA: ______/______/______   HORA: _____:_____   ASSINATURA:______________________________________________________________`
        }
        

      ],
      styles: {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
        },
        subheader: {
            fontSize: 12,
            bold: true,
            margin: [0, 28, 0, 5]
        },
        tableExample: {
            margin: [0, 5, 0, 10]
        },
        tableExample2: {
            margin: [0, 0, 0, 0]
        },
        tableExample3: {
            margin: [0, 0, 0, 5]
        },
        tableMultiple: {
            margin: [0, 2, 0, 6]
        },
        tableHeader: {
            bold: true,
            fontSize: 9,
            color: 'black'
        }
    }  
    }
    return dd
}

/*


*/