import { useEffect, useState } from "react";
import PhotoDefault from "../../../../../assets/defaultUser.png";
import { Exercicio } from "./Exercicio";
import axios from "axios";
import { EditaExer } from "./editarExer";
import { CriarExer } from "./CriarExer";
import api from '../../../../../../@lib/api'

export function TreinosCr({ open, setOpentreino, id, setOpenCria }) {
  const [openTreino, setOpenTreino] = useState(0);

  const [nome, setNome] = useState("");
  const [partesAfeto, setPartesAfeto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState("");
  const [usersCount, setUsersCount] = useState(0);

  const [exercicios, setExercicios] = useState([]);
  const [exerId, setExerid] = useState([]);
  const [openexer, setOpenExer] = useState(0);

  const [openCriaExer, setOpenCriaExer] = useState(0);

  useEffect(() => {
    api
      .get(`/trainings/${id}`, { withCredentials: true })
      .then((response) => {
        const treino = response.data;

        setFoto(api.defaults.baseURL + treino.photoUrl);
        setNome(treino.name);
        setUsersCount(treino.usersCount);
        setDescricao(treino.description);
        setPartesAfeto(treino.bodyParts);
        setExercicios(treino.exercises);
      })
      .catch((error) => {
        console.error("erro ao buscar os treinos", error);
      });
  }, [id]);

  return (
    <div
      className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 duration-500 transition-all ${
        open ? "popModal" : "dropModal invisible"
      } `}
      onClick={() => {
        setOpentreino(0);
        setOpenExer(0);
      }}
    >
      <div
        className="overflow-y-auto overflow-x-hidden glassBgStrong px-12 rounded-2xl w-2/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/*Area das INformaóes */}
        <div className="justify-start w-full h-fit flex m-4 relative px-4 gap-4">
          {/*Area da foto nome e etc */}

          <div className="w-2/3 h-full p-4 flex-row justify-start items-center glassBg border-zinc-300/30 border-3 rounded-2xl flex">
            <div
              className="relative w-40 aspect-square rounded-full "
              style={{
                backgroundImage: `url(${foto})`,
                backgroundSize: "cover",
              }}
            ></div>

            <div className="text-white h-full flex justify-start flex-col pt-4 px-8">
              <h1 className="text-2xl font-Sora-reg ">{nome}</h1>
              <h1 className="text-lg font-Sora-light text-white/50 mb-2">
                {partesAfeto}
              </h1>

              <h1 className="text-base font-Sora-light">{descricao}</h1>
            </div>
          </div>

          {/*Area do botao e info extra */}

          <div className="w-1/3 h-full flex-col flex justify-between items-center">
            <div className="w-full h-[60%] glassBg border-3 flex justify-start flex-col items-center border-zinc-300/30 rounded-2xl">
              <h1 className="text-white text-xl">
                Alunos com esse treino associado
              </h1>
              {/*isso e um exmplo tem que colocar o valor real */}
              <h1 className="text-white text-3xl mt-4 font-Sora-black">
                {usersCount}
              </h1>
            </div>

            <button
              className={` ${
                open ? "" : "hidden"
              }   cursor-pointer w-full  text-bg-100 duration-300 hover:bg-amber-50 font-bold flex items-center bg-white  border-zinc-300/30 border-3 h-[30%] rounded-2xl justify-center text-xl flex-row font-Sora-reg`}
              onClick={() => setOpenCriaExer(1)}
            >
              Cadastrar Exercicio
              <svg
                className="ml-2"
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="14" width="4" height="32" rx="2" fill="#131313" />
                <rect
                  y="18"
                  width="4"
                  height="32"
                  rx="2"
                  transform="rotate(-90 0 18)"
                  fill="#131313"
                />
              </svg>
            </button>
          </div>
        </div>
        <h1 className="w-full text-xl py-4 pl-4">Exercicios</h1>
        <div className="w-full h-full  px-4 grid grid-cols-3 overflow-auto gap-y-4">
          {exercicios ? (
            exercicios.map((exercicio) => (
              <Exercicio
                key={exercicio.id}
                reps={exercicio.repetitions}
                exercicioFoto={
                  exercicio.imageUrl
                    ? api.defaults.baseURL + exercicio.imageUrl
                    : PhotoDefault
                }
                nome={exercicio.name}
                series={exercicio.executions}
                descricao={exercicio.description}
                id={exercicio.id}
                setExerid={setExerid}
                restTime={exercicio.restInterval}
                setOpenExer={setOpenExer}
                setExercicios={setExercicios}
              />
            ))
          ) : (
            <h1>Nenhum exerecicio encontrado</h1>
          )}
        </div>

        {openTreino ? (
          <svg
            width="36"
            height="36"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setOpenTreino(0)}
            className="cursor-pointer absolute top-4 right-4"
          >
            <path
              d="M38 24H10M10 24L24 38M10 24L24 10"
              stroke="#ffffff"
              stroke-width="8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : (
          <svg
            onClick={() => setOpentreino(0)}
            className="cursor-pointer absolute top-4 right-4"
            width="36"
            height="36"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M36 12L12 36M12 12L36 36"
              stroke="#ffffff"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      
      <EditaExer
        setOpenExer={setOpenExer}
        open={openexer}
        id={exerId}
        setExercicios={setExercicios}
      ></EditaExer>

      <CriarExer
        open={openCriaExer}
        setOpenCria={setOpenCriaExer}
        setExercicios={setExercicios}
        id={id}
      ></CriarExer>
    </div>
  );
}
