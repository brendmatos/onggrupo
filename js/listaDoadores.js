import { db } from "./firebaseConfig.js"
import { getDocs, collection, doc, deleteDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

console.log("PASSEI POR AQUI")

async function buscarDoadores() {
    const dadosBanco = await getDocs(collection(db, "doadores"))
    const doadores = []
    for (const doc of dadosBanco.docs) {
        doadores.push({ id: doc.id, ...doc.data() })
    }
    return doadores;
}

const listaDoadoresDiv = document.getElementById("listar-doadores")

async function carregarListaDeDoadores() {
    listaDoadoresDiv.innerHTML = ' <p> Carregando Lista de doadores ...</p>'
    try {
        const doadores = await buscarDoadores()
        console.log(doadores)
        renderizarListaDeDoadores(doadores)
    } catch (error) {
        console.log("Erro ao carregar a lista de doadores", error);
        listaDoadoresDiv.innerHTML = '<p Erro ao carregar a lista de doadores</p>'

    }
}

function renderizarListaDeDoadores(doadores) {
    listaDoadoresDiv.innerHTML = ' '

    if (doadores.length === 0) {
        listaDoadoresDiv.innerHTML = '<p> Nenhum doador cadastrado ainda</p>'
        return
    }
    for (let doador of doadores) {
        const doadoresDiv = document.createElement("div")
        doadoresDiv.classList.add('Doador-item');
        doadoresDiv.innerHTML = `
        <strong> Nome: </strong> ${doador.nome}<br>
        <strong> Email: </strong> ${doador.email}<br>
        <strong> cnpj: </strong> ${doador.cnpj}<br>
        <button class="botaoExcluir" data-id="${doador.id}">Excluir</button>
        <button class="botaoEditar" data-id="${doador.id}">Editar</button>      `
        listaDoadoresDiv.appendChild(doadoresDiv)
    }
    addEventListener();
}
async function excluirDoador(idDoador) {
    try {
        const documentoDeletar = doc(db, "doadores", idDoador)
        await deleteDoc(documentoDeletar)
        console.log("Doador com ID") + idDoador + "foi excluido"
        return true;
    } catch (erro) {
        console.log("Erro ao excluir o doador", erro)
        alert("Ocorreu um erro ao excluir o doador. Tente novamente!")
        return false;
    }
}
async function lidarClique(eventoDeClique) {
    const botaoExcluir = eventoDeClique.target.closest('.botaoExcluir')
    if (botaoExcluir) {
        const certeza = confirm("Tem certeza que deseja fazer ess exclusão")
        if (certeza) {
            const idDoador = botaoExcluir.dataset.id;
            const exclusaoBemSucedida = await excluirDoador(idDoador)

            if (exclusaoBemSucedida) {
                carregarListaDeDoadores();
                alert("Doador excluido com sucesso!")
            }
        } else {
            alert("Exclusao cancelada")
        }
    }
    const botaoEditar = eventoDeClique.target.closest('.botaoEditar')
    if (botaoEditar) {
        const idDoador = botaoEditar.dataset.id;
        const doador = await buscarDoadorPorId(idDoador);

        const edicao = getValoresEditar()

        edicao.editarNome.value = doador.nome;
        edicao.editarIdade.value = doador.email;
        edicao.editarCargo.value = doador.cnpj;
        edicao.editarId.value = doador.id;

        edicao.formularioEdicao.style.display = 'block';
    }
}

function getValoresEditar() {
    return {
        formularioEdicao: document.getElementById('formulario-edicao'),
        editarNome: document.getElementById('editar-nome'),
        editarIdade: document.getElementById('editar-email'),
        editarCargo: document.getElementById('editar-cnpj'),
        editarId: document.getElementById('editar-id')
    }
}
async function buscarDoadorPorId(id) {
    try {
        const ref = doc(db, "doadores", id);
        const dadosAtual = await getDoc(ref);
        if (dadosAtual.exists()) {
            return { id: dadosAtual.id, ...dadosAtual.data() };
        } else {
            console.log("Nenhum doador encontrado com o ID", id);
            return null;
        }
    } catch (erro) {
        console.log("Erro ao buscar doador por ID", erro);
        alert("Ocorreu um erro ao buscar o doador para editar");
        return null;
    }
}
document.getElementById("botaoSalvarEdicao").addEventListener("click", async () => {
    const edicao = getValoresEditar();
    const id = edicao.editarId.value;
    const novoDados = {
        nome: edicao.editarNome.value,
        email: edicao.editarIdade.value,
        cnpj: parseInt(edicao.editarCargo.value),
    };
    try {
        const ref = doc(db, "doadores", id);
        await setDoc(ref, novoDados);
        alert("Doador editado com sucesso!");
        edicao.formularioEdicao.style.display = 'none';
        carregarListaDeDoadores();
    } catch (erro) {
        console.log("Erro ao salvar edicao", erro);
        alert("Erro ao atualizar doador", erro);
    }

})


function addEventListener() {
    listaDoadoresDiv.addEventListener("click", lidarClique)
}



document.addEventListener("DOMContentLoaded", carregarListaDeDoadores)