import { useState, useEffect } from "react";
import { Exercicio } from "./Exercicio";
import PhotoDefault from "../../../../../assets/defaultUser.png";
import axios from "axios";
import "../../../Styles/removeArrows.css";
import api from '../../../../../../@lib/api'

export function EditaExer({ open, setOpenExer, id, setExercicios }) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [foto, setFoto] = useState("");
  const [executions, setExecutions] = useState(0);
  const [reps, setReps] = useState(0);
  const [rest, setRest] = useState(0);
  const [nomebtn, setNomebtn] = useState("Salvar Alterações");



  useEffect(() => {
    api
      .get(`/exercises/${id}`, { withCredentials: true })
      .then((response) => {
        const exercise = response.data;
        setFoto(
          exercise.imageUrl
            ? api.defaults.baseURL + exercise.imageUrl
            : PhotoDefault
        );
        setNome(exercise.name);
        setDescricao(exercise.description);
        setExecutions(exercise.executions);
        setReps(exercise.repetitions);
        setRest(exercise.restInterval);
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados do exercício", error);
      });
  }, [id]);

  const Pegaimg = (e) => {
    let fotoup = e.target.files[0];
    if (fotoup) {
      setFoto(fotoup); // Armazena o arquivo de foto, não apenas a URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNomebtn("Salvando...");

    // Envia os dados do exercício para o backend
    const exerciseData = {
      name: nome,
      description: descricao,
      repetitions: parseInt(reps, 10),
      restInterval: parseInt(rest, 10),
      executions: parseInt(executions, 10),
    };

    try {
      const response = await api.put(
        `/exercises/${id}`,
        exerciseData,
        { withCredentials: true }
      );
      const updatedExercise = response.data;

      // Se houver uma nova foto, faz o upload
      if (foto instanceof File) {
        const formData = new FormData();
        formData.append("file", foto);

        const uploadResponse = await api.put(
          `/exercises/${id}`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // Atualiza a URL da imagem
        updatedExercise.imageUrl = uploadResponse.data.imageUrl;
      }

      // Atualiza os exercícios no estado local
      setExercicios((prevExercicios) =>
        prevExercicios.map((exercicio) =>
          exercicio.id === id ? { ...exercicio, ...updatedExercise } : exercicio
        )
      );

      setTimeout(() => {
        setOpenExer(0);
        setNomebtn("Salvar Alterações");
      }, 1000);
    } catch (error) {
      console.error("Erro ao salvar exercício", error);
      setNomebtn("Erro ao salvar");
    }

    e.target.reset();
  };

  return (
    <div
      className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 duration-500 transition-all ${
        open ? "popModal" : "dropModal invisible"
      }`}
      onClick={() => setOpenExer(0)}
    >
      <form
        className="overflow-y-auto glassBgStrong px-12 rounded-2xl w-2/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 overflow-x-hidden flex flex-col items-center"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <h1>Edição Perfil</h1>
        <div className="flex w-full m-4">
          <div>
            <h1 className="text-xl text-center">Imagem do Treino </h1>
            <div
              className="relative w-48 aspect-square rounded-full mt-4"
              style={{
                backgroundImage: `url(${
                  foto instanceof File ? URL.createObjectURL(foto) : foto
                })`,
                backgroundSize: "cover",
              }}
            >
              <label className="absolute top-0 left-0 w-full h-full rounded-full cursor-pointer">
                <img
                  src={
                    foto instanceof File
                      ? URL.createObjectURL(foto)
                      : foto || PhotoDefault
                  }
                  value={foto}
                  className="rounded-full h-full w-full object-cover"
                />
                <input
                  type="file"
                  id="fotos"
                  name="fotos"
                  className="hidden"
                  onChange={Pegaimg}
                />
              </label>
            </div>
          </div>
          <div className="text-white flex w-full flex-col pt-12 pl-8">
            <div className="w-full h-fit flex justify-center items-start flex-col">
              <label
                className="w-full text-base h-fit rounded-[8px] ml-1 mt-2"
                htmlFor="Nome"
              >
                Nome
                <input
                  placeholder={nome}
                  onChange={(e) => setNome(e.target.value)}
                  type="text"
                  name="Nome"
                  className="my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]"
                />
              </label>

              <div className="text-white flex w-full flex-row justify-between pt-2 ">
                <div className="text-white flex w-[30%] flex-col ">
                  <label className="w-full text-base h-fit rounded-[8px] ml-1 mt-2">
                    Repetições
                    <input
                      placeholder={reps}
                      onChange={(e) => setReps(e.target.value)}
                      type="number"
                      name="reps"
                      className="my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]"
                    />
                  </label>
                </div>
                <div className="text-white flex w-[30%] flex-col ">
                  <label className="w-full text-base h-fit rounded-[8px] ml-1 mt-2">
                    Séries
                    <input
                      placeholder={executions}
                      onChange={(e) => setExecutions(e.target.value)}
                      type="number"
                      name="executions"
                      className="my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]"
                    />
                  </label>
                </div>
                <div className="text-white flex w-[30%] flex-col ">
                  <label className="w-full text-base h-fit rounded-[8px] ml-1 mt-2">
                    Intervalo(segundos)
                    <input
                      placeholder={rest}
                      onChange={(e) => setRest(e.target.value)}
                      type="number"
                      name="rest"
                      className="my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <label
          className="w-full break-words text-start over text-base h-fit rounded-[8px] ml-1 mt-2"
          htmlFor="Descricao"
        >
          Descrição
          <textarea
            placeholder={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="my-2 pl-2 w-full bg-input-100 h-32 rounded-[8px] resize-none"
            style={{ textAlign: "left", verticalAlign: "top" }}
          />
        </label>

        <button
          type="submit"
          className={`w-full mb-12 transition-colors mt-auto h-12 text-xl font-bold text-white font-Outfit rounded-[16px] ${
            open ? "animate" : ""
          }`}
        >
          {nomebtn}
        </button>

        <svg
          onClick={() => setOpenExer(0)}
          className="cursor-pointer hover:text-red-500 duration-500 absolute top-4 right-4"
          width="36"
          height="36"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M36 12L12 36M12 12L36 36"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </form>
    </div>
  );
}
