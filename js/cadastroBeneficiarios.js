// js/cadastroDoadores.js
import { db } from "./firebaseConfig.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { ref, push, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

function getInput() {
  return {
    nome: document.getElementById("nome"),
    contato: document.getElementById("contato"),
    doacao: document.getElementById("doacao")
  };
}

function getValores({ nome, contato, doacao }) {
  return {
    nome: nome.value.trim(),
    contato: parseInt(contato.value),
    doacao: doacao.value.trim()
  };
}

document.getElementById("btnEnviar").addEventListener("click", async () => {
  const Inputs = getInput();
  const dados = getValores(Inputs);

  if (!dados.nome || !dados.contato || !dados.doacao) {
    alert("⚠️ Todos os campos devem ser preenchidos!");
    return;
  }

  try {

    const refDoc = await addDoc(collection(db, "beneficiarios"), dados);
    console.log("ID do documento", refDoc.id)
    alert("✅ beneficiario cadastrado com sucesso!");
    Inputs.nome.value = "";
    Inputs.contato.value = "";
    Inputs.doacao.value = "";
  } catch (e) {
    console.log("Erro:", e);
    alert("❌ Erro ao cadastrar beneficiario.");
  }
});