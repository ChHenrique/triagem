import { useEffect,useState } from 'react';
import Default from '../../../assets/defaultUser.png';
import { Treino } from './Treino';
import { Exercicio } from './Exercicio';
import axios
 from 'axios';

export function TreinosCr({ open, setOpentreino, id }) {

    const [openTreino,setOpenTreino] = useState(0);
    const [treinoid,setTreinoid] = useState([])

    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [tel, setTel] = useState('');
    const [foto, setFoto] = useState('');
    const [exercicios, setExercicios] = useState([]);
    

    useEffect(() => {      
        axios.get(`http://localhost:3000/users/${id}`, { withCredentials: true })
            .then(response => {
                       
                const aluno = response.data;
                setEmail(aluno.email);
                setNome(aluno.name);
                setTel(aluno.phone);
                setFoto(aluno.photoUrl);
              

            })
            .catch(error => {
                console.error("erro ao buscar os alunos", error)
            });
    }, [id]);
 

 
    return (
        <div className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 ${open ? '' : 'invisible'}`} onClick={() => setOpentreino(0)}>
            <div className="glassBgStrong px-12 rounded-2xl w-2/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"

                onClick={(e) => {

                    e.stopPropagation();

                }}
            >
                <h1>{' nome do treino '}</h1>
                <div className='justify-start w-full h-fit flex m-4'>
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className="text-xl text-center">{'Imagem do treino'}</h1>
                        <div className="relative w-48 aspect-square rounded-full mt-4" style={{ backgroundImage: `url(${Default})`, backgroundSize: 'cover' }}>
                        </div>
                    </div>
                    <div className='text-white flex flex-col pt-12 px-8'>
                        <h1 className='text-2xl'>{'{nome do treino}'}</h1>
                        <h1 className='text-xl font-Sora-light text-white/50'>{ '{partes do treino afetada}' }</h1>
                       
                         <h1 className='text-base font-Sora-light'>{'{descriçao do treino}'}</h1> 
                         
                    </div>

                </div>
                <div className='w-full h-full  grid grid-cols-3 overflow-auto gap-y-4'>

                    
                {
            exercicios.map((exercicio) => (
                <Exercicio
                  key={exercicio.id}
                  reps={exercicio.reps}
                  nome={exercicio.nome}
                  series={exercicio.series}
                  descricao={exercicio.descricao}
                  id={exercicio.id}
                />
              ))
  
             }





                </div>



              {

              openTreino ?(
  
                <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={()=> setOpenTreino(0)} className='cursor-pointer absolute top-4 right-4'>
<path d="M38 24H10M10 24L24 38M10 24L24 10" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
):
                (
                    <svg onClick={() => setOpentreino(0)} className='cursor-pointer absolute top-4 right-4' width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M36 12L12 36M12 12L36 36" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    
                )
            }

            </div>
        </div>
    );
}