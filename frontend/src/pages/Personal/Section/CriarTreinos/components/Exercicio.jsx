import Default from '../../../../../assets/defaultUser.png';
import { useState } from 'react'
import axios from 'axios'


export function Exercicio({ nome, descricao, reps, series, id, restTime, setOpenExer, setExerid, exercicioFoto, setExercicios }) {

    const excluirExercicio = async (id) => {
        console.log("tEWDSTASD")
        try {

            const response = await axios.delete(`http://localhost:3000/exercises/${id}`, {
                withCredentials: true,
            });

            setExercicios((prevExercicios) => prevExercicios.filter((exercicio) => exercicio.id !== id))

            setExclude(0)


        } catch (error) {
            console.error('Erro ao excluir exercicio', error)
        }
    };

    const [exclude, setExclude] = useState(0)

    return (
        <div className="w-80 aspect-[10/11] glassBg border-3 border-zinc-500/20 flex-col font-Outfit justify-center flex items-center p-4 rounded-[16px]">
            <div className="h-1/3 aspect-square rounded-2xl" style={{ backgroundImage: `url(${exercicioFoto || Default})`, backgroundSize: 'cover' }}></div>
            <div className='h-2/3 w-full flex flex-col  justify-start text-offWhite-100 items-center'>
                <h2 className="text-xl mt-4 text-center">{nome}</h2>
                <h2 className=" text-lg text-offWhite-100/50 text-center ">{reps}x{series} series</h2>
                <h2 className=" text-base text-center">{restTime} segundos de descanso</h2>
                <h2 className="text-base text-center">{descricao}</h2>
            </div>
            <div className={`grid grid-cols-1  w-full h-1/3  p-2 place-content-center place-items-center gap-4 ${exclude ? 'hidden' : ''} `}>

                <button className='w-full h-10 bg-offWhite-100 text-bg-100 rounded-sm font-semibold text-lg cursor-pointer hover:bg-amber-100 duration-300 ease-in-out' onClick={() => {
                    setOpenExer(1)
                    setExerid(id)

                }}>Editar Treino</button>

                <button className='w-full h-12 redbg text-offWhite-100 rounded-sm font-semibold text-lg cursor-pointer  duration-300 ease-in-out '
                    onClick={() => { setExclude(1) }}
                >Excluir
                </button>


            </div>
            <div className={`justify-center flex  h-2/3 w-full flex-col ${exclude ? '' : 'hidden'}  `}>
                <h2 className="text-xl font-bold text-offWhite-100 text-center">Realmente deseja excluir esse treino?</h2>
                <div className='h-12 w-full flex items-center justify-center gap-12 mt-4'>
                    <button onClick={() => excluirExercicio(id)} className=' h-12 redbg aspect-video  rounded-sm font-semibold text-lg cursor-pointer  duration-300 ease-in-out flex justify-center items-center'>
                        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M40 12L18 34L8 24" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <button onClick={() => { setExclude(0) }} className=' h-12 bg-offWhite-100 aspect-video rounded-sm font-semibold text-lg cursor-pointer  hover:bg-amber-100 duration-300 ease-in-out flex justify-center items-center'>
                        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M36 12L12 36M12 12L36 36" stroke="#131313" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

        </div>

    )
}