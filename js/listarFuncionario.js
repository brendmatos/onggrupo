import { db } from "./firebaseConfig.js"
import { getDocs, getDoc, collection, doc, deleteDoc,setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

async function buscarFuncionarios() {
    const dadosBanco = await getDocs(collection(db, "funcionarios"))
    const funcionarios = []
    for (const doc of dadosBanco.docs) {
        funcionarios.push({ id: doc.id, ...doc.data() })
    }
    return funcionarios;

}

const listaFuncionarioDiv = document.getElementById("listar-funcionarios");

async function carregarListaDeFuncionarios() {
    listaFuncionarioDiv.innerHTML = '<p> Carregando Lista de Funcionarios...</p>'

    try {
        const funcionarios = await buscarFuncionarios()
        console.log(funcionarios)
        renderizarListaDeFuncionarios(funcionarios);
    } catch (error) {
        console.log("erro ao carregar a lista de funcionarios: ", error);
        listaFuncionarioDiv.innerHTML = '<p> Erro ao carregar a lista de funcionarios</p>'

    }
}

function renderizarListaDeFuncionarios(funcionarios) {
    listaFuncionarioDiv.innerHTML = ' '

    if (funcionarios.length === 0) {
        listaFuncionarioDiv.innerHTML = '<p> Nenhum funcionário cadastrado ainda </p'
        return
    }

    for (let funcionario of funcionarios) {
        const funcionarioDiv = document.createElement("div");
        funcionarioDiv.classList.add('funcionario-item');
        funcionarioDiv.innerHTML = `
        <strong> Nome: </strong> ${funcionario.nome}<br>
        <strong> Email: </strong> ${funcionario.email}<br>
        <button class="btnExcluir" data-id="${funcionario.id}"> Excluir </button>
        <button class="btnEditar" data-id="${funcionario.id}"> Editar </button>
        `;
        listaFuncionarioDiv.appendChild(funcionarioDiv)

    }
    addEventListener();
}

async function excluirFuncionario(idFuncionario) {

    try {
        const documentoDeletar = doc(db, "funcionarios", idFuncionario);
        await deleteDoc(documentoDeletar)
        console.log("Funcionario com ID" + idFuncionario + "foi excluido")
        return true
    } catch (erro) {
        console.log("erro ao excluir o funcionario", erro)
        return false
    }
}


let edicao = null; 

async function lidarClique(eventoDeClique) {
    const btnExcluir = eventoDeClique.target.closest('.btnExcluir')
    if (btnExcluir) {
        const certeza = confirm("tem certeza que deseja excluir?")
        if (certeza) {
            const idFuncionario = btnExcluir.dataset.id;
            const exclusaoBemSucedida = await excluirFuncionario(idFuncionario)
            if (exclusaoBemSucedida) {
                alert("Funcionario excluido com sucesso!")
                carregarListaDeFuncionarios();
            }
        } else {
            alert("Exclusão cancelada!")
        }

    }
    const btnEditar = eventoDeClique.target.closest('.btnEditar')
    if (btnEditar) {
        const idFuncionario = btnEditar.dataset.id;
        console.log("ID do funcionario para editar:", idFuncionario)
        const funcionario = await buscarFuncionariosPorId(idFuncionario);
        console.log("Funcionario encontrado para editar:", funcionario)



        edicao = getValoresEditar();

        edicao.editarNome.value = funcionario.nome;
        edicao.editarEmail.value = funcionario.email;
        edicao.editarId.value = funcionario.id;
        edicao.formularioEdicao.style.display = "block";

        console.log("Funcionario para editar:", funcionario)

    }
}
function getValoresEditar() {
    return {
        editarNome: document.getElementById("editar-nome"),
        editarEmail: document.getElementById("editar-email"),
        editarId: document.getElementById("editar-id"),
        formularioEdicao: document.getElementById("formulario-edicao") 
    }
}
async function buscarFuncionariosPorId(id) {
    try {
        const funcionarioDoc = doc(db, "funcionarios", id)
        const dadoAtual = await getDoc(funcionarioDoc)
        
        if (dadoAtual.exists()) {
            return {id:dadoAtual.id, ...dadoAtual.data() }
        } else {
            console.log("Nenhum funcionario encontrado com esse ID",id)
            return null
        }
    } catch(erro) {
        console.log("Erro ao buscar funcionario por ID", erro)
        alert("Erro ao buscar funcionario por ID")
        return null;
    
    }   
    
}

document.getElementById("btnSalvarEdicao").addEventListener("click", async () => {
    const id = edicao.editarId.value;
    const novoDados = {
        nome: edicao.editarNome.value.trim(),
        email: edicao.editarEmail.value.trim()
    }

    console.log("Dados para salvar", id, novoDados)

    try {
        const ref = doc(db, "funcionarios", id)
        await setDoc(ref, novoDados)
        alert("Funcionario editado com sucesso!")
        edicao.formularioEdicao.style.display = "none";
        carregarListaDeFuncionarios();
    } catch (error) {
        console.log("Erro ao editar funcionario", error)
        alert("Erro ao editar funcionario")
    }
})

document.getElementById('btnCancelarEdicao').addEventListener('click', () => {
    document.getElementById("formulario-edicao").style.display = 'none'
})

function addEventListener() {
    listaFuncionarioDiv.addEventListener("click", lidarClique)
}

document.addEventListener("DOMContentLoaded", carregarListaDeFuncionarios)
