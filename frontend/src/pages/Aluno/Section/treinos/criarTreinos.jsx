import { Treino } from "./components/TreinoCriação";
import { TreinosCr } from "./components/treinoComple";
import { useState, useEffect } from "react";
import axios from "axios";
import api from '../../../../../@lib/api'
import { set } from "date-fns";
//import { CriarTreino } from "../Components/CriarTreino";

export function CriarTreinos() {
  const [treinoid, setTreinoid] = useState([]);
  const [openTreino, setOpentreino] = useState(0);
  const [openEnv, setOpenEnv] = useState(0);
  const [openEdit, setOpenEdit] = useState(0);
  const [treinos, setTreinos] = useState([]);
  const [openCria, setOpenCria] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  //limite de carateres da descrição e 90
  useEffect(() => {
    api
      .get(`/trainings`, { withCredentials: true })
      .then((response) => {
        const treinos = response.data.map((treino) => ({
          nome: treino.name,
          descricao: treino.description,
          partesAfeto: treino.bodyParts,
          id: treino.id,
          photoUrl: treino.photoUrl,
        }));
        setTreinos(treinos);
      })
      .catch((error) => {
        console.error("erro ao buscar os treinos", error);
      });
  }, [treinos]);

  const filteredTreinosNome = treinos.filter((treino) =>
    treino.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full font-Outfit px-6">
      <div className="w-full h-11 mt-4 flex-col flex justify-center items-end pr-6">
        <input
        onChange={(e)=> setSearchTerm(e.target.value)}
          type="text"
          placeholder="Pesquisar..."
          className="w-1/3 max-2xl:w-1/2  min-w-64 glassBg h-full p-2 py-5 text-lg outline-1 outline-white/30 placeholder-white/50 rounded-xl border-3 text-white  border-neutral-500"
          />
      </div>
      <div className="h-[calc(100%-44px)] w-full grid grid-cols-3 gap-y-12 place-content-start place-items-center overflow-y-auto p-18 scroll-smooth">
        {filteredTreinosNome.map((treino) => {
          return (
            <Treino
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
            />
          );
        })}

        <TreinosCr
          setOpentreino={setOpentreino}
          id={treinoid}
          open={openTreino}
        />
      </div>
    </div>
  );
}
