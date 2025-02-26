import { useEffect, useState } from 'react';
import { Treino } from './Treino';
import { Exercicio } from './Exercicio';
import axios
    from 'axios';
import '../../../Styles/animations.css'
export function Treinos({ open, setOpentreino, id }) {

    const [openExer, setOpenExer] = useState(0);
    const [treinoid, setTreinoid] = useState([])
    const [exercicios, setExercicios] = useState([]);
    const [treinoSelecionado, setTreinoSelecionado] = useState(null);



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
                setFoto('http://localhost:3000' + aluno.photoUrl);
                setTreinos(aluno.trainings)



            })
            .catch(error => {
                console.error("erro ao buscar os alunos", error)
            });
    }, [id]);
    







    return (
        <div className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 ${open ? '' : 'invisible'}`} onClick={() => setOpentreino(0)}>
            <div className="overflow-y-auto overflow-x-hidden glassBgStrong px-12 rounded-2xl w-2/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"

                onClick={(e) => {

                    e.stopPropagation();

                }}
            >
                <h1>{openExer ? treinoSelecionado?.name : 'Treinos do Aluno'}</h1>
                <div className='justify-start w-full h-fit flex m-4'>
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className="text-xl text-center">{openExer ? 'Imagem do treino' : 'Imagem do Aluno'}</h1>
                        <div className="relative bg-offWhite-100 w-44 aspect-square rounded-2xl mt-4"
                            style={{ backgroundImage: `url(${openExer ? "http://localhost:3000" + treinoSelecionado?.photoUrl : foto})`, backgroundSize: 'cover' }}>
                        </div>
                    </div>
                    <div className='text-white flex flex-col pt-12 px-8'>
                        <h1 className='text-2xl'>{openExer ? treinoSelecionado?.name : nome}</h1>
                        <h1 className='text-xl font-Sora-light text-white/50'>{openExer ? treinoSelecionado?.bodyParts : tel}</h1>
                        {openExer ? <h1 className='text-base font-Sora-light'>{treinoSelecionado?.description}</h1> : null}
                    </div>
                </div>

                <div className='w-full h-full mt-12 grid grid-cols-3  overflow-auto gap-y-4'>


                    {openExer
                        ? exercicios.map((exercicio) => (
                            <Exercicio
                                key={exercicio.id}
                                reps={exercicio.repetitions}
                                nome={exercicio.name}
                                series={exercicio.executions}
                                descricao={exercicio.description}
                                id={exercicio.id}
                                exercicioFoto={exercicio.imageUrl}
                            />
                        ))
                        : treinos.map((treino) => (
                            <Treino
                            treinos={treinos}
                            setTreinos={setTreinos}
                                alunoid={id}
                                foto={"http://localhost:3000" + treino.training.photoUrl}
                                key={treino.trainingId}
                                partesAfeto={treino.training.bodyParts}
                                setTreinoid={setTreinoid}
                                nome={treino.training.name}
                                open={openExer}
                                descricao={treino.training.description}
                                setOpenExer={() => {
                                    setOpenExer(true);
                                    setTreinoSelecionado(treino.training);
                                    setExercicios(treino.training.exercises);
                                }}
                                id={treino.training.id}
                            />

                        ))}






                </div>



                {

                    openExer ? (

                        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setOpenExer(0)} className='cursor-pointer absolute top-4 right-4'>
                            <path d="M38 24H10M10 24L24 38M10 24L24 10" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    ) :
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