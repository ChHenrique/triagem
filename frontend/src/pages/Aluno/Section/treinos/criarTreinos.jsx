import { TreinoCriacao } from "./components/TreinoCriação"
import { TreinosCr } from "./components/treinoCompleCriacao"
import { useState,useEffect } from "react";
import axios from 'axios';
import { Enviar } from "./components/EnviarMenu";

//import { CriarTreino } from "../Components/CriarTreino";

export function CriarTreinos(){
    const [treinoid,setTreinoid] = useState([])
    const [openTreino,setOpentreino] = useState(0);
    const [openEnv,setOpenEnv] = useState(0);
    const [openEdit,setOpenEdit] = useState(0);
    const [treinos,setTreinos] = useState([]);
    const [openCria,setOpenCria] = useState(0);


    //limite de carateres da descrição e 90
    useEffect(() => {      
        axios.get(`http://localhost:3000/trainings`, { withCredentials: true })
            .then(response => {
                       
                const treinos = response.data.map(treino => ({
                nome: treino.name,
                descricao: treino.description,
                partesAfeto: treino.bodyParts,
                id: treino.id,
                photoUrl: treino.photoUrl

                }))
             setTreinos(treinos);
              

            })
            .catch(error => {
                console.error("erro ao buscar os treinos", error)
            });
    }, [treinos]);


    
    return(

           <div className="w-full h-full font-Outfit px-6">
            
            <div className="w-full h-11 mt-4 flex-col flex justify-center items-end pr-6">
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
                          foto={'http://localhost:3000' + treino.photoUrl}
                          setTreinoid={setTreinoid}
                          setOpenEnv={setOpenEnv} 
                        setOpentreino={setOpentreino}
                        setOpenEdit={setOpenEdit}

/>
                    })
                 }

                  
                  <TreinosCr setOpentreino={setOpentreino} id={treinoid} open={openTreino}/>
                  <Enviar open={openEnv} setOpenEnv={setOpenEnv} treinoid={treinoid}></Enviar>
                 {/*} <CriarTreino open={openCria} setOpenCria={setOpenCria} id={treinoid}></CriarTreino>*/}
            </div>

           </div>

    )
}