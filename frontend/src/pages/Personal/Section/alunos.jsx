import { Aluno } from "../Components/Aluno"
import { useState } from "react"
import { EditarPerf } from "../Components/editar"

export function Alunos(Alunos){

    const [openPer,setOpenper] = useState(0)


    return(

           <div className="w-full h-full font-Outfit px-6">
            <div className="w-full h-11 flex justify-end pr-6">
                <input type="text" placeholder="Pesquisar..." className="w-1/3 min-w-64 glassBg h-full p-2 rounded-xl border-2 text-white placeholder-zinc-300  border-neutral-500 "/>

            </div>
            <div className="h-[calc(100%-44px)] w-full grid grid-cols-3 gap-y-12 place-content-start place-items-center overflow-y-auto p-18 scroll-smooth">
 
               <Aluno setOpenper={setOpenper} ></Aluno>
               <EditarPerf  open={openPer} setOpenper={setOpenper}></EditarPerf>

  



            </div>

           </div>

    )
}