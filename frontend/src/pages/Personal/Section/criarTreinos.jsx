import { TreinoCriacao } from "../Components/TreinoCriação"

export function CriarTreinos(){


    const treinos = [{
        id:1,
        nome: 'Treino de Peito',
        partesAfeto: 'Parte esternal e superior',
        descricao: 'Treino util e cruel'
    },{
        id:2,
        nome: 'Treino de Peito',
        partesAfeto: 'Parte esternal e superior',
        descricao: 'Treino util e cruel'
    },{
        id:3,
        nome: 'Treino de Peito',
        partesAfeto: 'Parte esternal e superior',
        descricao: 'Treino util e cruel'
    }]

    
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
                          //setOpenEnv={setOpenEnv} 
                        //  setOpentreino={setOpentreino}
/>
                    })
                 }


            </div>

           </div>

    )
}