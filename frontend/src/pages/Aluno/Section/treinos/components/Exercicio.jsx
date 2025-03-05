import Default from '../../../../../assets/defaultUser.png'
import { useState } from 'react'


export function Exercicio({nome,descricao,reps,series, id, restTime,setOpenExer,setExerid, fotoExercicio}) {

    

    const [exclude, setExclude] = useState(0)

    return (
        <div className="w-80 aspect-[10/11] glassBg border-3 border-zinc-300/30 flex-col font-Sora-light justify-center flex items-center p-4 rounded-[16px]">
            <div className="h-1/3 aspect-square rounded-2xl" style={{ backgroundImage: `url(${fotoExercicio || Default})` ,backgroundSize: 'cover'}}></div>
            <div className='h-2/3 w-full flex flex-col  justify-start text-offWhite-100 items-center'>
                <h2 className="text-xl mt-4">{nome}</h2>
                <h2 className=" text-lg  text-offWhite-100/50">{reps} repetições X {series} series</h2>
                <h2 className=" text-lg pb-2">{restTime} seconds</h2>
                <h2 className="text-base text-center">{descricao}</h2>
            </div>

            

        </div>

    )
}