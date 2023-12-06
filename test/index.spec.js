const  request  = require("supertest");
const app = require('../index')



describe('TEST ROUTE', () => {
    it('TEST GET ROUTE', async () => {
        const res =  await request(app)
            .get("/reports")

      
         expect(res.body[0]).toMatchObject({"area": "F"})
    });
    it("TEST POST ROUTE", async ()=>{
        const res = await request(app)
        .post("/reports").send(
            
                {
                    "number_report": 1 ,
                    "type_report": "ocorrência" ,
                    "date_time": "31/10/2020" ,
                    "report_address": "rua cajazeiras" ,
                    "report_city": "AÇAILANDIA" ,
                    "report_district": "VILA ILDEMAR" ,
                    "cep": "65930-000" ,
                    "police_garrison": "AREA F" ,
                    "latitude": "234823048" ,
                    "longitude": "234098023948" ,
                    "history": "ROUBO A MORTO NAS OPROXIMIDADES DO BOX DA POLICIA" ,
                    "area": "F" ,
                    "battalion": "26" ,
                    "punctuaction": "",
                    "natures": [
                        {
                            "id": 1,
                            "nature": "APREENSÃO DE ARMA DE FOGO",
                            "punctuaction": 120
                        },
                        {
                            "id": 2,
                            "nature": "HOMICÍDIO",
                            "punctuaction": 150
                        }
                    ],
                    "police_staff":[
                        {
                            "war_name": "Muniz",
                            "graduation_rank": "SD-PM",
                            "id_policial": 821390,
                            "staff_function": "PATRULHEIRO"
                        },
                        {
                            "war_name": "SANTIAGO",
                            "graduation_rank": "SD-PM",
                            "id_policial": 821390,
                            "staff_function": "ATENDENTE"
                        }       
                    ],
                    "envolveds":[
                        {
                            "id": 1,
                            "name": "LUIS DO NASCIMENTO",
                            "type_of_envolvement": "VÍTIMA",
                            "birthdate": "2023-08-12 19:30:45.381",
                            "mother": "MARIA DO NASCIMENTO SANTOS",
                            "sex":  "MASCULINO",
                            "gender": "CIS GÊNERO",
                            "address": "rua g quadra 19",
                            "district":  "JARDIM DE ALÁH",
                            "city": "AÇAILANDIA",
                            "naturalness": "IMPERATRIZ-MA",
                            "race_color": "PARDO",
                            "phone_number": "(99) 9 9155-3344",
                            "rg": 12380,
                            "cpf": 4206,
                            "particular_signs": null,
                            "bodily_injuries": null
                        },
                                {
                            "id": 2,
                            "name": "MARIA MIRANDA",
                            "type_of_envolvement": "VÍTIMA",
                            "birthdate": "2023-08-12 19:30:45.381",
                            "mother": "MARIA DO NASCIMENTO SANTOS",
                            "sex":  "MASCULINO",
                            "gender": "CIS GÊNERO",
                            "address": "rua g quadra 19",
                            "district":  "JARDIM DE ALÁH",
                            "city": "AÇAILANDIA",
                            "naturalness": "IMPERATRIZ-MA",
                            "race_color": "PARDO",
                            "phone_number": "(99) 9 9155-3344",
                            "rg": 12980,
                            "cpf": 4306,
                            "particular_signs": null,
                            "bodily_injuries": null
                        },
                                {
                            "id": 3,
                            "name": "MARIO FEITOSA",
                            "type_of_involvement": "CONDUZIDO",
                            "birthdate": "2023-08-12 19:30:45.381",
                            "mother": "MARIA DO NASCIMENTO SANTOS",
                            "sex":  "MASCULINO",
                            "gender": "CIS GÊNERO",
                            "address": "rua g quadra 19",
                            "district":  "JARDIM DE ALÁH",
                            "city": "AÇAILANDIA",
                            "naturalness": "IMPERATRIZ-MA",
                            "race_color": "PARDO",
                            "phone_number": "(99) 9 9155-3344",
                            "rg": "79802344234",
                            "cpf": "042.116.193-06",
                            "particular_signs": null,
                            "bodily_injuries": null
                        }
                    ],
                    "objects":[
                        {
                            "type": "ARMA DE FOGO",
                            "subtype": "PISTOLA",
                            "caliber": ".40",
                            "serial_number": "RF4JKL3"
                        },
                        {
                            "type": "ARMA BRANCA",
                            "description": "FACÃO SEM CABO"
                        },
                        {
                            "type": "VEÍCULO",
                            "plate": "OXV-4914",
                            "chassis": "9C2RLSALN234LW9238",
                            "brand": "CHEVROLET",
                            "model": "S10",
                            "stolen_recovered": true
                        },
                        {
                            "type":"DROGAS",
                            "subtype": "MACONHA",
                            "quantity": 10.5
                        },
                        {
                            "type": "OUTROS",
                            "description": "(01) MOCHILA, (01) RELOGIO"
                        },
                        {
                            "type": "DINHEIRO",
                            "quantity": 100
                        }
                    ]
                }
                
            
        )

         expect(res.body).toMatchObject({"message": "report register success!"})
         expect(res.statusCode).toEqual(201)
    })
    
});
