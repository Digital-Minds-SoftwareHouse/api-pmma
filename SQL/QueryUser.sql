CREATE TABLE
    policiais (
        id SERIAL,
        nome_completo VARCHAR(200) NOT NULL,
        senha TEXT NOT NULL UNIQUE,
        id_policial INT NOT NULL UNIQUE PRIMARY KEY,
        matricula INT NOT NULL UNIQUE,
        nome_de_guerra VARCHAR(100),
        batalhao VARCHAR(10),
        logradouro VARCHAR(200),
        numero_casa_apto VARCHAR(20),
        complemento VARCHAR(200),
        bairro VARCHAR(100),
        cidade VARCHAR(100),
        estado VARCHAR(100),
        cep VARCHAR(20),
        rg VARCHAR(50),
        data_expedicao TIMESTAMP,
        org_emissor VARCHAR(50),
        cpf VARCHAR(50),
        numero_titulo VARCHAR(50),
        zona VARCHAR(50),
        secao VARCHAR(50),
        rg_militar INTEGER,
        numero_cnh VARCHAR(20),
        validade_cnh TIMESTAMP,
        escolaridade VARCHAR(100),
        estado_civil VARCHAR(50),
        tipo_sanguineo VARCHAR(5),
        data_incorporacao TIMESTAMP,
        data_utima_promocao TIMESTAMP,
        numero_calca INTEGER,
        numero_coturno INTEGER,
        suadeira INTEGER,
        gandola INTEGER,
        gorro INTEGER,
        funcao VARCHAR(100),
        situacao_atual VARCHAR(150),
        posto_graduacao VARCHAR(20),
        banco VARCHAR(100),
        agencia VARCHAR(100),
        conta VARCHAR(100),
        avatar_path VARCHAR(300),
        email VARCHAR(100),
        numero_telefone VARCHAR(50)
    );
    
    CREATE TABLE
    redefinir_senha(
        id SERIAL PRIMARY KEY,
        code_redef INTEGER,
        id_policial_redef INTEGER
    );
    CREATE TABLE
    dependentes(
        id SERIAL PRIMARY KEY,
        id_policial INTEGER REFERENCES policiais(id_policial) ON DELETE CASCADE ON UPDATE CASCADE,
        nome VARCHAR(150),
        nome_social VARCHAR(150),
        data_nascimento TIMESTAMP,
        endereço VARCHAR(200),
        rg VARCHAR(20),
        cpf VARCHAR(20),
        sexo VARCHAR(10),
        parentesco VARCHAR(50)
    );
    CREATE TABLE
    dados_bancarios (
        id SERIAL PRIMARY KEY,
        banco VARCHAR(200),
        agencia VARCHAR(20),
        conta VARCHAR(20)
    );

CREATE TABLE
    cursos_regulares(
        id SERIAL PRIMARY KEY,
        nivel VARCHAR(50),
        nome_instituicao TEXT,
        curso TEXT,
        ano_conclusao TIMESTAMP
    );

CREATE TABLE
    cursos_militares (
        id SERIAL PRIMARY KEY,
        curso VARCHAR(200),
        instituicao_batalhao VARCHAR(150),
        ano_conclusao TIMESTAMP
    );

CREATE TABLE
    medalhas (
        id SERIAL PRIMARY KEY,
        cod_medalha INT,
        medalha VARCHAR(150),
        data_medalha TIMESTAMP
    );

CREATE TABLE
    elogios (
        id SERIAL PRIMARY KEY,
        data_elogio TIMESTAMP,
        bi_elogio VARCHAR(150),
        descricao_elogio TEXT
    );

CREATE TABLE
    punicoes (
        id SERIAL PRIMARY KEY,
        data_punicao TIMESTAMP,
        bi_punicao VARCHAR(20),
        link_bi TEXT,
        descricao_punicao TEXT,
        resultado TEXT
    );

CREATE TABLE
    documentos_pessoais(
        id SERIAL PRIMARY KEY,
        nome_documento VARCHAR(100),
        numero_documento VARCHAR(100),
        numero_cpf VARCHAR(18),
        data_expedicao TIMESTAMP,
        orgao_emissor VARCHAR(200),
        secao VARCHAR(200),
        zona VARCHAR(10),
        validade TIMESTAMP
    );

CREATE TABLE
    policial_cruso_regular (
        id SERIAL PRIMARY KEY,
        id_policial INTEGER REFERENCES policiais(id_policial) ON DELETE CASCADE ON UPDATE CASCADE,
        id_curso_regular INTEGER REFERENCES cursos_regulares(id) ON DELETE CASCADE ON UPDATE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

CREATE TABLE
    policial_cruso_militar (
        id SERIAL PRIMARY KEY,
        id_policial INTEGER REFERENCES policiais(id_policial) ON DELETE CASCADE ON UPDATE CASCADE,
        id_curso_militar INTEGER REFERENCES cursos_militares(id) ON DELETE CASCADE ON UPDATE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

CREATE TABLE
    policial_medalha (
        id SERIAL PRIMARY KEY,
        id_policial INTEGER REFERENCES policiais(id_policial) ON DELETE CASCADE ON UPDATE CASCADE,
        id_medalhas INTEGER REFERENCES medalhas(id) ON DELETE CASCADE ON UPDATE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

CREATE TABLE
    policial_punicao (
        id SERIAL PRIMARY KEY,
        id_policial INTEGER REFERENCES policiais(id_policial) ON DELETE CASCADE ON UPDATE CASCADE,
        id_punicoes INTEGER REFERENCES punicoes(id) ON DELETE CASCADE ON UPDATE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

CREATE TABLE
    policial_documentos (
        id SERIAL PRIMARY KEY,
        id_policial INTEGER REFERENCES policiais(id_policial) ON DELETE CASCADE ON UPDATE CASCADE,
        id_documentos_pessoais INTEGER REFERENCES documentos_pessoais(id) ON DELETE CASCADE ON UPDATE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

CREATE TABLE
    policial_elogios (
        id SERIAL PRIMARY KEY,
        id_policial INTEGER REFERENCES policiais(id_policial) ON DELETE CASCADE ON UPDATE CASCADE,
        id_elogios INTEGER REFERENCES elogios(id) ON DELETE CASCADE ON UPDATE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

CREATE TABLE
    policial_dados_bancarios (
        id SERIAL PRIMARY KEY,
        id_policial INTEGER REFERENCES policiais(id_policial) ON DELETE CASCADE ON UPDATE CASCADE,
        id_dados_bancarios INTEGER REFERENCES dados_bancarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );









