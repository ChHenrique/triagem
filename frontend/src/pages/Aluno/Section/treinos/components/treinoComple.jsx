import { useEffect,useState } from 'react';
import { Exercicio } from './Exercicio';
import axios
 from 'axios';

 import api from '../../../../../../@lib/api';


export function TreinosCr({ open, setOpentreino, id }) {

    const [openTreino,setOpenTreino] = useState(0);
    const [nome, setNome] = useState('');
    const [partesAfeto, setPartesAfeto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [foto, setFoto] = useState('');
    const [exercicios, setExercicios] = useState([]);
    const[exerId,setExerid] = useState([])
    const [openexer,setOpenExer] = useState(0);
    
    

    useEffect(() => {
        api.get(`/trainings/${id}`, { withCredentials: true })
            .then(response => {

                const treino = response.data;

                setFoto(treino.photoUrl);
                setNome(treino.name);
                setDescricao(treino.description);
                setPartesAfeto(treino.bodyParts);
                setExercicios(treino.exercises);


            })
            .catch(error => {
                console.error("erro ao buscar os treinos", error)
            });
    }, [id]);
 

 
    return (
       
        <div className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 ${open ? '' : 'invisible'}`} onClick={() => setOpentreino(0)}>

            <div className="overflow-y-auto overflow-x-hidden glassBgStrong px-12 rounded-2xl w-2/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"

                onClick={(e) => {

                    e.stopPropagation();

                }}
            >
                <h1>{nome}</h1>
                <div className='justify-start w-full  h-fit flex m-4 relative'>

                    <div className='glassBg w-full flex p-4 border-3 border-zinc-300/30 rounded-2xl flex-row'>
                    <div className='flex flex-col justify-center items-center'>
                        <div className="relative w-36 aspect-square rounded-full" style={{ backgroundImage: `url(${api.defaults.baseURL+foto})`, backgroundSize: 'cover' }}>
                        </div>
                    </div>
                    <div className='text-white flex flex-col w-fit px-8'>
                        <h1 className='text-2xl'>{nome}</h1>
                        <h1 className='text-xl font-Sora-light text-white/50'>{ partesAfeto }</h1>
                       
                         <h1 className='text-base font-Sora-light'>{descricao}</h1> 
                         
                    </div>
                    
                     </div>
                </div>

                  <h1 className='text-xl py-4 pb-6 w-full '>Exercicios</h1>
                <div className='w-full h-full  grid grid-cols-3 overflow-auto gap-y-4'>

                    
                {exercicios ?
            exercicios.map((exercicio) => (
                <Exercicio
                  key={exercicio.id}
                  reps={exercicio.repetitions}
                  nome={exercicio.name}
                  fotoExercicio={api.defaults.baseURL + exercicio.imageUrl}
                  series={exercicio.execution}
                  descricao={exercicio.description}
                  id={exercicio.id}
                  setExerid={setExerid}
                  restTime={exercicio.restInterval}
                  setOpenExer={setOpenExer}
                />
              )):
              (
                <h1>Nenhum exercicio encontrado</h1>
              )
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

)
}