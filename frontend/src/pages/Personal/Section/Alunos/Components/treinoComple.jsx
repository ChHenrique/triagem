import { useEffect, useState } from "react";
import { Treino } from "./Treino";
import { Exercicio } from "./Exercicio";
import axios from "axios";
import "../../../Styles/animations.css";
export function Treinos({ open, setOpentreino, id }) {
  const [openExer, setOpenExer] = useState(0);
  const [treinoid, setTreinoid] = useState([]);
  const [exercicios, setExercicios] = useState([]);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);

  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [tel, setTel] = useState("");
  const [foto, setFoto] = useState("");
  const [treinos, setTreinos] = useState([]);
  const [trainingcount, setTrainingcount] = useState(0)
  const [mediatreinoSemana, setMediatreinosemana ] = useState(0)

  useEffect(() => {
    axios
      .get(`http://localhost:3000/users/${id}`, { withCredentials: true })
      .then((response) => {
        const aluno = response.data;
        setEmail(aluno.email);
        setNome(aluno.name);
        setTel(aluno.phone);
        setFoto("http://localhost:3000" + aluno.photoUrl);
        setTreinos(aluno.trainings);
        setTrainingcount(aluno.trainingCount);
      })
      .catch((error) => {
        console.error("Erro ao buscar os alunos", error);
      });
  
    // Buscar média de treinos na semana
    axios
      .get(`http://localhost:3000/trainings/training-log/average/${id}`, { withCredentials: true })
      .then((response) => {
        setMediatreinosemana(response.data.average);
      })
      .catch((error) => {
        console.error("Erro ao buscar média de treinos", error);
      });
  
  }, [id]);
  

  return (
    <div
      className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 ${
        open ? "" : "invisible"
      }`}
      onClick={() => { setOpentreino(0)
        setOpenExer(0)
}}
    >
      <div
        className="overflow-y-auto overflow-x-hidden glassBgStrong px-12 rounded-2xl w-2/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="justify-start w-full h-72 flex m-4 gap-4 pr-3">
          <div className={`  ${openExer? 'w-full' : "w-2/3"  }  h-full glassBg flex flex-row justify-start p-4 border-3 border-zinc-300/30 rounded-2xl`}>
            <div className="flex flex-col justify-center items-center">
              <div
                className="relative bg-offWhite-100 w-36 aspect-square rounded-2xl "
                style={{
                  backgroundImage: `url(${
                    openExer
                      ? "http://localhost:3000" + treinoSelecionado?.photoUrl
                      : foto
                  })`,
                  backgroundSize: "cover",
                }}
              ></div>
            </div>
            <div className="text-white flex flex-col px-8">
              <h1 className="text-2xl">
                {openExer ? treinoSelecionado?.name : nome}
              </h1>
              <h1 className="text-xl font-Sora-light text-white/50">
                {openExer ? treinoSelecionado?.bodyParts : tel}
              </h1>
              <h1 className="text-lg font-Sora-light text-white">
                {openExer ? "" : email}
              </h1>
              {openExer ? (
                <h1 className="text-base font-Sora-light">
                  {treinoSelecionado?.description}
                </h1>
              ) : null}
            </div>
          </div>

          <div className={`  ${openExer ?"hidden": ""}  glassBg  w-1/3 h-full border-3 border-zinc-300/30 rounded-2xl flex-row flex justify-center  gap-6 p-2`}>
            <div className="glassBgstrong p-2 w-[45%] h-full border-3 border-zinc-300/30 rounded-2xl">
              <h1 className=" justify-center items-center text-white text-lg text-center">
                Media de Treinos por Semana
              </h1>

              <h1 className=" w-full justify-center flex   mt-4 text-4xl font-Sora-black">
                {mediatreinoSemana}
              </h1>
            </div>
            <div className="glassBgstrong p-2 w-[45%] h-full border-3 border-zinc-300/30 rounded-2xl">
              <h1 className="justify-center items-center text-white text-lg text-center">
                Treinos Cadastrados
              </h1>

              <h1 className=" w-full justify-center flex   mt-4 text-4xl font-Sora-black">
                {trainingcount}
              </h1>
            </div>
          </div>
        </div>
          <h1 className="w-full text-xl text-white">{openExer ? "Exercicios" : "Treinos"}</h1>
        <div className="w-full h-full mt-12 grid grid-cols-3  overflow-auto gap-y-4">
          {openExer
            ? exercicios.map((exercicio) => (
                <Exercicio
                  key={exercicio.id}
                  reps={exercicio.repetitions}
                  nome={exercicio.name}
                  series={exercicio.executions}
                  descricao={exercicio.description}
                  id={exercicio.id}
                  exercicioFoto={"http://localhost:3000" + exercicio.imageUrl}
                />
              ))
            : treinos.map((treino) => (
                <Treino
                  treinos={treinos}
                  setTreinos={setTreinos}
                  alunoid={id}
                  foto={"http://localhost:3000" + treino.training.photoUrl}
                  key={treino.trainingId}
                  partesAfeto={treino.training.bodyParts}
                  setTreinoid={setTreinoid}
                  nome={treino.training.name}
                  open={openExer}
                  descricao={treino.training.description}
                  setOpenExer={() => {
                    setOpenExer(true);
                    setTreinoSelecionado(treino.training);
                    setExercicios(treino.training.exercises);
                  }}
                  id={treino.training.id}
                />
              ))}
        </div>

        {openExer ? (
          <svg
            width="36"
            height="36"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setOpenExer(0)}
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
            onClick={() =>{ setOpentreino(0)
                                     setOpenExer(0)
            }
            }
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
    </div>
  );
}
