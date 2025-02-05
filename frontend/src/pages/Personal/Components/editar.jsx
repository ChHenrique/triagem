import { useState, useEffect } from 'react';
import Default from '../../../assets/defaultUser.png';
import InputMask from 'react-input-mask';
import axios from 'axios';

export function EditarPerf({ open, setOpenper,id}) {
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [tel, setTel] = useState('');
    const [foto, setFoto] = useState(null);
    const [frontFoto, setFrontFoto] = useState(null);

    const startLINK = 'http://localhost:3000';
    
    

    useEffect(() => {      
        axios.get(`http://localhost:3000/users/${id}`, { withCredentials: true })
            .then(response => {
                const aluno = response.data;
                console.log("URL da Imagem:", aluno.photoUrl); // Verificar se está correto
                setEmail(aluno.email);
                setNome(aluno.name);
                setTel(aluno.phone);
                setFoto(aluno.photoUrl);
                setFrontFoto(`${startLINK}${aluno.photoUrl}`);
            })
            .catch(error => {
                console.error("erro ao buscar os alunos", error)
            });
    }, [id]);
    


    const Initnome = nome;
    const Initemail = email;
    const Inittel = tel;
    



    function Pegaimg(e) {
        let fotoup = e.target.files[0];
        if (fotoup) {
            let imgurl = URL.createObjectURL(fotoup);
            setFoto(fotoup);
            setFrontFoto(imgurl);
        }
    }

    const SubmeterForm = (e) => {
        e.preventDefault(); 

    };

    async function PutInfo() {
        try {
            let photoUrlAtualizada = foto; // Manter a foto original caso não mude
    
            // Se uma nova foto foi selecionada, faz o upload primeiro
            if (foto instanceof File) {
                const formData = new FormData();
                formData.append('file', foto);
    
                const uploadResponse = await axios.put(`http://localhost:3000/users/${id}`, formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
    
                photoUrlAtualizada = uploadResponse.data.url; // Supondo que a API retorna a URL da imagem
            }
    
            // Agora, faz a requisição para atualizar os outros dados
            const updatedUser = { name: nome, email, phone: tel, photoUrl: photoUrlAtualizada };
    
            await axios.put(`http://localhost:3000/users/${id}`, updatedUser, { withCredentials: true });
    
            setOpenper(0);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
        }
    }
    
    

    return (
        <div className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 ${open ? '' : 'invisible'}`} onClick={() => setOpenper(0)}>
            <form className="overflow-y-auto glassBgStrong px-12 rounded-2xl w-1/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"
                onSubmit={SubmeterForm} // Adiciona o evento onSubmit
                onClick={(e) => {
         
                      e.stopPropagation();
                }}
            >
                <h1>Edição Perfil</h1>
                <div className='justify-center flex flex-col m-4'>
                    <h1 className="text-xl text-center">Imagem do Aluno</h1>
                    <div className="relative w-48 aspect-square rounded-full mt-4" style={{ backgroundImage: `url(${frontFoto})`, backgroundSize: 'cover' }}>
                        <label htmlFor="fotos" className="absolute  top-0 left-0 w-full h-full rounded-full cursor-pointer">
                            <input type="file" id="fotos" name='fotos' className="hidden" onChange={Pegaimg} />
                        </label>
                    </div>
                </div>

                <div className='w-full h-fit flex justify-center items-start flex-col'>
                    <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Nome">Nome
                        <input placeholder={Initnome} onChange={(e) => setNome(e.target.value)} type="text" name='Nome' className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                    </label>
                    <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Email">Email
                        <input placeholder={Initemail} onChange={(e) => setEmail(e.target.value)} type="text" name='Email' className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                    </label>
                    <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Telefone">Telefone
                    <InputMask
                            mask="(99) 99999-9999"
                            placeholder={Inittel}
                            value={tel}
                            onChange={(e) => setTel(e.target.value)}
                            className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]'
                        />
                    </label>
                </div>

                <button onClick={PutInfo} type='submit' className={`w-full mt-12 h-12 text-xl font-bold text-white font-Outfit rounded-[16px] ${open ? 'animate': ''}`}>
                    Salvar Alterações
                </button>

                <svg onClick={() => setOpenper(0)} className='cursor-pointer absolute top-4 right-4' width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 12L12 36M12 12L36 36" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </form>
        </div>
    );
}