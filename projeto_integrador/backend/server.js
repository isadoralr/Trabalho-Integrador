const express = require("express");
const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: true}));//Transforma a requisição(string)

server.listen(3001,() => {console.log('servidor rodando')});

let resultadoTotalMaoDeObra = null;
let resultadoTotalTransporte = null;
let resultadoTotalMateriais = null;

// Rota GET para retornar os dados da mão de obra
server.get("/obter-total-mao-de-obra", (req, res) => {
    if (resultadoTotalMaoDeObra) {
        res.send(resultadoTotalMaoDeObra);
    } else {
        res.status(404).send({ error: "Dados de mão de obra ainda não calculados." });
    }
});

// Rota GET para retornar os dados do transporte
server.get("/obter-total-custo-transporte", (req, res) => {
    if (resultadoTotalTransporte) {
        res.send(resultadoTotalTransporte);
    } else {
        res.status(404).send({ error: "Dados de transporte ainda não calculados." });
    }
});

// Rota GET para retornar os dados dos materiais
server.get("/obter-total-custo-materiais", (req, res) => {
    if (resultadoTotalMateriais) {
        res.send(resultadoTotalMateriais);
    } else {
        res.status(404).send({ error: "Dados de materiais ainda não calculados." });
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

// Rota POST para calcular o custo total da mão de obra
server.post("/calcular-total-mao-de-obra", (req, res) => {
    // Pegando os dados do corpo da requisição
    const { startDate, endDate, repetition, shifts, laborCostPerHour, diasNaoTrabalhados } = req.body;

    // Convertendo as datas para objetos Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculando o total de horas diárias de trabalho somando os turnos
    const totalHorasDiarias = shifts.reduce((total, turno) => total + calcularHorasTurno(turno), 0);

    // Calculando o total de dias trabalhados
    const totalDiasTrabalhados = contarDiasComRepeticao(start, end, repetition, diasNaoTrabalhados);

    // Calculando o total de horas trabalhadas
    const totalHorasTrabalhadas = totalHorasDiarias * totalDiasTrabalhados;

    // Calculando o custo total da mão de obra
    const maoObraTotal = totalHorasTrabalhadas * laborCostPerHour;

    // Respondendo com o cálculo final
    res.send({
        totalDiasTrabalhados,
        totalHorasTrabalhadas,
        maoObraTotal
    });
});

// Rota POST para calcular o custo total de transporte
server.post("/calcular-custo-total-transporte", (req, res) => {
    const { valorTransportePorDia, startDate, endDate, repetition, diasNaoTrabalhados } = req.body;

    // Convertendo as datas para objetos Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculando o total de dias trabalhados
    const totalDiasTrabalhados = contarDiasComRepeticao(start, end, repetition, diasNaoTrabalhados);

    // Calculando o custo total de transporte
    const custoTotalTransporte = valorTransportePorDia * totalDiasTrabalhados;

    // Respondendo com o cálculo final
    res.send({
        totalDiasTrabalhados,
        totalTransporte: custoTotalTransporte
    });
});

server.post("/calcular-custo-total-materiais", (req, res) => {
    const materiais = req.body.materiais; // Lista de materiais do request

    let totalCost = 0;
    let totalNonObtainedCost = 0;

    materiais.forEach(material => {
        const itemCost = material.qtd * material.unitValue; // Calcula o custo do material
        totalCost += itemCost; // Soma ao custo total

        if (!material.obtido) { // Verifica se o material ainda não foi obtido
            totalNonObtainedCost += itemCost; // Soma ao custo dos materiais não comprados
        }
    });

    res.send({
        totalCost, // Custo total de todos os materiais
        totalNonObtainedCost // Custo total dos materiais ainda não comprados
    });
});