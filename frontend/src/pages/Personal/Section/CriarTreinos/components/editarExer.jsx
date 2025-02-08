import { useState, useEffect } from 'react';

import axios from 'axios';

export function EditaExer({ open, setOpenExer, id }) {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [foto, setFoto] = useState('');
    const [executions, setExecutions] = useState('');
    const [reps, setReps] = useState('');
    const [rest, setRest] = useState('');



    const [nomebtn, setNomebtn] = useState('Salvar Alterações');



    useEffect(() => {
        axios.get(`http://localhost:3000/exercises/${id}`, { withCredentials: true })
            .then(response => {

                const exercise = response.data;

                setFoto(exercise.imageUrl);
                setNome(exercise.name);
                setDescricao(exercise.description);
                setExecutions(exercise.executions);
                setReps(exercise.repetitions);
                setRest(exercise.restInterval);
                setExerID(exercise.id);


            })
            .catch(error => {
                console.error("erro ao buscar os treinos", error)
            });
    }, [id]);


    let Initnome = nome;
    let Initdescricao = descricao;
    let Initexecutions = executions;
    let Initreps = reps;
    let Initrest = rest;




    function Pegaimg(e) {
        let fotoup = e.target.files[0];
        if (fotoup) {
            let imgurl = URL.createObjectURL(fotoup);
            setFoto(imgurl);
        }
    }

    const SubmeterForm = (e) => {
        e.preventDefault();

    };

    function PutInfo() {
        axios.put(`http://localhost:3000/trainings/${id}`, { name: nome, bodyParts: partesAfeto, description: descricao, imageUrl: foto }, { withCredentials: true })

        setTimeout(() => {
            setOpenEdit(0);

            setNomebtn('Salvar Alterações')
        }, 1000);

        Initnome = nome;
        Initdescricao = descricao;
        InitpartesAfeto = partesAfeto;

        setNomebtn('Salvando...')

    }

    return (

        <form className="overflow-y-auto glassBgStrong px-12 rounded-2xl w-1/2 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"
            onSubmit={SubmeterForm} // Adiciona o evento onSubmit
            onClick={(e) => {

                e.stopPropagation();
            }}
        >
            <h1>Edição Perfil</h1>
            <div className='flex w-full m-4'>
                <div>
                    <h1 className="text-xl text-center">Imagem do Treino </h1>
                    <div className="relative w-48 aspect-square rounded-full mt-4" style={{ backgroundImage: `url(${foto})`, backgroundSize: 'cover' }}>
                        <label htmlFor="fotos" className="absolute  top-0 left-0 w-full h-full rounded-full cursor-pointer">
                            <input type="file" id="fotos" name='fotos' className="hidden" onChange={Pegaimg} />
                        </label>
                    </div>
                </div>
                <div className='text-white flex w-full flex-col pt-12 pl-8'>
                    <div className='w-full h-fit flex justify-center items-start flex-col'>
                        <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Nome">Nome
                            <input placeholder={Initnome} onChange={(e) => setNome(e.target.value)} type="text" name='Nome' className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                        </label>

                        <div className='text-white flex w-full flex-row justify-between pt-2 '>
                        <div className='text-white flex w-[30%] flex-col '>
                                <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Nome">Repetições
                                    <input placeholder={Initreps} onChange={(e) => setNome(e.target.value)} type="text" name='Nome' className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                                </label>
                            </div>
                            <div className='text-white flex w-[30%] flex-col '>
                                <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Nome">Series
                                    <input placeholder={Initexecutions} onChange={(e) => setNome(e.target.value)} type="text" name='Nome' className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                                </label>
                            </div>
                            <div className='text-white flex w-[30%] flex-col '>
                                <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Nome">Intervalo(segundos)
                                    <input placeholder={Initrest} onChange={(e) => setNome(e.target.value)} type="text" name='Nome' className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                                </label>
                            </div>

                        </div>


                    </div>

                </div>
            </div>
            <label className='w-full break-words text-start over text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Telefone">Descrição
                <textarea

                    placeholder={Initdescricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className='my-2 pl-2 w-full bg-input-100 h-32 rounded-[8px] resize-none'
                    style={{ textAlign: 'left', verticalAlign: 'top' }}
                />
            </label>

            <button onClick={PutInfo} type='submit' className={`w-full mb-12 mt-auto h-12 text-xl font-bold text-white font-Outfit rounded-[16px] ${open ? 'animate' : ''}`}>
                {nomebtn}
            </button>

            <svg onClick={() => setOpenExer(0)} className='cursor-pointer absolute top-4 right-4' width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36 12L12 36M12 12L36 36" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </form>

    );
}