import { useState, useEffect, useCallback } from "react";
import { Aluno } from "./Components/Aluno";
import { EditarPerf } from "./Components/editar";
import {CriarPerf} from "./Components/CriarAluno";
import { Treinos } from "./Components/treinoComple";
import axios from "axios";


export function Alunos() {
    const [openPer, setOpenper] = useState(0);
    const [openTreino, setOpentreino] = useState(0);
    const [idAluno, setAlunoid] = useState(null);
    const [alunos, setAlunos] = useState([]);
    const [openCria, setOpenCria] = useState(0);
    const [pesquisa, setPesquisa] = useState("");
    

    const fetchAlunos = useCallback(async () => {
        try {
            const response = await axios.get("http://localhost:3000/users", { withCredentials: true });
            const alunos = response.data.map(user => ({
                id: user.id,
                nome: user.name,
                email: user.email,
                tel: user.phone,
                photoUrl: 'http://localhost:3000' + user.photoUrl
            }));
            setAlunos(alunos);
        } catch (error) {
            console.error("Erro ao buscar os alunos", error);
        }
    }, []);


    useEffect(() => {
        fetchAlunos()
    }, [fetchAlunos])

    const filteredAlunos = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setPesquisa(e.target.value);
    };

    return (
        <div className="w-full h-full font-Outfit px-6">
            <div className="w-full h-11 mt-4 mb-12 flex-col flex justify-center items-end pr-6">
                <div className="h-11 w-full justify-end flex flex-row items-center">
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    className="w-1/3 max-2xl:w-1/2  min-w-64 glassBg h-full p-2 py-5 text-lg outline-1 outline-white/30 placeholder-white/50 rounded-xl border-3 text-white  border-neutral-500"
                    value={pesquisa}
                    onChange={handleSearchChange}
                />
                <svg className="h-7 text-white/70 aspect-square absolute right-16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M28 28L22.2 22.2M25.3333 14.6667C25.3333 20.5577 20.5577 25.3333 14.6667 25.3333C8.77563 25.3333 4 20.5577 4 14.6667C4 8.77563 8.77563 4 14.6667 4C20.5577 4 25.3333 8.77563 25.3333 14.6667Z" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                 </svg>

                </div>
                <button className=" cursor-pointer w-fit mt-4 text-white flex items-center flex-row font-Sora-reg" onClick={() => setOpenCria(1)}>
                    Cadastrar Aluno
                    <svg className="w-7 ml-2 aspect-square" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="10" width="4" height="25" rx="2" fill="white"/>
                       <rect y="15" width="4" height="24" rx="2" transform="rotate(-90 0 15)" fill="white"/>
                  </svg>

                </button>
            </div>

            <div className="h-[calc(100%-170px)] max-2xl:grid-cols-2 max-lg:grid-cols-1 justify-start mt-12 items-start pb-20 w-full grid grid-cols-3 gap-y-12 place-content-start place-items-start overflow-y-auto pr-8 p-18 scroll-smooth">
                {filteredAlunos.map((aluno) => (
                    <Aluno
                        key={aluno.id}
                        id={aluno.id}
                        nome={
                            aluno.nome
                        }
                        
                        email={aluno.email}
                        tel={aluno.tel}
                        foto={aluno.photoUrl}
                        setAlunos={setAlunos}
                        alunos={alunos}
                        setOpenper={setOpenper}
                        setOpentreino={setOpentreino}
                        setAlunoid={setAlunoid}
                    />
                ))}
                <EditarPerf open={openPer} setOpenper={setOpenper} alunos={Alunos} id={idAluno} setAlunos={setAlunos} />
                <Treinos setOpentreino={setOpentreino} open={openTreino} id={idAluno} />
                <CriarPerf open={openCria} setOpenCria={setOpenCria} setAlunos={setAlunos} />
            </div>
        </div>
    );
}
