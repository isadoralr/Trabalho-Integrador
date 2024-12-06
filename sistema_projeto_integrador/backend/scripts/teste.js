const bcrypt = require("bcrypt");

// Exemplo: Substitua pelo hash real do banco
const hash = "$2b$10$9jPouOM7B17mOHPNCPZfM.P388KRSrsq.AUpEh9JwjyK0Cinjf/aq";
const senha = "prestadoradmin123";

bcrypt.compare(senha, hash, (err, result) => {
    if (result) {
        console.log("Senha válida!");
    } else {
        console.log("Senha inválida.");
    }
});
