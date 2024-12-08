CREATE TABLE IF NOT EXISTS cliente (
    cid serial NOT NULL,
    nome varchar(30) NOT NULL,
    tel varchar(15) NOT NULL,
    email varchar(255),
    CONSTRAINT pk_cliente PRIMARY KEY (cid),
    CONSTRAINT uc_cliente_tel UNIQUE (tel),
    CONSTRAINT uc_cliente_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS material (
    mid serial NOT NULL,
    nome varchar(30) NOT NULL,
    valu money NOT NULL,
    CONSTRAINT pk_material PRIMARY KEY (mid)
);

CREATE TABLE IF NOT EXISTS ferramenta (
    fid serial NOT NULL,
    nome varchar(30) NOT NULL,
    valu money NOT NULL,
    obtido boolean NOT NULL,
    CONSTRAINT pk_ferramenta PRIMARY KEY (fid)
);

CREATE TABLE IF NOT EXISTS usuario (
    email varchar(255) NOT NULL,
    nome varchar(30) NOT NULL,
    senha varchar(255) NOT NULL,
    cpf varchar(14),
    admin boolean NOT NULL,
    CONSTRAINT pk_usuario PRIMARY KEY (email),
    CONSTRAINT uc_usuario_cpf UNIQUE (cpf)
);

CREATE TABLE IF NOT EXISTS servico (
    sid serial NOT NULL,
    cid int NOT NULL,
    nome varchar(30) NOT NULL,
    maoh money NOT NULL,
    stts varchar(3) NOT NULL,
    endr varchar(50) NOT NULL,
    dti date NOT NULL,
    dtc date NOT NULL,
    descr text,
    CONSTRAINT pk_servico PRIMARY KEY (sid),
    CONSTRAINT fk_servico_cid FOREIGN KEY (cid) REFERENCES cliente (cid)
);

CREATE TABLE IF NOT EXISTS adicional (
    aid serial NOT NULL,
    sid int NOT NULL,
    nome varchar(30) NOT NULL,
    vald money NOT NULL,
    CONSTRAINT pk_adicional PRIMARY KEY (aid, sid),
    CONSTRAINT fk_adicional_sid FOREIGN KEY (sid) REFERENCES servico (sid)
);

CREATE TABLE IF NOT EXISTS dia (
    data date NOT NULL,
    sid int NOT NULL,
    ntrab boolean NOT NULL,
    CONSTRAINT pk_dia PRIMARY KEY (data, sid),
    CONSTRAINT fk_dia_sid FOREIGN KEY (sid) REFERENCES servico (sid)
);

CREATE TABLE IF NOT EXISTS turno (
    num int NOT NULL,
    sid int NOT NULL,
    data date NOT NULL,
    hre time NOT NULL,
    hrs time NOT NULL,
    CONSTRAINT pk_turno PRIMARY KEY (num, sid, data),
    CONSTRAINT fk_turno_data FOREIGN KEY(data, sid) REFERENCES dia(data, sid)
);

CREATE TABLE listafer (
    fid int NOT NULL,
    sid int NOT NULL,
    CONSTRAINT pk_listafer PRIMARY KEY (fid, sid),
    CONSTRAINT fk_listafer_fid FOREIGN KEY (fid) REFERENCES ferramenta (fid),
    CONSTRAINT fk_listafer_sid FOREIGN KEY (sid) REFERENCES servico (sid)
);

CREATE TABLE listamat (
    mid int NOT NULL,
    sid int NOT NULL,
    qtd int NOT NULL,
    obtido boolean NOT NULL,
    CONSTRAINT pk_listamat PRIMARY KEY (mid, sid),
    CONSTRAINT fk_listamat_mid FOREIGN KEY (mid) REFERENCES material (mid),
    CONSTRAINT fk_listamat_sid FOREIGN KEY (sid) REFERENCES servico (sid)
);