import { useState } from "react";
import axios from "axios";
import api from "../../../../../../@lib/api";

export function TreinoCriacao({nome, setTreinos, descricao,foto,partesAfeto,open,setOpentreino,id,setTreinoid,setOpenEnv,setOpenEdit,}) {
  const [exclude, setExclude] = useState(0);

  const excluirTreino = async () => {
    try {
      await axios.delete(`/trainings/${id}`);
  
     
      setTreinos(prevTreinos => prevTreinos.filter(treino => treino.id !== id));
  
      setExclude(0);
    } catch (error) {
      console.log("Erro ao excluir treino:", error);
    }
  };
  

  return (
    <div className="w-76 aspect-[10/12] glassBg border-2 border-zinc-500/20 flex-col font-Sora-light justify-center flex items-center p-4 rounded-[16px]">
      <div
        className="h-1/3 aspect-square rounded-2xl"
        style={{ backgroundImage: `url(${foto})`, backgroundSize: "cover" }}
      ></div>
      <div className="h-1/2 w-full flex flex-col justify-start pt-4 text-offWhite-100 items-center">
        <h2 className="text-xl font-Sora-reg  font-medium">{nome}</h2>
        <h2 className="text-base text-white/50 text-center font-Sora-light mb-2">
          {partesAfeto}
        </h2>
        <h2 className="text-sm   w-full text-center font-Sora-reg break-words">
          {descricao}
        </h2>
      </div>
      <div
        className={`grid grid-cols-1 font-Outfit w-full h-2/3 p-2 place-content-center place-items-center gap-4 ${
          exclude ? "hidden" : ""
        }`}
      >
        <button
          className={`w-full h-10 bg-offWhite-100 text-bg-100 rounded-sm font-semibold text-lg cursor-pointer hover:bg-amber-100 ${
            open ? "duration-300" : ""
          } ease-in-out`}
          onClick={() => {
            setOpentreino(1);
            setTreinoid(id);
          }}
        >
          Ver Treino Completo
        </button>

        <button
          className={`w-full h-10 bg-offWhite-100 text-bg-100 rounded-sm font-semibold text-lg cursor-pointer hover:bg-amber-100 ${
            open ? "duration-300" : ""
          } ease-in-out`}
          onClick={() => {
            setOpenEnv(1);
            setTreinoid(id);
          }}
        >
          Enviar Treino
        </button>

        <button
          className="w-full h-10 bg-offWhite-100 text-bg-100 rounded-sm font-semibold text-lg cursor-pointer hover:bg-amber-100 duration-300 ease-in-out"
          onClick={() => {
            setOpenEdit(1);
            setTreinoid(id);
          }}
        >
          Editar Treino
        </button>

        <button
          className="w-full h-10 redbg text-offWhite-100 rounded-sm font-semibold text-lg cursor-pointer duration-300 ease-in-out"
          onClick={() => setExclude(1)}
        >
          Excluir
        </button>
      </div>

      {/* Confirmação de exclusão */}
      <div className={`justify-center flex h-1/2 w-full flex-col ${exclude ? "" : "hidden"}`}>
        <h2 className="text-xl font-bold text-offWhite-100 text-center">
          Realmente deseja excluir esse treino?
        </h2>
        <div className="h-12 w-full flex items-center justify-center gap-12 mt-4">
          {/* Botão de confirmação */}
          <button
            onClick={excluirTreino}
            className="h-12 redbg aspect-video rounded-sm font-semibold text-lg cursor-pointer duration-300 ease-in-out flex justify-center items-center"
          >
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M40 12L18 34L8 24"
                stroke="#ffffff"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* Botão de cancelar */}
          <button
            onClick={() => setExclude(0)}
            className="h-12 bg-offWhite-100 aspect-video rounded-sm font-semibold text-lg cursor-pointer hover:bg-amber-100 duration-300 ease-in-out flex justify-center items-center"
          >
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M36 12L12 36M12 12L36 36"
                stroke="#131313"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
