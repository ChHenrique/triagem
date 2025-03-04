import { useState, useRef } from 'react';
import Default from '../../../../../assets/defaultUser.png';
import InputMask from 'react-input-mask';
import axios from 'axios';
import '../../../Styles/animations.css'

export function CriarPerf({ open, setOpenCria, id, setAlunos }) {
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

            e.target.reset();

            setEmail('');
            setNome('');
            setTel('');
            setFoto(Default);
            setFrontFoto(Default);
            setSenha('');
        } else {
            setError(1);
            setTimeout(() => {
                setError(0);
            }, 4000);
        }
        
    };

    async function createUser() {
        try {
            if (!nome || !email || !senha) return
    
            
            const userData = {
                name: nome,
                email: email,
                phone: tel || '',
                password: senha
            }
    
            const response = await axios.post('http://localhost:3000/users/register', userData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })
    
            console.log('Usuário criado:', response.data)
            const userId = response.data.id
    
            // Atualiza o estado adicionando o novo usuário
            setAlunos(prevAlunos => [
                ...prevAlunos, 
                { 
                    id: userId, 
                    nome, 
                    email, 
                    tel, 
                    photoUrl: foto ? URL.createObjectURL(foto) : 'url sem nada'
                }
            ])
    
            // Se houver foto, faz o upload da imagem
            if (foto) {
                await uploadPhoto(userId)
            }
    
            setOpenCria(0)
        } catch (error) {
            console.error("Erro ao criar usuário:", error)
        }
    }
    
    
    async function uploadPhoto(userId) {
        try {
            const formData = new FormData()
            formData.append('file', foto)
    
            await axios.put(`http://localhost:3000/users/${userId}`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
    
            console.log('📤 Foto enviada com sucesso!')
        } catch (error) {
            console.error("Erro ao enviar foto:", error)
        }
    }
    

    return (
        <div className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center duration-500 py-12 ${open ? 'popModal' : 'dropModal invisible'}`} onClick={() => setOpenCria(0)}>
            <h1 className={`flex flex-row items-center right-10 absolute bottom-20 duration-300 glassBgError border-2 font-Sora-light border-white/30 text-xl text-offWhite-100 p-3 rounded-2xl bg-white ${error ? 'ApRight' : 'hidden'}`}>
                Preencha todos os campos!
            </h1>

            <form className="glassBgStrong overflow-x-hidden overflow-y-auto px-12 rounded-2xl w-1/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"
                onSubmit={SubmeterForm}
                onClick={(e) => e.stopPropagation()}
            >
                <h1 className='mb-4'>Edição Perfil</h1>

                <div className='justify-center flex flex-col m-4'>
                    <h1 className="text-xl text-center">Imagem do Aluno</h1>
                    <div onClick={abrirInput} className="relative w-48 h-48 rounded-full  bg-offWhite-100 mt-4 bg-cover bg-center" style={{ backgroundImage: `url(${frontFoto})` }}>
                        <input ref={fileInputRef} required type="file" id="fotos" name='fotos' className="hidden" onChange={Pegaimg} />
                    </div>
                </div>

                <div className='w-full flex flex-col'>
                    <label className='text-base ml-1 mt-2' htmlFor="Nome">Nome
                        <input required placeholder="EX: Pedro Lucas" onChange={(e) => setNome(e.target.value)} type="text" name='Nome' className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                    </label>

                    <label className='text-base ml-1 mt-2' htmlFor="Email">Email
                        <input required placeholder="EX: pedro@gmail.com" onChange={(e) => setEmail(e.target.value)} type="text" name='Email' className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                    </label>

                    <label className='text-base ml-1 mt-2' htmlFor="Telefone">Telefone
                        <InputMask value={tel} mask="(99) 99999-9999" placeholder="EX: (88) 99999-9999" onChange={(e) => setTel(e.target.value)} className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                    </label>

                    <label className='text-base ml-1 mt-2' htmlFor="Senha">Senha
                        <input required placeholder="Digite sua senha" onChange={(e) => setSenha(e.target.value)} type="password" name='Senha' className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                    </label>
                </div>

                <button type="submit" className={`w-full mt-12 h-12 text-xl font-bold text-white font-Outfit rounded-[16px] ${open ? 'animate' : ''}`}>
                    Salvar Alterações
                </button>

                <svg onClick={() => setOpenCria(0)} className='cursor-pointer absolute top-4 right-4' width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 12L12 36M12 12L36 36" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </form>
        </div>
    );
}
