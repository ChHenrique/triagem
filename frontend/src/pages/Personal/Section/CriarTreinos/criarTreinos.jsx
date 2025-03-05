import { TreinoCriacao } from "./components/Treino"
import { TreinosCr } from "./components/treinoComple"
import { useState, useEffect } from "react";
import axios from 'axios';
import { Enviar } from "./components/EnviarMenu";
import { EditaTreino } from "./components/editarTreino";
import { CriarTreino } from "./components/CriarTreino";
import api from '../../../../../@lib/api'

export function CriarTreinos() {
    const [treinoid, setTreinoid] = useState(null);
    const [openTreino, setOpentreino] = useState(0);
    const [openEnv, setOpenEnv] = useState(0);
    const [openEdit, setOpenEdit] = useState(0);
    const [treinos, setTreinos] = useState([]);
    const [openCria, setOpenCria] = useState(0);
    const [openexCria, setexOpenCria] = useState(0);

    const [searchTerm, setSearchTerm] = useState(""); // Estado para armazenar o termo da pesquisa
    const [filteredTreinos, setFilteredTreinos] = useState(treinos); // Treinos filtrados

    // Limite de caracteres da descrição e 90
    useEffect(() => {
        api.get(`/trainings`, { withCredentials: true })
            .then(response => {
               
                const treinos = response.data.map(treino => ({
                    nome: treino.name, 
                    descricao: treino.description, 
                    partesAfeto: treino.bodyParts,
                    photoUrl: treino.photoUrl,
                    id: treino.id
                }));
    
                setTreinos(treinos);
                setFilteredTreinos(treinos); // Inicializa os treinos filtrados
      
            })
            .catch(error => {
                console.error("Erro ao buscar os treinos", error);
            });
    }, []); // Executa apenas uma vez na montagem
     // Executa apenas uma vez na montagem

    // Função para filtrar os treinos com base no termo de pesquisa
    useEffect(() => {
        const filtered = treinos.filter((treino) => 
          (treino.nome && treino.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (treino.descricao && treino.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredTreinos(filtered);
      }, [searchTerm, treinos]);  // Filtro deve depender de `searchTerm` e `treinos`
      
    

    return (
        <div className="w-full h-full font-Outfit px-6">
            <div className="w-full h-11 mt-4 flex-col flex justify-center items-end pr-6">
            <div className="h-11 w-full justify-end flex flex-row items-center">
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm} // O valor é controlado pelo estado
                    onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado quando o usuário digita
                    className="w-1/3 min-w-64 glassBg h-full p-2 py-5 text-lg outline-1 outline-white/30 placeholder-white/50 rounded-xl border-3 text-white  border-neutral-500"
                />
                 <svg className="h-7 text-white/70 aspect-square absolute right-16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M28 28L22.2 22.2M25.3333 14.6667C25.3333 20.5577 20.5577 25.3333 14.6667 25.3333C8.77563 25.3333 4 20.5577 4 14.6667C4 8.77563 8.77563 4 14.6667 4C20.5577 4 25.3333 8.77563 25.3333 14.6667Z" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                 </svg>


            </div>
                <button
                    className="cursor-pointer w-fit mt-4 text-white flex items-center flex-row font-Sora-reg"
                    onClick={() => setOpenCria(1)}
                >
                    Cadastrar Treino
                    <svg className="w-7 ml-2 aspect-square" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" width="4" height="25" rx="2" fill="white"/>
                       <rect y="15" width="4" height="24" rx="2" transform="rotate(-90 0 15)" fill="white"/>
                  </svg>
                </button>
            </div>
            <div className="h-[calc(100%-170px)] max-2xl:grid-cols-2 max-lg:grid-cols-1 justify-start mt-12 items-start pb-20 w-full grid grid-cols-3 gap-y-12 place-content-start place-items-start overflow-y-auto pr-8 p-18 scroll-smooth">
                {filteredTreinos.map((treino) => {
                    return (
                        <TreinoCriacao
                            partesAfeto={treino.partesAfeto}
                            nome={treino.nome}
                            key={treino.id}
                            descricao={treino.descricao}
                            id={treino.id}
                            foto={api.defaults.baseURL + treino.photoUrl}
                            setTreinoid={setTreinoid}
                            setOpenEnv={setOpenEnv}
                            setOpentreino={setOpentreino}
                            setOpenEdit={setOpenEdit}
                            setTreinos={setTreinos}
                        />
                    );
                })}

                <EditaTreino
                    setOpenEdit={setOpenEdit}
                    open={openEdit}
                    id={treinoid}
                    treinos={treinos}
                    setTreinos={setTreinos}
                />
                <TreinosCr
                    setOpentreino={setOpentreino}
                    id={treinoid}
                    open={openTreino}
                    setOpenCria={setexOpenCria}
                />
                <Enviar open={openEnv} setOpenEnv={setOpenEnv} treinoid={treinoid}></Enviar>
                <CriarTreino open={openCria} setOpenCria={setOpenCria} setTreinos={setTreinos}id={treinoid}></CriarTreino>
            </div>
        </div>
    );
}
