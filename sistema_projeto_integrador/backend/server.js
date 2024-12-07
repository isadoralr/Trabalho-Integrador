const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const pgp = require("pg-promise")({});
require("dotenv").config();

// Configuração do banco de dados
const db = pgp(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

db.connect()
    .then(() => console.log("Conexão bem-sucedida com o banco de dados"))
    .catch((error) => console.error("Erro ao conectar ao banco de dados:", error.message));

// Configuração do Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessão (opcional se você usar apenas JWT)
app.use(
    session({
        secret: "alguma_frase_muito_doida_pra_servir_de_SECRET",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === "production" },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Estratégia Local
passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, done) => {
            try {
                const user = await db.oneOrNone(
                    "SELECT email, senha FROM usuario WHERE email = $1;",
                    [email]
                );

                if (!user) {
                    return done(null, false, { message: "Usuário não encontrado." });
                }

                const passwordMatch = await bcrypt.compare(password, user.senha);
                if (!passwordMatch) {
                    return done(null, false, { message: "Senha incorreta." });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Estratégia JWT
passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "your-secret-key",
        },
        async (payload, done) => {
            try {
                const user = await db.oneOrNone(
                    "SELECT * FROM usuario WHERE email = $1;",
                    [payload.email]
                );

                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

// Serialização e desserialização
passport.serializeUser((user, done) => {
    done(null, { email: user.email });
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Inicia o servidor
app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001");
});

app.post(
	"/login",
	passport.authenticate("local", { session: false }),
	(req, res) => {

		// Cria o token JWT
		const token = jwt.sign({ username: req.body.username }, "your-secret-key", {
			expiresIn: "1h",
		});

		res.json({ message: "Login successful", token: token });
	},
);

app.post("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		res.redirect("/");
	});
});

app.post('/cadastro-cliente', async (req, res) => {
    const { nome, telefone, email } = req.body;
    try {
      await db.none('INSERT INTO cliente (nome, tel, email) VALUES ($1, $2, $3)', [nome, telefone, email]);
      res.status(201).send('Cliente cadastrado com sucesso.');
    } catch (err) {
      console.error('Erro ao cadastrar cliente:', err.message);
      res.status(500).send(`Erro ao cadastrar cliente: ${err.message}`);
    }
  });

// Rota para buscar todos os clientes
app.get("/clientes", async (req, res) => {
    try {
      // Consulta no banco de dados para pegar todos os clientes
      const clientes = await db.any("SELECT cid, nome, tel FROM cliente");
      res.json(clientes); // Retorna a lista de clientes em formato JSON
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
      res.status(500).send("Erro ao buscar clientes.");
    }
});

app.get("/ferramentas", async (req, res) => {
    try {
      // Consulta no banco de dados para pegar todas as ferramentas
      const ferramentas = await db.any("SELECT fid, nome, valu, obtido FROM ferramenta");
      res.json(ferramentas); // Retorna a lista de ferramentas em formato JSON
    } catch (err) {
      console.error("Erro ao buscar ferramentas:", err);
      res.status(500).send("Erro ao buscar ferramentas.");
    }
});

app.post('/cadastro-ferramenta', async (req, res) => {
    const { nome, valu} = req.body;
    const obtido = false;
    try {
      await db.none('INSERT INTO ferramenta (nome, valu, obtido) VALUES ($1, $2, $3)', [nome, valu, obtido]);
      res.status(201).send('Ferramenta cadastrada com sucesso.');
    } catch (err) {
      console.error('Erro ao cadastrar ferramenta:', err.message);
      res.status(500).send(`Erro ao cadastrar ferramenta: ${err.message}`);
    }
});

app.patch('/ferramentas/:fid', async (req, res) => {
    const { fid } = req.params; 
    const { obtido } = req.body;
    try { 
        await db.none('UPDATE ferramenta SET obtido = $1 WHERE fid = $2', [obtido, fid]);
        res.status(200).send('Status da ferramenta atualizado com sucesso.');
    } catch (error) {
        res.status(500).send('Erro ao atualizar status da ferramenta.'); 
    }
});

// Deletar ferramenta

app.delete('/ferramentas/:fid', async (req, res) => {
    const { fid } = req.params;
    try {
      await db.none('DELETE FROM ferramenta WHERE fid = $1', [fid]);
      res.status(204).send(); // Sucesso sem corpo de resposta
    } catch (error) {
      console.error('Erro ao excluir ferramenta:', error);
      res.status(500).send('Erro ao excluir ferramenta.');
    }
  });
  

// Rota para atualizar uma ferramenta pelo ID
app.put('/ferramentas/:fid', async (req, res) => {
    const { fid } = req.params; // Pega o ID da ferramenta a ser alterada
    const { nome, valu } = req.body; // Dados enviados pelo frontend

    try {
        // Validação de entrada
        if (!nome || !valu) {
            return res.status(400).send('Nome e valor unitário são obrigatórios.');
        }

        // Atualiza a ferramenta no banco de dados
        const result = await db.none(
            `UPDATE ferramenta 
            SET nome = $1, valu = $2 
            WHERE fid = $3`,
            [nome, valu, fid] // Formata o valor monetário
        );

        res.status(200).send('Ferramenta atualizada com sucesso.');
    } catch (error) {
        console.error('Erro ao atualizar ferramenta:', error);
        res.status(500).send('Erro ao atualizar ferramenta. Tente novamente.');
    }
});

let resultadoTotalMaoDeObra = null;
let resultadoTotalTransporte = null;
let resultadoTotalMateriais = null;

// Rota GET para retornar os dados da mão de obra
app.get("/obter-total-mao-de-obra", (req, res) => {
    if (resultadoTotalMaoDeObra) {
        res.send(resultadoTotalMaoDeObra);
    } else {
        res.status(404).send({ error: "Dados de mão de obra ainda não calculados." });
    }
});

// Rota GET para retornar os dados do transporte
app.get("/obter-total-custo-transporte", (req, res) => {
    if (resultadoTotalTransporte) {
        res.send(resultadoTotalTransporte);
    } else {
        res.status(404).send({ error: "Dados de transporte ainda não calculados." });
    }
});

// Rota GET para retornar os dados dos materiais
app.get("/obter-total-custo-materiais", (req, res) => {
    if (resultadoTotalMateriais) {
        res.send(resultadoTotalMateriais);
    } else {
        res.status(404).send({ error: "Dados de materiais ainda não calculados." });
    }
});

// Rota GET para calcular o total do serviço (soma dos custos de mão de obra, transporte e materiais)
app.get("/obter-total-servico", (req, res) => {
    if (resultadoTotalMaoDeObra && resultadoTotalTransporte && resultadoTotalMateriais) {
        // Somando os custos totais de mão de obra, transporte e materiais
        const totalServico = resultadoTotalMaoDeObra.maoObraTotal + 
                             resultadoTotalTransporte.totalTransporte + 
                             resultadoTotalMateriais.totalCost;

        // Respondendo com o cálculo final
        res.send({
            maoDeObra: resultadoTotalMaoDeObra.maoObraTotal,
            transporte: resultadoTotalTransporte.totalTransporte,
            materiais: resultadoTotalMateriais.totalCost,
            totalServico // Total final somado
        });
    } else {
        res.status(404).send({ error: "Faltam dados para calcular o total do serviço. Certifique-se de que todas as etapas (mão de obra, transporte e materiais) foram calculadas." });
    }
});

// Função auxiliar para calcular a diferença de horas entre dois horários (horaInicio e horaFim)
function calcularHorasTurno(turno) {
    const [horaInicio, minutoInicio] = turno.inicio.split(":").map(Number);
    const [horaFim, minutoFim] = turno.fim.split(":").map(Number);

    const inicio = new Date(0, 0, 0, horaInicio, minutoInicio);
    const fim = new Date(0, 0, 0, horaFim, minutoFim);

    // Calculando a diferença em horas
    return (fim - inicio) / (1000 * 60 * 60); // Resultado em horas
}

// Função para contar os dias trabalhados considerando repetição e dias não trabalhados
function contarDiasComRepeticao(start, end, repetition, diasNaoTrabalhados) {
    let totalDias = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const diaSemana = d.getDay(); // Obtém o dia da semana
        // Se o dia da semana está na lista de repetição (ajuste: 0 = domingo, 1 = segunda, etc.)
        if (repetition.includes(diaSemana) && !diasNaoTrabalhados.includes(d.toISOString().split('T')[0])) {
            totalDias++;
        }
    }
    return totalDias;
}

// Rota POST para calcular o custo total da mão de obra e armazenar os resultados
app.post("/calcular-total-mao-de-obra", (req, res) => {
    const { startDate, endDate, repetition, shifts, laborCostPerHour, diasNaoTrabalhados } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalHorasDiarias = shifts.reduce((total, turno) => total + calcularHorasTurno(turno), 0);
    const totalDiasTrabalhados = contarDiasComRepeticao(start, end, repetition, diasNaoTrabalhados);
    const totalHorasTrabalhadas = totalHorasDiarias * totalDiasTrabalhados;
    const maoObraTotal = totalHorasTrabalhadas * laborCostPerHour;

    resultadoTotalMaoDeObra = {
        totalDiasTrabalhados,
        totalHorasTrabalhadas,
        maoObraTotal
    };

    res.send(resultadoTotalMaoDeObra);
});

// Rota POST para calcular o custo total de transporte e armazenar os resultados
app.post("/calcular-custo-total-transporte", (req, res) => {
    const { valorTransportePorDia, startDate, endDate, repetition, diasNaoTrabalhados } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDiasTrabalhados = contarDiasComRepeticao(start, end, repetition, diasNaoTrabalhados);
    const custoTotalTransporte = valorTransportePorDia * totalDiasTrabalhados;

    resultadoTotalTransporte = {
        totalDiasTrabalhados,
        totalTransporte: custoTotalTransporte
    };

    res.send(resultadoTotalTransporte);
});

// Rota POST para calcular o custo total dos materiais e armazenar os resultados
app.post("/calcular-custo-total-materiais", (req, res) => {
    const materiais = req.body.materiais;
    let totalCost = 0;
    let totalNonObtainedCost = 0;

    materiais.forEach(material => {
        const itemCost = material.qtd * material.unitValue;
        totalCost += itemCost;
        if (!material.obtido) {
            totalNonObtainedCost += itemCost;
        }
    });

    resultadoTotalMateriais = {
        totalCost,
        totalNonObtainedCost
    };

    res.send(resultadoTotalMateriais);
});