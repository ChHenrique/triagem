import { Aluno } from "../Components/Aluno"
import { useState } from "react"
import { EditarPerf } from "../Components/editar"
import { Treinos } from "../Components/treinoComple"
import axios from "axios"

export function Alunos(Alunos){

    const [openPer,setOpenper] = useState(0)
    const [openTreino,setOpentreino] = useState(0)
    const [idAluno,setAlunoid] = useState([])


    const alunos = [{
        id: 1,
        nome: 'Pedro',
        email: 'pldoido@gmail,com',
        tel: '(88) 913420692'
    },{
        id: 2,
        nome: 'Pedro sapeca',
        email: 'plfreefrie@gmail,com',
        tel: '(88) 913420692'
    }]

    return(

           <div className="w-full h-full font-Outfit px-6">
            <div className="w-full h-11 flex justify-end pr-6">
                <input type="text" placeholder="Pesquisar..." className="w-1/3 min-w-64 glassBg h-full p-2 rounded-xl border-2 text-white placeholder-zinc-300  border-neutral-500 "/>

            </div>
            <div className="h-[calc(100%-44px)] w-full grid grid-cols-3 gap-y-12 place-content-start place-items-center overflow-y-auto p-18 scroll-smooth">
 
                 {
                    alunos.map((aluno)=>{
                        return <Aluno 
                        email={aluno.email} 
                        nome={aluno.nome}
                         key={aluno.id} 
                         tel={aluno.tel}
                          id={aluno.id} 
                          setOpenper={setOpenper} 
                          setOpentreino={setOpentreino}
                           setAlunoid={setAlunoid}/>
                    })
                 }
 

              
               <EditarPerf  open={openPer} setOpenper={setOpenper} id={idAluno}></EditarPerf>
               <Treinos setOpentreino={setOpentreino} open={openTreino} id={idAluno}/>
  



            </div>

           </div>

    )
}