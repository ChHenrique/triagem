import { useState,useEffect } from "react";
import axios from "axios";

export function Enviar({open, setOpenEnv, treinoid}) {

    const [idAluno,setAlunoid] = useState([])
    const [alunos, setAlunos] = useState([])

    useEffect(() => {      
        axios.get("http://localhost:3000/users", { withCredentials: true })
            .then(response => {

                const alunos = response.data.map(user => ({
                    id: user.id,
                    nome: user.name,
                    email: user.email,
                    tel: user.phone,
                    photoUrl: "http://localhost:3000" + user.photoUrl
                }));
                   setAlunos(alunos)
            })
            .catch(error => {
                console.error("erro ao buscar os alunos", error)
            });
    }, []);

    //função que associa o treino ao aluno
    
    const associarTreino = async (userId) => {
        try {
          await axios.post(
            `http://localhost:3000/trainings/${treinoid}/associate`,
            { userId },
            { withCredentials: true }
          );

          alert("treino associado")

        } catch (error) {
          console.error("erro ao associar treino:", error)
          
          alert("treino já associado");
        }
      };
        

    


    return (
            <div className={`w-full fixed inset-0  h-full backdrop-blur-xs  flex justify-center items-center py-12 duration-500 transition-all ${open ? 'popModal' : 'dropModal invisible'}`} onClick={() => setOpenEnv(0)}>
                
                <div className="overflow-y-auto glassBgStrong  pt-20 px-12 rounded-2xl w-1/3 min-w-[500px] grid grid-cols-1 h-full border-zinc-600/25 border-4 text-offWhite-100 place-items-center place-content-start "
                
                onClick={(e) => {
         
                      e.stopPropagation();
                }}
            >
                <h1 className="absolute top-2 ">Enviar Treinos</h1>

                    {  alunos.map((aluno)=>(
                    <div className='justify-start items-center rounded-2xl flex my-2 py-2 w-full h-20 bg-bg-300'>
                      
                        <div className="relative w-32  aspect-square rounded-full mx-3" style={{ backgroundImage: `url(${aluno.photoUrl})`, backgroundSize: 'cover' }}>
                        </div>
                        <div className="font-Outfit w-full text-offWhite-100 flex flex-col items-start justify-center">
                            <h1 className="text-2xl">{aluno.nome}</h1>
                            <h1 className="text-base font-Sora-light">{aluno.email}</h1>
                        </div>
                        <button onClick={() => associarTreino(aluno.id)}  type='submit' className={`w-2/3 mr-4 h-12 text-xl font-bold text-white font-Outfit rounded-[16px] ${open ? 'animate': ''}`}>
                         Enviar
                        </button>
                           
 
                    </div>
                    ))}
                   
    

    
                    <svg onClick={() => setOpenEnv(0)} className='cursor-pointer absolute top-4 right-4' width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M36 12L12 36M12 12L36 36" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    </div>
                
            </div>
        );
}