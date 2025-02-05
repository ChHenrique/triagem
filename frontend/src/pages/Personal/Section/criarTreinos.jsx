import { TreinoCriacao } from "../Components/TreinoCriação"
import { TreinosCr } from "../Components/treinoCompleCriacao"
import { useState,useEffect } from "react";
import axios from 'axios';
import { Enviar } from "../Components/EnviarMenu";
import { EditaTreino } from "../Components/editarTreino";

export function CriarTreinos(){
    const [treinoid,setTreinoid] = useState([])
    const [openTreino,setOpentreino] = useState(0);
    const [openEnv,setOpenEnv] = useState(0);
    const [openEdit,setOpenEdit] = useState(0);
    const [treinos,setTreinos] = useState([]);


    //limite de carateres da descrição e 90
    useEffect(() => {      
        axios.get(`http://localhost:3000/trainings`, { withCredentials: true })
            .then(response => {
                       
                const treinos = response.data.map(treino => ({
                nome: treino.name,
                descricao: treino.description,
                partesAfeto: treino.bodyParts,
                id: treino.id

                }))
             setTreinos(treinos);
              

            })
            .catch(error => {
                console.error("erro ao buscar os treinos", error)
            });
    }, [treinos]);


    
    return(

           <div className="w-full h-full font-Outfit px-6">
            <div className="w-full h-11 flex justify-end pr-6">
                <input type="text" placeholder="Pesquisar..." className="w-1/3 min-w-64 glassBg h-full p-2 rounded-xl border-2 text-white placeholder-zinc-300  border-neutral-500 "/>

            </div>
            <div className="h-[calc(100%-44px)] w-full grid grid-cols-3 gap-y-12 place-content-start place-items-center overflow-y-auto p-18 scroll-smooth">
 
                 {
                    treinos.map((treino)=>{
                        return <TreinoCriacao
                        
                        partesAfeto={treino.partesAfeto} 
                        nome={treino.nome}
                         key={treino.id} 
                         descricao={treino.descricao}
                          id={treino.id} 
                          setTreinoid={setTreinoid}
                          setOpenEnv={setOpenEnv} 
                        setOpentreino={setOpentreino}
                        setOpenEdit={setOpenEdit}

/>
                    })
                 }

                   <EditaTreino setOpenEdit={setOpenEdit} open={openEdit} id={treinoid}/>
                  <TreinosCr setOpentreino={setOpentreino} id={treinoid} open={openTreino}/>
                  <Enviar open={openEnv} setOpenEnv={setOpenEnv} treinoid={treinoid}></Enviar>
            </div>

           </div>

    )
}