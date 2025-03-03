import { TreinoCriacao } from "./components/TreinoCriação"
import { TreinosCr } from "./components/treinoCompleCriacao"
import { useState, useEffect } from "react";
import axios from 'axios';
import { Enviar } from "./components/EnviarMenu";
import { EditaTreino } from "./components/editarTreino";
import { CriarTreino } from "./components/CriarTreino";

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
        axios.get(`http://localhost:3000/trainings`, { withCredentials: true })
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
    }, [treinos]); // Executa apenas uma vez na montagem

    // Função para filtrar os treinos com base no termo de pesquisa
    useEffect(() => {
        const filtered = treinos.filter(treino =>
            treino.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            treino.descricao.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTreinos(filtered);
    }, [searchTerm, treinos]); // Filtra sempre que o searchTerm ou os treinos mudam

    return (
        <div className="w-full h-full font-Outfit px-6">
            <div className="w-full h-11 mt-4 flex-col flex justify-center items-end pr-6">
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={searchTerm} // O valor é controlado pelo estado
                    onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado quando o usuário digita
                    className="w-1/3 min-w-64 glassBg h-full p-2 rounded-xl border-2 text-white placeholder-zinc-300  border-neutral-500"
                />
                <button
                    className="cursor-pointer w-fit mt-4 text-white flex items-center flex-row font-Sora-reg"
                    onClick={() => setOpenCria(1)}
                >
                    Cadastrar Treino
                    <svg
                        width="30"
                        className="mx-4"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect width="30" height="30" rx="6.16784" fill="#FFFBF1" />
                        <rect x="14.248" y="5.50049" width="2" height="19" fill="#131313" />
                        <rect x="5.75195" y="16.001" width="2" height="19" transform="rotate(-90 5.75195 16.001)" fill="#131313" />
                    </svg>
                </button>
            </div>
            <div className="h-[calc(100%-44px)] pb-32 justify-start items-start w-full grid grid-cols-3 gap-y-12 place-content-start place-items-center overflow-y-auto p-18 scroll-smooth">
                {filteredTreinos.map((treino) => {
                    return (
                        <TreinoCriacao
                            partesAfeto={treino.partesAfeto}
                            nome={treino.nome}
                            key={treino.id}
                            descricao={treino.descricao}
                            id={treino.id}
                            foto={"http://localhost:3000" + treino.photoUrl}
                            setTreinoid={setTreinoid}
                            setOpenEnv={setOpenEnv}
                            setOpentreino={setOpentreino}
                            setOpenEdit={setOpenEdit}
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
                <CriarTreino open={openCria} setOpenCria={setOpenCria} id={treinoid}></CriarTreino>
            </div>
        </div>
    );
}
