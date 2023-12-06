/**
 * @param {?number} code
 */

const  MailRecoveryModel = function (code){
    const html = `
        <div class="container" style="box-sizing: border-box; padding: 2rem; width: 100%; height: 100vh; background-color: #3A72A8;">
            <div class="wrapper" style="box-sizing: border-box; position: relative; top: 50%; left: 50%; translate: -50% -50%; width: 28rem; height: 20rem; border-radius: 1rem; background-color: aliceblue;">
                <div class="header" style="box-sizing: border-box; padding: 0.7rem; width: 100%; height: 5rem; text-align: center; font-size: larger; background-color: #73C4E2 ; border-radius: 1rem 1rem 0 0;"  >
                    <h4>CÓDIGO PARA REDEFINIÇÃO DE SENHA</h1>
                </div>
                <div class="main" style="box-sizing: border-box; padding: 0 1.5rem 0 1.5rem; width: 100%;">
                    <p style="">Insira o código abaixo no campo de codigo da area de redefinição de senha para prosseguir.</p>
                    <div style="box-sizing: border-box; margin: 1rem auto 0; padding: 0.12rem; width: 16rem; height: 5rem; text-align: center; background-color: #bbbbbb; border-radius: 0.7rem;">
                        <h1 style="box-sizing: border-box; letter-spacing: 10px;">${code}</h1>
                    </div>
                </div>
                <div class="footer" style="box-sizing: border-box; position: absolute; bottom: 0; padding: 0rem; width: 100%; height: 3rem; text-align: center; font-size: small;  background-color: #73C4E2; border-radius: 0 0 0.7rem 0.7rem;">
                    <p>TODOS OS DIREITOS RESERVADOS À<br> POLICIA MILITAR DO MARANHÃO</p>
                </div >
            </div>
        </div>
    `

    return( html )
}

module.exports = MailRecoveryModel