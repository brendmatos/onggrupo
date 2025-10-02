import { db } from './firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

function getInput() {
    return {
        nome: document.getElementById("nome"),
        email: document.getElementById("email"), // alterado aqui
        cnpj: document.getElementById("cnpj")
    };
}

function getValores({ nome, email, cnpj }) {
    return {
        nome: nome.value.trim(),
        email: email.value.trim(),
        cnpj: parseInt(cnpj.value.trim())
    };
}

document.getElementById("botaoEnviar").addEventListener("click", async function () {
    const inputs = getInput();
    const dados = getValores(inputs);

    console.log("Dados:", dados);

    try {
        const ref = await addDoc(collection(db, "doadores"), dados);
        console.log("ID do documento:", ref.id);
        alert("Doador cadastrado com sucesso");
    } catch (e) {
        console.log("Erro:", e);
        alert("Erro ao cadastrar doador");
    }
})