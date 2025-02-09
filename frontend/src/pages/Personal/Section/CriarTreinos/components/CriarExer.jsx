import { useState, useRef } from 'react';
import Default from '../../../assets/defaultUser.png';
import InputMask from 'react-input-mask';
import axios from 'axios';

export function CriarExer({ open, setOpenCria, id }) {
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const [tel, setTel] = useState('');
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
            setFrontFoto(imgurl); // Atualiza a pré-visualização
            setFoto(fotoup); // Armazena o arquivo real para upload
        }
    }

    const SubmeterForm = async (e) => {
        e.preventDefault();
        if (email.length > 8 && email.includes('@') && nome.length > 2 && tel.length > 14 && foto !== null) {
            await createUser();
        } else {
            setError(1);
            setTimeout(() => {
                setError(0);
            }, 4000);
        }
    };

    async function createUser() {
        try {
            if (!nome || !email || !senha) return;
    
            // Enviar os dados do usuário como JSON
            const userData = {
                name: nome,
                email: email,
                phone: tel || '',
                password: senha
            };
    
            const response = await axios.post('http://localhost:3000/users/register', userData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
    
            console.log('✅ Usuário criado:', response.data);
            const userId = response.data.id;
    
            // Se houver foto, faz o upload imediatamente
            if (foto) {
                await uploadPhoto(userId);
            }
    
            setOpenCria(0);
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
        }
    }
    
    async function uploadPhoto(userId) {
        try {
            const formData = new FormData();
            formData.append('file', foto); // O nome 'file' deve ser o mesmo no backend
    
            await axios.put(`http://localhost:3000/users/${userId}`, formData, {
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
        </div>
    );
}
