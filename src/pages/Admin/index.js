import "./admin.css"
import { useState, useEffect } from "react"

import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth"
import {
    addDoc,
    collection,
    onSnapshot,
    query, orderBy,
    where,
    doc,
    deleteDoc,
    updateDoc
} from "firebase/firestore"


export default function Admin() {

    const [tarefaInput, setTarefaInput] = useState("")
    const [user, setUser] = useState({})
    const [editTarefa, setEditTarefa] = useState({})
    const [tarefas, setTrefas] = useState([]);

    
    useEffect(() => {
        async function loadTarefas() {
            const userDetail = localStorage.getItem("@detailUser")
            setUser(JSON.parse(userDetail))

             
            if (userDetail) {
                const data = JSON.parse(userDetail);

                const tarefaRef = collection(db, "tarefas")
                
                const q = query(tarefaRef, orderBy("created", "desc"), where("userUid", "==", data?.uid))
                const unsub = onSnapshot(q, (snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid,
                        });
                    })
                    setTrefas(lista);

                })
            }

        }

        loadTarefas();

    }, [])

   
    async function handleRegister(e) {
        e.preventDefault();

        if (tarefaInput === "") {
            alert("Digite sua tarefa...")
            return;
        }
       
        if (editTarefa?.id) {
            handleUpdateTarefa();
            return;
        }
        

        await addDoc(collection(db, "tarefas"), {
            tarefa: tarefaInput,
           
            created: new Date(),
            
            userUid: user?.uid

        })
            .then(() => {
                console.log("Tarefa registrada")
               
                setTarefaInput("")
            })
            .catch((error) => {
                console.log("Erro ao cadastra" + error)
            })

    }
    
    async function handleSair() {
        await signOut(auth);
    }
    
    async function deleteTarefa(id) {
        const docRef = doc(db, "tarefas", id)
        await deleteDoc(docRef)
    }

  
    function editarTarefa(item) {
        setTarefaInput(item.tarefa)
        setEditTarefa(item);
    }

    
    async function handleUpdateTarefa() {
        const docRef = doc(db, "tarefas", editTarefa?.id)
        await updateDoc(docRef, {
            tarefa: tarefaInput,

        })
            .then(() => {
                console.log("Tarefa atualizada")
                setTarefaInput("")
                setEditTarefa({})
            })
            .catch(() => {
                console.log("Erro ao atualizar")
                setEditTarefa({})
                setTarefaInput("")
            })
    }

    return (
        <div className="admin-container">
            <h1>Minhas tarefas</h1>

            <form className="form" onSubmit={handleRegister} >
                <textarea
                    placeholder="Digite sua tarefa..."
                    value={tarefaInput}
                    onChange={(e) => setTarefaInput(e.target.value)}
                />

                {Object.keys(editTarefa).length > 0 ? (
                    <button className="btn-register" style={{ backgroundColor: "#6add39" }} type="submit" >Atualizar tarefas</button>
                ) : (
                    <button className="btn-register" type="submit" >Registrar tarefas</button>
                )}
            </form>

            {tarefas.map((item) => (
                <article key={item.id} className="list">
                    <p>{item.tarefa}</p>

                    <div>
                        <button onClick={() => editarTarefa(item)} >Editar</button>
                        <button onClick={() => deleteTarefa(item.id)} className="btn-Delete" >Concluir</button>
                    </div>
                </article>
            ))}

            <button className="btn-Sair" onClick={handleSair}>Sair</button>
        </div>
    )
}