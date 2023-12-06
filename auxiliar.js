/**
 * 
 *
actions-runner/_work/sis-adm-api-26/sis-adm-api-26
      - name: Instal deps
        run: npm install

      - name: Stop Pm2
        run: pm2 stop server
        if: ${{failure()}}

      - name: Localização 2
        run: ls -la

      - name: rodando o server
        run: pm2 start index.js --name server


      - name: Localização
        run: ls -la
 */