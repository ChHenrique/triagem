import { useState, useRef } from 'react';
import Default from '../../../../../assets/defaultUser.png';
import InputMask from 'react-input-mask';
import axios from 'axios';

export function CriarTreino({ open, setOpenCria, id }) {
    const [bodyParts, setbodyParts] = useState('');
    const [nomeTreino, setnomeTreino] = useState('');
    const [descriptionTreino, setdescriptionTreino] = useState('');
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
        }
    }

    const SubmeterForm = async (e) => {
        e.preventDefault();
        if (bodyParts.length > 0 && nomeTreino.length > 0 && descriptionTreino.length > 0  && foto !== null) {
            await createTraining();
        } else {
            setError(1);
            setTimeout(() => {
                setError(0);
            }, 4000);
        }
    };

    async function createTraining() {
        try {
            if (!nomeTreino || !bodyParts || !descriptionTreino) return;
    
            // Enviar os dados do treino como JSON
            const trainingData = {
                name: nomeTreino,
                bodyParts: bodyParts,
                description: descriptionTreino,
                
            };
    
            const response = await axios.post('http://localhost:3000/trainings', trainingData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
    
            console.log('treino criado:', response.data);
            const trainigId = response.data.id;
    
            // Se houver foto, faz o upload imediatamente
            if (foto) {
                await uploadPhoto(trainigId);
            }
    
            setOpenCria(0);
        } catch (error) {
            console.error("Erro ao criar treino:", error);
        }
    }
    
    async function uploadPhoto(trainigId) {
        try {
            const formData = new FormData();
            formData.append('file', foto); 
    
            await axios.put(`http://localhost:3000/trainings/${trainigId}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            console.log('📤 Foto enviada com sucesso!');
        } catch (error) {
            console.error("Erro ao enviar foto:", error);
        }
    }
    

    return (
        <div className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 ${open ? '' : 'invisible'}`} onClick={() => setOpenCria(0)}>
            <h1 className={`flex flex-row items-center right-10 absolute bottom-20 duration-300 glassBgError border-2 font-Sora-light border-white/30 text-xl text-offWhite-100 p-3 rounded-2xl bg-white ${error ? 'ApRight' : 'hidden'}`}>
                Preencha todos os campos!
            </h1>

            <form className="glassBgStrong overflow-x-hidden overflow-y-auto px-12 rounded-2xl w-1/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"
                onSubmit={SubmeterForm}
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className='mb-4'>Criar Treino</h1>

                <div className='justify-center flex flex-col m-4'>
                    <h1 className="text-xl text-center">Imagem do Treino</h1>
                    <div onClick={abrirInput} className="relative w-48 h-48 rounded-full mt-4 bg-cover bg-center" style={{ backgroundImage: `url(${frontFoto})` }}>
                        <input ref={fileInputRef} type="file" id="fotos" name='fotos' className="hidden" onChange={Pegaimg} />
                    </div>
                </div>

                <div className='w-full flex flex-col'>
    <label className='text-base ml-1 mt-2' htmlFor="nomeTreino">Nome do Treino
        <input 
            placeholder="EX: Treino de Peito" 
            onChange={(e) => setnomeTreino(e.target.value)} 
            type="text" 
            id="nomeTreino" 
            name='nomeTreino' 
            className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' 
        />
    </label>

    <label className='text-base ml-1 mt-2' htmlFor="bodyParts">Partes afetadas
        <input 
            placeholder="EX: Peitoral Maior, Peitoral Menor" 
            onChange={(e) => setbodyParts(e.target.value)} 
            type="text" 
            id="bodyParts" 
            name='bodyParts' 
            className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' 
        />
    </label>

    <label className='text-base ml-1 mt-2' htmlFor="description">Descrição do Treino
        <textarea 
            placeholder="EX: Este treino foca no aumento de força..." 
            onChange={(e) => setdescriptionTreino(e.target.value)} 
            id="description" 
            name='description' 
            className='my-2 pl-2 w-full bg-input-100 h-16 rounded-[8px]' 
        />
    </label>
</div>

<button 
    type="submit" 
    className={`w-full mt-12 h-12 text-xl font-bold text-white font-Outfit rounded-[16px] ${open ? 'animate' : ''}`}
>
    Salvar Alterações
</button>


                <svg onClick={() => setOpenCria(0)} className='cursor-pointer absolute top-4 right-4' width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 12L12 36M12 12L36 36" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </form>
        </div>
    );
}
