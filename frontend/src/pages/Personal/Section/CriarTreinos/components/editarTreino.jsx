import { useState, useEffect } from 'react';
import axios from 'axios';
import Default from '../../../../../assets/defaultUser.png';
import api from '../../../../../../@lib/api'

export function EditaTreino({ open, setOpenEdit, id, setTreinos }) {
    const [nome, setNome] = useState('');
    const [partesAfeto, setPartesAfeto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [foto, setFoto] = useState('');
    const [frontFoto, setFrontFoto] = useState('');
    const [nomebtn, setNomebtn] = useState('Salvar Alterações');

    useEffect(() => {
        // Carregar os dados do treino
        api.get(`/trainings/${id}`, { withCredentials: true })
            .then(response => {
                const treino = response.data;
                setFoto(treino.photoUrl);
                setNome(treino.name);
                setDescricao(treino.description);
                setPartesAfeto(treino.bodyParts);
                setFrontFoto(api.defaults.baseURL + treino.photoUrl);
            })
            .catch(error => {
                console.error("Erro ao buscar os dados do treino:", error);
            });
    }, [id]);

    const Pegaimg = (e) => {
        const fotoup = e.target.files[0];
        if (fotoup) {
            const imgurl = URL.createObjectURL(fotoup);
            setFoto(fotoup);
            setFrontFoto(imgurl);
        }
    };

    const PutInfo = async (e) => {
        e.preventDefault();
    
        // Atualizando o texto do botão imediatamente
        setNomebtn('Salvando...');
    
        try {
            let updatedFotoUrl = foto; // Manter a foto original caso não mude
    
            // Se uma nova foto foi selecionada, faz o upload primeiro
            if (foto instanceof File) {
                const formData = new FormData();
                
                // Tratando o nome do arquivo: substituindo espaços por %20
                const fileName = foto.name.replace(/\s+/g, 'a');  
                const fileWithNewName = new File([foto], fileName, { type: foto.type });
                
                formData.append('file', fileWithNewName);
    
                const uploadResponse = await api.put(
                    `/trainings/${id}`,
                    formData,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                );
    
                // Atualiza a URL da foto retornada da resposta da API
                updatedFotoUrl = uploadResponse.data.photoUrl;
            }
    
            // Agora, faz a requisição para atualizar os outros dados do treino
            const updatedTraining = {
                name: nome,
                description: descricao,
                bodyParts: partesAfeto,
                photoUrl: updatedFotoUrl, // A URL da foto pode ser a original ou a nova
            };
    
            const formatedData = {
                nome: updatedTraining.name,
                descricao: updatedTraining.description,
                partesAfeto: updatedTraining.bodyParts,
            };
    
            // Requisição para atualizar o treino no backend
            const response = await api.put(
                `/trainings/${id}`,
                updatedTraining,
                { withCredentials: true }
            );
    
            if (response.status === 200) {
                // Atualizando a lista de treinos localmente
                setTreinos((prevTreinos) =>
                    prevTreinos.map((treino) =>
                        treino.id === id ? { ...treino, ...formatedData, photoUrl: updatedFotoUrl } : treino
                    )
                );
    
                // Sucesso, feche o modal e retorne ao estado inicial
                setOpenEdit(0);
                setNomebtn('Salvar Alterações');  // Voltar ao texto inicial
            } else {
                console.error("Erro ao atualizar treino:", response);
            }
        } catch (error) {
            console.error("Erro ao fazer o PUT:", error);
            // Tratar erro caso o PUT falhe
            setNomebtn('Erro ao salvar');
        }
    
        e.target.reset();
    };
    


    return (
        <div className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 duration-500  ${open ? 'popModal' : 'dropModal invisible'}`} onClick={() => setOpenEdit(0)}>
            <form className="overflow-y-auto glassBgStrong px-12 rounded-2xl w-1/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"
                onSubmit={PutInfo} // Certifique-se de que o evento de submit é o correto
                onClick={(e) => e.stopPropagation()}
            >
                <h1>Edição Perfil</h1>
                <div className="justify-center flex flex-col m-4">
                    <h1 className="text-xl text-center">Imagem do Treino</h1>
                    <div className="relative w-48 aspect-square rounded-full mt-4" style={{ backgroundImage: `url(${frontFoto || Default})`, backgroundSize: 'cover' }}>
                        <label htmlFor="fotos" className="absolute top-0 left-0 w-full h-full rounded-full cursor-pointer">
                            <input type="file" id="fotos" name="fotos" className="hidden" onChange={Pegaimg} />
                        </label>
                    </div>
                </div>

                <div className="w-full h-fit flex justify-center items-start flex-col">
                    <label className="w-full text-base h-fit rounded-[8px] ml-1 mt-2" htmlFor="Nome">Nome
                        <input placeholder={nome} onChange={(e) => setNome(e.target.value)} type="text" name="Nome" className="my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]" />
                    </label>
                    <label className="w-full text-base h-fit rounded-[8px] ml-1 mt-2" htmlFor="Email">Partes Afetadas
                        <input placeholder={partesAfeto} onChange={(e) => setPartesAfeto(e.target.value)} type="text" name="Email" className="my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]" />
                    </label>
                    <label className="w-full break-words text-start over text-base h-fit rounded-[8px] ml-1 mt-2" htmlFor="Telefone">Descrição
                        <textarea placeholder={descricao} onChange={(e) => setDescricao(e.target.value)} className="my-2 pl-2 w-full bg-input-100 h-32 rounded-[8px] resize-none" style={{ textAlign: 'left', verticalAlign: 'top' }} />
                    </label>
                </div>

                <button type="submit" className={`w-full mt-12 h-12 text-xl font-bold text-white font-Outfit rounded-[16px] ${open ? 'animate' : ''}`}>
                    {nomebtn}
                </button>

                <svg onClick={() => setOpenEdit(0)} className="cursor-pointer absolute top-4 right-4" width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 12L12 36M12 12L36 36" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </form>
        </div>
    );
}
