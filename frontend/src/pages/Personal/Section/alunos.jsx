import { Aluno } from "../Components/Aluno"
import { useState, useEffect } from "react"
import { EditarPerf } from "../Components/editar"
import { Treinos } from "../Components/treinoComple"
import axios from "axios"
import { CriarPerf } from "../Components/CriarAluno"

export function Alunos() {
    const [openPer, setOpenper] = useState(0)
    const [openTreino, setOpentreino] = useState(0)
    const [idAluno, setAlunoid] = useState(null)
    const [alunos, setAlunos] = useState([])
    const [openCria, setOpenCria] = useState(0)
    const [Pesquisa, setPesquisa] = useState("")


    useEffect(() => {
        axios.get("http://localhost:3000/users", { withCredentials: true })
            .then(response => {
                const alunos = response.data.map(user => ({
                    id: user.id,
                    nome: user.name,
                    email: user.email,
                    tel: user.phone,
                    photoUrl: 'http://localhost:3000' + user.photoUrl
                }));
                setAlunos(alunos);
            })
            .catch(error => {
                console.error("Erro ao buscar os alunos", error);
            });
    }, [alunos]);

    const filteredAlunos = alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(Pesquisa.toLowerCase())
    );

    return (
        <div className="w-full h-full font-Outfit px-6">
            <div className="w-full h-11 mt-4 flex-col flex justify-center items-end pr-6">
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    className="w-1/3 min-w-64 glassBg h-full p-2 rounded-xl border-2 text-white placeholder-zinc-300 border-neutral-500"
                    value={Pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                />
                <button className="cursor-pointer w-fit mt-4 text-white flex items-center flex-row font-Sora-reg" onClick={() => setOpenCria(1)}>
                    Cadastrar Aluno
                    <svg width="30" className="mx-4" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="30" height="30" rx="6.16784" fill="#FFFBF1" />
                        <rect x="14.248" y="5.50049" width="2" height="19" fill="#131313" />
                        <rect x="5.75195" y="16.001" width="2" height="19" transform="rotate(-90 5.75195 16.001)" fill="#131313" />
                    </svg>
                </button>
            </div>
            <div className="h-[calc(100%-44px)] w-full grid grid-cols-3 gap-y-12 place-content-start place-items-center overflow-y-auto p-18 scroll-smooth">
                {
                    filteredAlunos.map((aluno) => (
                        <Aluno
                            key={aluno.id}
                            id={aluno.id}
                            nome={aluno.nome}
                            email={aluno.email}
                            tel={aluno.tel}
                            foto={aluno.photoUrl}
                            setAlunos={setAlunos}
                            alunos={alunos}
                            setOpenper={setOpenper}
                            setOpentreino={setOpentreino}
                            setAlunoid={setAlunoid}

                        />
                    ))
                }
                <EditarPerf open={openPer} setOpenper={setOpenper} id={idAluno} />
                <Treinos setOpentreino={setOpentreino} open={openTreino} id={idAluno} />
                <CriarPerf open={openCria} setOpenCria={setOpenCria} />
            </div>
        </div>
    );
}
