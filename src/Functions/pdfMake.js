const  PDFPrinter = require('pdfmake')
const fs = require('fs');
const path = require('path')

/*
 * @param {Object} report 
*/

exports.pdfReportDefinitions = function(report ){
    const data = report
    console.log(data);
    let ropNumber = data?.number_report
    let battalion = data?.battalion
    let reportNatures = data?.natures
    let staffCommander = ''
    let reportCity = data?.report_city
    let reportDate = new Date(data?.date_time)
    let dateFormat = `${reportDate.getDate()}/${reportDate.getMonth()+1}/${reportDate.getFullYear()}`
    let timeFormat = `${("00" + reportDate.getHours()).slice(-2)}:${('00' + reportDate.getMinutes()).slice(-2)}`
    let policeGarison = data?.police_garrison
    let involvedObject = data?.envolveds
    let objects = data?.objects

    const pmmaImageRelativePath = '../FileStorage/UserImages/pmmaLogo.png';
    const pmmaImagePath = path.join(__dirname, pmmaImageRelativePath)    
    const pmmaLogo = fs.readFileSync(pmmaImagePath).toString('base64');

    const bpm26ImageRelativePath = '../FileStorage/UserImages/logoCPAI3.png';
    const bpm26ImagePath = path.join(__dirname, bpm26ImageRelativePath)    
    const bpm26Logo = fs.readFileSync(bpm26ImagePath).toString('base64');

    for(let k in data?.police_staff){
        if(data.police_staff[k]?.staff_function === 'COMANDANTE'){
            staffCommander = `${data.police_staff[k].graduation_rank} ${data.police_staff[k].war_name} CPF: ${data.police_staff[k].cpf}`
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
                font: 'Helvetica',
                lineHeight:1.3,
                fontSize: 9,
                bold: false, 
            },

        content: [
        {
            columns:[
                {
                    image: `data:image/png;base64,${bpm26Logo}`,
                    width: 43,
                    alignment: 'right'          
                },
                {
                    width: '82%',
                    fontSize: 9,
                    alignment: 'center',
                    text: `ESDADO DO MARANHÃO
                    SECRETARIA DE ESTADO DA SEGURANÇA PÚBLICA
                    POLÍCIA MILITAR DO MARANHÃO
                    COMANDO DE POLICIAMENTO DO INTERIOR ÁREA 3 - CPA-1/3`
                },
                {
                    image: `data:image/png;base64,${pmmaLogo}`,
                    width: 60         
                } ,
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
            text: `SR.(A) DELEGADO(A), EU ${staffCommander.toUpperCase()}, NO DIA ${dateFormat} ÀS ${timeFormat} NESTA CIDADE DE ${reportCity}, DE SERVIÇO NA GUARNIÇÃO: ${policeGarison}. CONDUZO A VOSSA PRESENÇA NESTA DELEGACIA DE POLÍCIA CIVIL AS SEGUINTES PESSOAS:\n ` 
        },

        involvedObject?.map((item, index)=>(            
            {                
                style: 'tableMultiple',
                table:{
                    widths: '33.3%',
                    body:[
                        [{text: `PESSOA ${("000" + (index+1)).slice(-3)}: ${item.type_of_involvement}`, colSpan:3, fillColor: '#ccc',style: 'tableHeader'}, {},{}],
                        [{text: `NOME:  ${item.name.toUpperCase()}`, colSpan:2}, {text: ``}, {text: `RAÇA/COR: ${item.race_color.toUpperCase()}`}],
                        [{text: `SEXO: ${item.sex.toUpperCase()}`},{text: `GÊNERO: ${item.gender.toUpperCase()}`},{text: `PROFISSÃO: ${item?.profession ? item.profession : "- - - - - - - - -"}`}],
                        [{text: `IDENTIDADE:  ${item.rg ? item.rg.toUpperCase(): "- - - - - - - - -"}`},{text: `C.P.F.: ${item.cpf ? item.cpf.toUpperCase() : "- - - - - - - - -"} ` },{text: `TELEFONE: ${item.phone_number ? item.phone_number.toUpperCase(): "- - - - - - - - -"}`}],
                        [{text: `NASCIMENTO:  ${item.birthdate ? dateBrFormat(item.birthdate) : "- - - - - - - - -"}`},{text: `NOME DA MÃE:${item.mother ? item.mother.toUpperCase() : "- - - - - - - - -"}`, colSpan:2}],
                        [{text: `NATURAL DE: ${item.naturalness ? item.naturalness.toUpperCase() : "- - - - - - - - -"}`},{text: `ENDEREÇO: ${item.address ? item.address.toUpperCase() : "- - - - - - - - -" }`},{text: `CIDADE: ${item.city ? item.city.toUpperCase() : "- - - - - - - - -"}`}],
                        [{text: `SINAIS PARTICULARES: ${item.particular_signs ? item.particular_signs : 'SEM SINAIS PARTICULARES' }`, colSpan:3}],
                        [{text: `ESTADO DE SAÚDE: ${item.health_condition}`, colSpan:3}],
                        [{text: `LESÕES CORPORAIS: ${item.bodily_injuries ? item.bodily_injuries : "- - - - - - - - -"  }`, colSpan:3}],
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
                    [{text: `ORIGEM: ${data.origin} `},{text: `HORÁRIO DA OCORRÊNCIA: ${timeFormat}`}],
                    [{text: `ENDEREÇO DA OCORRÊNCIA: ${data?.report_address.toUpperCase()} - ${data?.report_district.toUpperCase()} `, colSpan:2}],
                    [{text: `COORDENADAS DE GEOLOCALIZAÇÃO`, colSpan:2}],
                    [{text: `LATITUDE: ${data?.latitude}`},{text: `LONGITUDE: ${data?.longitude}`}],
                    [{text: `USO DE ALGEMA: ${ data?.use_handcuffs == null ?  "SEM USO DE ALGEMAS" : data?.use_handcuffs} `, colSpan:2}],
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
                    [{text: `OBSERVAÇÕES:  ${data?.commments ? data.comments : "- - - - - - - - -"}`, colSpan:2},{}],
                    [{text: `CONTATO DA UPM: E-mail: 26bpm.adm@gmail.com, FONE: (99) 9 9168-3433 CENTRAL DE OPERAÇÕES`, colSpan:2}],
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
                    [{text:`MOTIVAÇÃO DA ABORDAGEM:\n${data.motivation_approach ? data.motivation_approach : "- - - - - - - - -"}`}],
                    [{text: `RELATO DOS FATOS:\n${data?.history.toUpperCase()}`,}]
                ]
            },
            layout:{
                hLineWidth: function () {return 0.5},
                vLineWidth: function () {return 0.5},
                paddingTop: function () {return 4},
            }
        },
       objects == ![] || objects == !null || objects == !'' ? null :
        {
            style: 'tableExample2',
            table:{
                widths: '50%',
                body:[
                    [{text: `OBJETOS APREENDIDOS `, colSpan:2, fillColor: '#ccc', style: 'tableHeader'}, {}]
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
                        [{text: `CHASSIS: ${item?.chassis ? item?.chassis : "- - - - - - - - -"}`, colSpan:2, }, {},{text: `MODELO: ${item?.plate ? item?.plate : "- - - - - - - - -"}`}],
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
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE SUBST.: ${item?.subtype}`},{text: `QUANTIDADE: ${item?.quantity} g`}],
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
                        [{text: `TIPO: ${item?.type.toUpperCase()}` }, {text: `TIPO DE ARMA.: ${item?.subtype.toUpperCase()}`},{text: `MARCA: ${item?.brand ? item?.brand.toUpperCase() : "- - - - - - - - -" }`}],
                        [{text: `MODELO: ${item?.model ? item?.model.toUpperCase() : "- - - - - - - - -" }` }, {text: `Nº DE SÉRIE.: ${item?.serial_number ? item?.serial_number.toUpperCase() :  "- - - - - - - - -" }`},{text: `CALIBRE: ${item?.caliber ? item?.caliber.toUpperCase() : "- - - - - - - - -"}`}],
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
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE ARMA.: ${item?.subtype.toUpperCase()}`},{text: `MARCA: ${item?.brand ? item?.brand.toUpperCase() : "- - - - - - - - -" }`}],
                        [{text: `MODELO: ${item?.model ? item?.model.toUpperCase() : "- - - - - - - - -" }` }, {text: `Nº DE SÉRIE.:  ${item?.serial_number ? item?.serial_number.toUpperCase() :  "- - - - - - - - -" }`},{text: `CALIBRE: ${item?.caliber ? item?.caliber.toUpperCase() : "- - - - - - - - -"}`}],
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
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE ARMA.: ${item?.subtype.toUpperCase()}`},{text: `MARCA: ${item?.brand ? item?.brand.toUpperCase() : "- - - - - - - - -" }`}],
                        [{text: `MODELO: ${item?.model ? item?.model.toUpperCase() : "- - - - - - - - -" }` }, {text: `Nº DE SÉRIE.:  ${item?.serial_number ? item?.serial_number.toUpperCase() :  "- - - - - - - - -" }`},{text: `CALIBRE: ${item?.caliber ? item?.caliber.toUpperCase() : "- - - - - - - - -"}`}],
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
                        [{text: `TIPO: ${item?.type}` }, {text: `TIPO DE ARMA.: ${item?.subtype.toUpperCase()}`},{text: `MARCA: ${item?.brand ? item?.brand.toUpperCase() : "- - - - - - - - -" }`}],
                        [{text: `MODELO: ${item?.model ? item?.model.toUpperCase() : "- - - - - - - - -" }` }, {text: `Nº DE SÉRIE.:  ${item?.serial_number ? item?.serial_number.toUpperCase() :  "- - - - - - - - -" }`},{text: `CALIBRE: ${item?.caliber ? item?.caliber.toUpperCase() : "- - - - - - - - -"}`}],
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
                        [{text: `QUANTIDADE: ${item?.quantity}` }, {text: `DESCRIÇÃO: ${item?.description ? item?.description.toUpperCase() : "- - - - - - - - -" }`}],
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
                        [{text: `QUANTIDADE: ${item?.quantity}` }, {text: `DESCRIÇÃO: ${item?.description ? item?.description.toUpperCase() : "- - - - - - - - -" }`}],
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
                        [{text: `QUANTIDADE: ${item?.quantity}` }, {text: `DESCRIÇÃO: ${item?.description ? item?.description.toUpperCase() : "- - - - - - - - -" }`}],
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
                        [{text: `TIPO: ${item?.type}` }, {text: `DESCR.: ${item?.description ? item?.description.toUpperCase() : "- - - - - - - - -" }`}],
                        
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
                        [{text: `TIPO: ${item?.type}` }, {text: `QTD.: R$ ${item?.quantity}`},{text: `DESCRIÇÃO: ${item?.description ? item?.description.toUpperCase() : "- - - - - - - - -" }`}],
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

        {                
            style: 'tableExample2',
            table:{
                widths: ['44% ', '*'],
                body:[
                    [{text: "RESPONSÁVEL PELA CONDUÇÃO (VOZ DE PRISÃO)", bold:true }, {text: `${data?.detention_responsible[0]?.graduation_rank} - ${data?.detention_responsible[0]?.war_name} - ID: ${data?.detention_responsible[0]?.id_policial} - CPF: ${data?.detention_responsible[0]?.cpf} `}],   
            ]
            },
            layout:{
                hLineWidth: function () {return 0.5},
                vLineWidth: function () {return 0.5},
                paddingTop: function () {return 4}
            }
        },
        data?.police_staff.map((item)=>(
            item?.staff_function === 'COMANDANTE'?
            {                
                style: 'tableExample2',
                table:{
                    widths: ['44% ', '*'],
                    body:[
                        [{text: item?.staff_function, bold:true }, {text: `${item?.graduation_rank} - ${item?.war_name} - ID: ${item?.id_policial} - CPF: ${item?.cpf} `}],
                        
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
        data?.police_staff.map((item)=>(
            item?.staff_function === 'PATRULHEIRO'?
            {                
                style: 'tableExample2',
                table:{
                    widths: ['44% ', '*'],
                    body:[
                        [{text: item?.staff_function, bold:true }, {text: `${item?.graduation_rank} - ${item?.war_name} - ID: ${item?.id_policial} - CPF: ${item?.cpf}`}],
                        
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
        data?.police_staff.map((item)=>(
            item?.staff_function === 'APOIO'?
            {                
                style: 'tableExample2',
                table:{
                    widths: ['44% ', '*'],
                    body:[
                        [{text: item?.staff_function, bold:true }, {text: `${item?.graduation_rank} - ${item?.war_name} - ID: ${item?.id_policial} - CPF: ${item?.cpf}`}],
                        
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
        data?.police_staff.map((item)=>(
            item?.staff_function === 'CENTRAL DE OPERAÇÕES'?
            {                
                style: 'tableExample2',
                table:{
                    widths: ['44% ', '*'],
                    body:[
                        [{text: item?.staff_function, bold:true }, {text: `${item?.graduation_rank} - ${item?.war_name} - ID: ${item?.id_policial} - CPF: ${item?.cpf}`}],
                        
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
            text: `CARGO/NOME:_______________________________________   MATRICULA:______________   CPF:______________________\n
            DATA: ______/______/______   HORA: _____:_____   ASSINATURA:__________________________________________________`
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