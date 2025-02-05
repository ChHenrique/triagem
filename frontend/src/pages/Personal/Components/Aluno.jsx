import Default from '../../../assets/defaultUser.png'
import './animations.css'
import { useState } from 'react'
import { Alunos } from '../Section/alunos'
import axios from 'axios'

export function Aluno({nome,foto,email,tel , setOpenper, setOpentreino, setAlunoid, id, setAlunos, alunos}) {

    

    const [exclude, setExclude] = useState(0)

    function deleteUser() {
        axios.delete(`http://localhost:3000/users/${id}`, { withCredentials: true })
            .then(() => {
                // Atualiza a lista removendo o usuário excluído
                setAlunos(Alunos.filter(aluno => aluno.id !== id));
            })
            .catch(error => {
                console.error("Erro ao excluir usuário:", error);
            });
    }

    return (
        <div className="w-72 aspect-[10/12] glassBg border-2 border-zinc-500 flex-col font-Outfit justify-center flex items-center p-4 rounded-[16px]">
            <div className="h-1/3 aspect-square rounded-full" style={{ backgroundImage: `url(${foto})` ,backgroundSize: 'cover'}}></div>
            <div className='h-1/3 w-full flex flex-col  justify-center text-offWhite-100 items-center'>
                <h2 className="text-2xl ">{nome}</h2>
                <h2 className=" text-base font-light">{tel}</h2>
                <h2 className="text-base">{email}</h2>
            </div>
            <div className={`grid grid-cols-1  w-full h-2/3  p-2 place-content-center place-items-center gap-4 ${exclude ? 'hidden' : ''} `}>
                <button className='w-full h-12 bg-offWhite-100 text-bg-100 rounded-sm font-semibold text-lg cursor-pointer hover:bg-amber-100 duration-300 ease-in-out' onClick={()=>{setOpenper(1)
                    setAlunoid(id)  

                } }>Editar Perfil</button>
                <button className='w-full h-12 bg-offWhite-100 text-bg-100 rounded-sm font-semibold text-lg cursor-pointer hover:bg-amber-100 duration-300 ease-in-out' onClick={()=>{setOpentreino(1)
                    setAlunoid(id)
                }}>Ver Treinos</button>
                <button className='w-full h-12 redbg text-offWhite-100 rounded-sm font-semibold text-lg cursor-pointer  duration-300 ease-in-out ' onClick={()=>{setExclude(1)}}>Excluir</button>


            </div>
            <div className={`justify-center flex  h-2/3 w-full flex-col ${exclude ? '' : 'hidden'}  `}>
                <h2 className="text-xl font-bold text-offWhite-100 text-center">Realmente deseja excluir essa conta?</h2>
                <div className='h-12 w-full flex items-center justify-center gap-12 mt-4'>
                    <button onClick={deleteUser} className=' h-12 redbg aspect-video  rounded-sm font-semibold text-lg cursor-pointer  duration-300 ease-in-out flex justify-center items-center'>
                        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M40 12L18 34L8 24" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    <button onClick={()=>{setExclude(0)}} className=' h-12 bg-offWhite-100 aspect-video rounded-sm font-semibold text-lg cursor-pointer  hover:bg-amber-100 duration-300 ease-in-out flex justify-center items-center'>
                        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M36 12L12 36M12 12L36 36" stroke="#131313" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

        </div>

    )
}