import { useEffect,useState } from 'react';
import { Treino } from './Treino';
import { Exercicio } from '../../CriarTreinos/components/Exercicio';
import axios
 from 'axios';
 import '../../../Styles/animations.css'
export function Treinos({ open, setOpentreino, id }) {

    const [openExer,setOpenExer] = useState(0);
    const [treinoid,setTreinoid] = useState([])

    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [tel, setTel] = useState('');
    const [foto, setFoto] = useState('');
    const [treinos, setTreinos] = useState([])
    
 
    useEffect(() => {      
        axios.get(`http://localhost:3000/users/${id}`, { withCredentials: true })
            .then(response => {
                       
                const aluno = response.data;
                setEmail(aluno.email);
                setNome(aluno.name);
                setTel(aluno.phone);
                setFoto('http://localhost:3000'+ aluno.photoUrl);
                setTreinos(aluno.trainings)
                
              

            })
            .catch(error => {
                console.error("erro ao buscar os alunos", error)
            });
    }, [id]);

    console.log(treinos)
 

 /*   const treinos = [{
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

    const exercicios = [{
        id:1,
        nome: 'cupino',
        reps: 12,
        series: 2,
        descricao: 'pega barra deitado e levanta com cu'
    },{
        id:2,
        nome: 'crosover',
        reps: 12,
        series: 2,
        descricao: 'com um braço em cada lado do crossover e puxa ambos ao centro com o apoio acima dos ombros'
    }]
*/

    return (
        <div className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 ${open ? '' : 'invisible'}`} onClick={() => setOpentreino(0)}>
            <div className="overflow-y-auto overflow-x-hidden glassBgStrong px-12 rounded-2xl w-2/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"

                onClick={(e) => {

                    e.stopPropagation();

                }}
            >
                <h1>{openExer ? '{nome do treino}' : 'Treinos do Aluno'}</h1>
                <div className='justify-start w-full h-fit flex m-4'>
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className="text-xl text-center">{openExer ?'Imagem do treino' : 'Imagem do Aluno'}</h1>
                        <div className="relative w-48 aspect-square rounded-full mt-4" style={{ backgroundImage: `url(${foto})`, backgroundSize: 'cover' }}>
                        </div>
                    </div>
                    <div className='text-white flex flex-col pt-12 px-8'>
                        <h1 className='text-2xl'>{openExer? '{nome do treino}' :nome}</h1>
                        <h1 className='text-xl font-Sora-light text-white/50'>{openExer ? '{partes do treino afetada}' :tel}</h1>
                        {openExer ?
                         ( <h1 className='text-base font-Sora-light'>{'{descriçao do treino}'}</h1> )
                         : (<div></div>)}
                    </div>

                </div>
                <div className='w-full h-full  grid grid-cols-3 overflow-auto gap-y-4'>

                    
                {openExer
            ? exercicios.map((exercicio) => (
                <Exercicio
                  key={exercicio.id}
                  reps={exercicio.reps}
                  nome={exercicio.nome}
                  series={exercicio.series}
                  descricao={exercicio.descricao}
                  id={exercicio.id}
                />
              ))
            : treinos.map((treino) => (
                <Treino
                alunoid={id}
                foto={"htt" + treino.training.photoUrl}
                  key={treino.trainingId}
                  partesAfeto={treino.training.bodyParts}
                  setTreinoid={setTreinoid}
                  nome={treino.training.name}
                  open={openExer}
                  descricao={treino.description}
                  setOpenExer={setOpenExer}
                  id={treino.id}
                />
              ))}





                </div>



              {

              openExer ?(
  
                <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={()=> setOpenExer(0)} className='cursor-pointer absolute top-4 right-4'>
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