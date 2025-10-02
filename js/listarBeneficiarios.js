import { db } from "./firebaseConfig.js"
import { getDoc, getDocs, collection, doc, deleteDoc, setDoc} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


async function buscarBeneficiarios() {
    const dadosBanco = await getDocs(collection(db, "beneficiarios"))
    const beneficiarios = [ ]
    for (const doc of dadosBanco.docs){
        beneficiarios.push({id: doc.id, ...doc.data()})
    }
    return beneficiarios;
}

const listaBeneficiariosDiv = document.getElementById("listar-beneficiarios");

async function carregarListaDeBeneficiarios() {
    listaBeneficiariosDiv.innerHTML = '<p> Carregando Lista de beneficiarios ... </p>'
    try{
        const beneficiarios = await buscarBeneficiarios()
        console.log(beneficiarios)
        renderizarListaDeBeneficiarios(beneficiarios)
    }catch (error) {
        console.log("Erro ao carregar a lista de Beneficiarios: ", error);
        listaBeneficiariosDiv.innerHTML = '<p> Erro ao Carregar a lista de Beneficiarios </p>'
    }
}

function renderizarListaDeBeneficiarios(beneficiarios){
    listaBeneficiariosDiv.innerHTML = " "

    if(beneficiarios.length === 0){
        listaBeneficiariosDiv.innerHTML = '<p> Nenhum beneficiario cadastrado ainda</p>'
        return
    }

    for (let beneficiario of beneficiarios){
        const beneficiarioDiv = document.createElement("div");
        beneficiarioDiv.classList.add('beneficiario-item');
        beneficiarioDiv.innerHTML = ` 
        <strong> Nome: </strong> ${beneficiario.nome} <br>
        <strong> Contato: </strong> ${beneficiario.contato} <br>
        <strong> Doação: </strong> ${beneficiario.doacao} <br>
        <button class="btn-Excluir" data-id="${beneficiario.id}"> Excluir </button>
        <button class="btn-Editar" data-id="${beneficiario.id}"> Editar </button>
        `
        listaBeneficiariosDiv.appendChild(beneficiarioDiv)
    } 
    addEventListener();
}

async function excluirBeneficiario(idBeneficiario) {
    try{
        const documentoDeletar = doc(db, "beneficiarios", idBeneficiario);
        await deleteDoc(documentoDeletar)
        console.log("Beneficiario com ID" + idBeneficiario + "foi excluído.")
        return true;
    }catch (erro){
        console.log("Erro ao excluir o beneficiario", erro)
        alert("Ocorreu um erro ao excluir o beneficiario. Tente novamente!")
        return false;
    }
}

let edicao = null; // Definindo variável global


async function lidarClique(eventoDeClique) {
    const btnExcluir = eventoDeClique.target.closest('.btn-Excluir')
    if(btnExcluir){
        const certeza = confirm("Tem certeza que deseja fazer essa exclusão?")
        if(certeza){
            
            const idBeneficiario = btnExcluir.dataset.id;
            const exclusaoBemSucedida = await excluirBeneficiario(idBeneficiario)

            if(exclusaoBemSucedida) {
                carregarListaDeBeneficiarios();
                alert("Beneficiario excluído com sucesso! \o/ ")
            } 
        } else {
                alert("Exclusão cancelada")
        }
    }

    const btnEditar = eventoDeClique.target.closest('.btn-Editar')
    if (btnEditar){
        const idBeneficiario = btnEditar.dataset.id
        const beneficiario = await buscarBeneficiariosPorId(idBeneficiario)

        edicao = getValoresEditar()

        edicao.editarNome.value = beneficiario.nome
        edicao.editarContato.value = beneficiario.contato
        edicao.editarDoacao.value = beneficiario.doacao
        edicao.editarId.value = beneficiario.id


        edicao.formularioEdicao.style.display = 'block'
    }
}

function getValoresEditar() {
    return {
        editarNome: document.getElementById("editar-nome"),
        editarContato: document.getElementById("editar-contato"),
        editarDoacao: document.getElementById("editar-doacao"),
        editarId: document.getElementById("editar-id"),
        formularioEdicao: document.getElementById("formulario-edicao")

    }
}

async function buscarBeneficiariosPorId(id) {
    try{
        const beneficiarioDoc = doc(db, "beneficiarios", id)
        const dadoAtual = await getDoc(beneficiarioDoc)

        if (dadoAtual.exists()){
            return {contato: dadoAtual.id, ...dadoAtual.data()}
        }else {
            console.log("Beneficiario não encontrando com o ID", id);
            return null;
        }
    } catch (erro){
        console.log("Erro ao buscar o beneficiario por ID ", erro)
        alert("Erro ao buscar beneficiario para editar")
        return null
    }
    
}

document.getElementById("btnSalvarEdicao").addEventListener("click", async () => {
    const id = edicao.editarId.value;
    const novoDados={
        nome: edicao.editarNome.value.trim(),
        contato: parseInt(edicao.editarContato.value),
        doacao: edicao.editarDoacao.value.trim(),
    }

    try{
        const ref = doc(db, "beneficiarios", id)
        await setDoc(ref, novoDados)
        alert("Beneficiario atualizado com sucesso!")
        edicao.formularioEdicao.style.display = 'none'
        carregarListaDeBeneficiarios();
    } catch (error){
        console.log("Erro ao salvar edicão", error);
        alert("Erro ao atualizar beneficiarios.")
    }
})

document.getElementById('btnCancelarEdicao').addEventListener('click', () => {
    document.getElementById("formulario-edicao").style.display = 'none'
})

function addEventListener(){
    listaBeneficiariosDiv.addEventListener("click", lidarClique)
}

document.addEventListener("DOMContentLoaded", carregarListaDeBeneficiarios)