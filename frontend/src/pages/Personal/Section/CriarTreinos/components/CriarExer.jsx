import { useState, useRef } from 'react';
import Default from '../../../../../assets/defaultUser.png';
import axios from 'axios';

export function CriarExer({ open, setOpenCria, id, setExercicios }) {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [rep, setRep] = useState(0);
    const [serie, setSerie] = useState(0);
    const [rest, setRest] = useState(0);



    const [foto, setFoto] = useState(null);
    const [frontFoto, setFrontFoto] = useState(Default);
    const [error, setError] = useState(0);
    const fileInputRef = useRef(null);



    const abrirInput = () => {
        fileInputRef.current?.click();
    };

    function Pegaimg(e) {
        let fotoup = e.target.files[0];
        if (fotoup) {
            let imgurl = URL.createObjectURL(fotoup);
            setFrontFoto(imgurl);
            setFoto(fotoup);
            console.log(imgurl)
        }
    }

    const SubmeterForm = async (e) => {
        e.preventDefault();

        // Garante que os valores são números inteiros válidos
        const repNumber = parseInt(rep, 10);
        const serieNumber = parseInt(serie, 10);
        const restNumber = parseInt(rest, 10);

        // Verifica se todos os campos estão preenchidos corretamente
        if (
            nome.trim().length > 0 &&
            descricao.trim().length > 0 &&
            foto !== null &&
            !isNaN(repNumber) && repNumber > 0 &&
            !isNaN(serieNumber) && serieNumber > 0 &&
            !isNaN(restNumber) && restNumber > 0
        ) {
            await createExer(repNumber, serieNumber, restNumber);
        } else {
            setError(1);
            setTimeout(() => {
                setError(0);
            }, 4000);
        }
    };

    async function createExer(repNumber, serieNumber, restNumber) {
        try {
            const exerData = {
                trainingId: id,
                name: nome,
                description: descricao,
                repetitions: repNumber,
                executions: serieNumber,
                restInterval: restNumber,
            };
    
            const response = await axios.post('http://localhost:3000/exercises', exerData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
    
            console.log('✅ Exercício criado:', response.data);
            const exerId = response.data.id;
    
            // Primeiro, adicionamos o exercício sem a imagem
            setExercicios((prevExer) => [...prevExer, { ...exerData, id: exerId, imageUrl: null }]);
    
            // Se houver foto, faz o upload e depois atualiza a URL no estado
            if (foto) {
                const imageUrl = await uploadPhoto(exerId);
    
                if (imageUrl) {
                    setExercicios((prevExer) =>
                        prevExer.map(ex =>
                            ex.id === exerId ? { ...ex, imageUrl } : ex
                        )
                    );
                }
            }
    
            setOpenCria(0);
        } catch (error) {
            console.error("Erro ao criar exercício:", error);
        }
    }
    

    async function uploadPhoto(exerId) {
        try {
            const formData = new FormData();
            formData.append('file', foto);
    
            const response = await axios.put(`http://localhost:3000/exercises/${exerId}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            console.log('📤 Foto enviada com sucesso!', response.data);
            
            return response.data.imageUrl; // Certifique-se que o backend retorna a URL correta
        } catch (error) {
            console.error("Erro ao enviar foto:", error);
            return null;
        }
    }
    


    return (
        <div className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 duration-500 ${open ? 'popModal' : 'dropModal invisible'}`} onClick={() => setOpenCria(0)}>
            <h1 className={`flex flex-row items-center right-10 absolute bottom-20 duration-300 glassBgError border-2 font-Sora-light border-white/30 text-xl text-offWhite-100 p-3 rounded-2xl bg-white ${error ? 'ApRight' : 'hidden'}`}>
                Preencha todos os campos!
            </h1>

            <form className="overflow-y-auto glassBgStrong px-12 rounded-2xl w-2/3 overflow-x-hidden min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"
                onSubmit={SubmeterForm} // Adiciona o evento onSubmit
                onClick={(e) => {

                    e.stopPropagation();
                }}
            >
                <h1>Edição Perfil</h1>
                <div className='flex w-full m-4'>
                    <div>
                        <h1 className="text-xl text-center">Imagem do Treino </h1>
                        <div onClick={abrirInput} className="relative  bg-offWhite-100 w-48 h-48 rounded-full mt-4 bg-cover bg-center" style={{ backgroundImage: `url(${frontFoto})` }}>
                            <input ref={fileInputRef} type="file" id="fotos" name='fotos' className="hidden" onChange={Pegaimg} />
                        </div>
                    </div>
                    <div className='text-white flex w-full flex-col pt-12 pl-8'>
                        <div className='w-full h-fit flex justify-center items-start flex-col'>
                            <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Nome">Nome
                                <input placeholder="Ex: Supino Reto" onChange={(e) => setNome(e.target.value)} type="text" name='Nome' className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                            </label>

                            <div className='text-white flex w-full flex-row justify-between pt-2 '>
                                <div className='text-white flex w-[30%] flex-col '>
                                    <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Nome">Repetições
                                        <input
                                            placeholder="Ex: 12"
                                            onChange={(e) => setRep(parseInt(e.target.value, 10) || 0)}
                                            type="number" // Alterado para "number" para evitar inputs inválidos
                                            name='Nome'
                                            className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]'
                                        />

                                    </label>
                                </div>
                                <div className='text-white flex w-[30%] flex-col '>
                                    <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Nome">Series
                                        <input
                                            placeholder="Ex: 3"
                                            onChange={(e) => setSerie(parseInt(e.target.value, 10) || 0)}
                                            type="number"
                                            name='Nome'
                                            className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]'
                                        />
                                    </label>
                                </div>
                                <div className='text-white flex w-[30%] flex-col '>
                                    <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Nome">Intervalo(segundos)
                                        <input
                                            placeholder="Ex: 90"
                                            onChange={(e) => setRest(parseInt(e.target.value, 10) || 0)}
                                            type="number"
                                            name='Nome'
                                            className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]'
                                        />
                                    </label>
                                </div>

                            </div>


                        </div>

                    </div>
                </div>
                <label className='w-full break-words text-start over text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Telefone">Descrição
                    <textarea

                        placeholder="Ex: Aumenta o peitoral e o tríceps"
                        onChange={(e) => setDescricao(e.target.value)}
                        className='my-2 pl-2 w-full bg-input-100 h-32 rounded-[8px] resize-none'
                        style={{ textAlign: 'left', verticalAlign: 'top' }}
                    />
                </label>

                <button type='submit' className={`w-full mb-12 mt-auto h-12 text-xl font-bold text-white font-Outfit rounded-[16px] ${open ? 'animate' : ''}`}>
                    Criar Exercicio
                </button>

                <svg onClick={() => setOpenCria(0)} className='cursor-pointer absolute top-4 right-4' width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 12L12 36M12 12L36 36" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </form>
        </div>
    );
}
