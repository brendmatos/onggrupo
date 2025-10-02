import {db} from './firebaseConfig.js';
import {collection , addDoc} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


function getinput() {
    return {
        nome: document.getElementById("nome"),
        email: document.getElementById("email")
    }
}

function getValores ({nome, email}) {
    return {
        nome: nome.value.trim(),
        email: email.value.trim()  
    }
}

document.getElementById("btnEnviar").addEventListener("click", async function() {
        const inputs = getinput()
        const dados = getValores(inputs)

        console.log ("Dados", dados)

    if(!dados.nome || !dados.email){
        alert("Por favor, preencha todos os campos")
        return
    }

        try{
            const ref = await addDoc(collection (db, "funcionarios"), dados)
            console.log("ID do documento", ref.id)
            alert("Funcionário cadastrado com sucesso")
        }catch(erro){
            console.log("erro:", e)
            alert("Erro ao cadastrar funcionário")
        }



    })

    


