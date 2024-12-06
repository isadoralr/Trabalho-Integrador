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


const usuario = process.env.DB_USER || "padrao";
const senha = process.env.DB_PASSWORD || "conexaosistema123";
const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || 5432;
const database = process.env.DB_NAME || "planomei";

const db = pgp(`postgres://${usuario}:${senha}@${host}:${port}/${database}`);
module.exports = db;

db.connect()
  .then(obj => {
    obj.done(); // success, release the connection
    console.log("Conexão bem-sucedida com o banco de dados");
  })
  .catch(error => {
    console.error("Erro ao conectar ao banco de dados:", error.message);
  });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
            usernameField: "username",
            passwordField: "password",
        },
        async (username, password, done) => {
            try {
                const user = await db.oneOrNone(
                    "SELECT email, senha FROM usuario WHERE email = $1;",
                    [username]
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
                    [payload.username]
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