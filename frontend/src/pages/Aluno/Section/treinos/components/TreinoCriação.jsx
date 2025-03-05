import { useState,useEffect } from 'react'


export function Treino({nome, descricao, partesAfeto, open, foto,setOpentreino, id, setTreinoid, setOpenEnv,  setOpenEdit }) {




    const [exclude, setExclude] = useState(0)

    return (
        <div className="w-76 aspect-[10/11] glassBg border-3 border-zinc-500/20 flex-col font-Sora-light justify-center flex items-center p-4 rounded-[16px]">
            <div className="h-1/2 aspect-square rounded-2xl" style={{ backgroundImage: `url(${foto})`, backgroundSize: 'cover' }}></div>
            <div className='h-3/4 w-full  flex flex-col  justify-start pt-4 text-offWhite-100 items-center'>
                <h2 className="text-xl font-Sora-reg font-medium ">{nome}</h2>
                <h2 className=" text-base text-white/50 text-center font-Sora-light mb-2">{partesAfeto}</h2>
                <h2 className="text-base w-full text-center font-Sora-light break-words">{descricao}</h2>
            </div>
            <div className={`grid grid-cols-1 font-Outfit w-full h-1/4  p-2 place-content-center place-items-center gap-4 ${exclude ? 'hidden' : ''} `}>

            <button className={`w-full h-10 bg-offWhite-100 text-bg-100 rounded-sm font-semibold text-lg cursor-pointer hover:bg-amber-100 ${open ? 'duration-300' : ''} ease-in-out`} 
                onClick={() => {
                    setOpentreino(1)
                    setTreinoid(id)
                }}
                >Ver Treino Completo</button>




            </div>
 

        </div>

    )
}