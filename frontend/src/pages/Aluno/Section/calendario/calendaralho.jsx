import React, { useState, useEffect } from "react";
import Default from "../../../../assets/defaultUser.png";

import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR"; // Importa a localidade brasileira
import axios from "axios";
import { TreinoCalen } from "./components/TreinoCalen";
import { LogsTreino } from "./components/LogsTreino";

import { format } from 'date-fns';
import "../Styles/index.css";
import "react-datepicker/dist/react-datepicker.css";
import { set } from "date-fns";
import api from "../../../../../@lib/api";

export function Main({ userid }) {
  registerLocale("pt-BR", ptBR);

  const [treinos, setTreinos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [treinoid, setTreinoid] = useState(null);

  const [treinosRealizado, setTreinosRealizado] = useState([]);
  const [addTreino, setAddTreino] = useState(0);

  const [SelectedTreinoName, setSelectedTreinoName] = useState(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterChosen, setFilterChosen] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [sentDate, setSentDate] = useState("");
  const [minDate, setMinDate] = useState(new Date());

  useEffect(() => {
    setSelectedTreinoName(
      treinos.find((treino) => treino.trainingId === treinoid)?.training?.name
    );
  }, [treinoid]);



  useEffect(() => {
    api
      .get(`/users/${userid}`, { withCredentials: true })
      .then((response) => {
        const aluno = response.data;
        setTreinos(aluno.trainings);
      })
      .catch((error) => {
        console.error("erro ao buscar os treinos", error);
      });
  }, [userid]);

  //treinos realizados
  useEffect(() => {
    api
      .get(`/trainings/training-log/${userid}`, { withCredentials: true })
      .then((response) => {
        if (response.data.message) {
          setTreinosRealizado([]);
          console.log("não tem treinos realizados");
          return;
        }

        const treinosrelizados = response.data.map((treino) => ({
          nome: treino.training.name,
          descricao: treino.training.description,
          partesAfeto: treino.training.bodyParts,
          id: treino.id,
          foto: treino.training.photoUrl,
          date: treino.date,
        }));
        console.log(treinosrelizados);
        setTreinosRealizado(treinosrelizados);
      })
      .catch((error) => {
        console.error("erro ao buscar os treinos realizados", error);
      });
  }, []); //uma vez só

  const filteredTreinosNome = treinosRealizado.filter((treino) =>
    treino.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredTreinosDate = treinosRealizado.filter((treino) => {
    const formattedDate = format(new Date(treino.date), 'dd/MM/yyyy');
  
    return formattedDate.includes(searchTerm);
  });

  async function HandleConfirm() {
    try {
      const response = await api.post(`/trainings/training-log`, {
        userId: userid,
        date: sentDate,
        trainingId: treinoid,
      });

      // Find the training details from existing treinos
      const selectedTreino = treinos.find(
        (treino) => treino.trainingId === treinoid
      );

      if (selectedTreino) {
        // Create new training log entry
        const newTreinoRealizado = {
          nome: selectedTreino.training.name,
          descricao: selectedTreino.training.description,
          partesAfeto: selectedTreino.training.bodyParts,
          id: response.data.id, // Assuming the API returns the new log's ID
          foto: selectedTreino.training.photoUrl,
          date: sentDate,
        };

        // Update treinosRealizado state with the new entry
        setTreinosRealizado((prev) => [...prev, newTreinoRealizado]);
      }

      // Reset form state
      setAddTreino(0);
      setTreinoid(null);
      setSelectedTreinoName(null);
    } catch (error) {
      console.error("Erro ao adicionar treino realizado:", error);
    }
  }

  function Render() {
    if (page === 0) {
      return (
        <div className="w-full max-xl:-translate-20 max-xl:translate-x-2 h-full relative flex justify-center items-center font-Sora-light flex-col pb-[40%] max-md:pb-[60%] text-offWhite-100">
          <svg
            width="36"
            height="36"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => setAddTreino(0)}
            className="cursor-pointer absolute top-4 left-4 max-xl:translate-20 max-xl:-translate-x-2"
          >
            <path
              d="M38 24H10M10 24L24 38M10 24L24 10"
              stroke="#ffffff"
              stroke-width="8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <h1 className="font-Sora-reg text-xl font-semibold text-offWhite-100/70 pb-6 text-center">
            Defina o treino realizado em alguma data
          </h1>
          <div className="flex flex-row justify-center  items-center mr-12">
            <DatePicker
              open={true}
              maxDate={minDate}
              readOnly
              locale="pt-BR"
              dateFormat="d/MM/y"
              className="items-center ml-8 flex w-full rounded-xl text-center py-2 max-md:bg-white p-1 font-poppins text-xl border-primary-700 border-2 text-primary-700 outline-1 outline-offWhite-100"
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setSentDate(date.toISOString());

                setPage(1);
              }}
            />
          </div>
        </div>
      );
    } else if (page === 1) {
      return (
        <div className="w-full h-full relative flex justify-center items-center flex-col font-Sora-reg">
          <svg
            width="36"
            height="36"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              setPage(0);
              setTreinoid(null);
            }}
            className="cursor-pointer absolute top-4 left-4"
          >
            <path
              d="M38 24H10M10 24L24 38M10 24L24 10"
              stroke="#ffffff"
              stroke-width="8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <h1 className="font-Sora-black text-xl  text-primary-700 pb-2 text-center text-offWhite-100">
            Qual treino você realizou esse dia?
          </h1>
          <h1 className="font-Sora-reg text-xl text-primary-700 p-2 border-2 border-white text-offWhite-100 max-md:bg-blue-50 rounded-[16px] m-2 flex-row flex justify-center items-center">
            Data: {startDate.toLocaleDateString()}
            <svg
              width="30"
              height="30"
              viewBox="0 0 40 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-4"
            >
              <path
                d="M28 2V10M12 2V10M2 18H38M6 6H34C36.2091 6 38 7.79086 38 10V38C38 40.2091 36.2091 42 34 42H6C3.79086 42 2 40.2091 2 38V10C2 7.79086 3.79086 6 6 6Z"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h1>

          <h1 className="font-Sora-reg text-xl  text-primary-700 p-2   text-offWhite-100 max-md:bg-blue-50 rounded-[16px] m-2 flex-row flex justify-center items-center">
            {SelectedTreinoName || "Selecione um treino"}
          </h1>

          <div className="h-2/3 w-full grid grid-cols-3 max-2xl:grid-cols-2 max-lg:grid-cols-1 overflow-y-auto overflow-x-hidden place-items-center gap-y-6">
            {treinos.map((treino) => {
              return (
                <TreinoCalen
                  partesAfeto={treino.training.bodyParts}
                  nome={treino.training.name}
                  key={treino.trainingId}
                  descricao={treino.training.description}
                  id={treino.trainingId}
                  foto={api.defaults.baseURL + treino.training.photoUrl}
                  setTreinoid={setTreinoid}
                />
              );
            })}
          </div>

          <div className="w-full flex justify-center relative items-center">
            <button
              className="h-fit text-xl p-2 items-center justify-center flex px-8 bg-offWhite-100 hover:bg-amber-100 max-md:w-fit text-bg-200  rounded-[16px] mb-24 font-bold hover:bg-primary-800 duration-300"
              onClick={HandleConfirm}
            >
              Confirmar
            </button>
          </div>
        </div>
      );
    }
  }

  {
    /*Return da aba principal*/
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-end  max-md:bg-primary-300 rounded-2xl relative font-Outfit">
      <button
        className={` cursor-pointer w-full  mt-4 text-offWhite-100 flex justify-end px-12 items-center flex-row font-Sora-reg ${
          addTreino ? "hidden" : ""
        }  `}
        onClick={() => setAddTreino(1)}
      >
        Adicionar Treino ao Calendario
        <svg
          className="w-7 ml-2 aspect-square"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="10" width="4" height="25" rx="2" fill="white" />
          <rect
            y="15"
            width="4"
            height="24"
            rx="2"
            transform="rotate(-90 0 15)"
            fill="white"
          />
        </svg>
      </button>

      <div
        className={`w-full rounded-t-2xl p-4 px-12 justify-between flex flex-row items-center ${
          addTreino ? "h-full" : "h-5/6 "
        } `}
      >
        <div
          className={` justify-center gap-12 flex flex-row items-center w-full h-full ${
            addTreino ? "hidden" : ""
          }`}
        >
          <div className="w-[35%]  overflow-x-hidden overflow-y-auto pb-20 h-full font-Outfit flex relative pt-20 flex-col min-w-[500px] justify-start bg-bg-300 items-center p-6 rounded-2xl">
            <input
              type="text"
              placeholder="Pesquisar..."
              className=" w-[calc(100%-48px)]  absolute top-4 glassBg h-12 p-2 py-5 text-lg outline-1 outline-white/30 placeholder-white/50 rounded-xl border-3 text-offWhite-100 border-neutral-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="absolute text-white top-7 right-8 flex items-center justify-center   rounded-full">
              <svg
              className="mx-1"
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.46436 3.5396e-05C2.46431 1.2144e-05 2.46426 -4.87226e-10 2.46421 1.66849e-09C1.03469 6.13876e-05 0.281401 1.69396 1.23885 2.75551L5.96876 7.9997C5.96885 7.99979 5.96895 7.99987 5.96907 7.99992V7.99992C5.96919 7.99997 5.96931 8 5.96944 8H6.35773V8C6.74554 8 7.25429 8 7.6421 8V8H7.82185C7.95486 8 8.08164 7.94362 8.17073 7.84485L12.8174 2.693C13.7531 1.65552 13.0169 0 11.6197 0C11.5669 0 11.5175 0.0258345 11.4873 0.0691676L8.64163 4.15912C7.8459 5.30276 6.15392 5.30276 5.3582 4.15912L2.46447 0.000133471C2.46444 9.22837e-05 2.4644 5.86361e-05 2.46436 3.5396e-05V3.5396e-05Z"
                  fill="#D9D9D9"
                />
              </svg>
              Filtrar: {filterChosen ? "Nome" : "Data"}
            </button>

            <div className={`absolute right-4 top-16 flex-col flex justify-center items-center glassBg p-2 text-offWhite-100 border-2 border-zinc-300/30 rounded-2xl w-fit h-fit duration-500 transition-all ${filterOpen ? "popModal" : "dropModal invisible"}`}>
              <button
              onClick={() => setFilterChosen(false)}
              className={` glassBg p-1 rounded-full w-full my-1`}>
                Data do Treino
              </button>
              <button
              onClick={() => setFilterChosen(true)}
              className={` glassBg p-1 rounded-full w-full my-1`}>
                Nome do Treino
              </button>
            </div>

            <h1 className="text-xl w-full text-offWhite-100 pb-2">
              Treinos realizados
            </h1>

            {/* Componente do LOG*/}

            {
            filterChosen ? (
            filteredTreinosNome.length === 0 ? (
              <div className="w-full h-24 justify-start flex px-1 items-center rounded-2xl my-2">
                <h1 className="text-xl text-offWhite-100/70">
                  Nenhum treino realizado
                </h1>
              </div>
            ) : (
              filteredTreinosNome.map((treino) => (
                <LogsTreino
                  nome={treino.nome}
                  partesAfeto={treino.partesAfeto}
                  foto={treino.foto}
                  date={treino.date}
                  id={treino.id}
                  key={treino.id}
                  setTreinosRealizado={setTreinosRealizado}
                />
              ))
            )) : (
              filteredTreinosDate.length === 0 ? (
                <div className="w-full h-24 justify-start flex px-1 items-center rounded-2xl my-2">
                  <h1 className="text-xl text-offWhite-100/70">
                    Nenhum treino realizado
                  </h1>
                </div>
              ) : (
                filteredTreinosDate.map((treino) => (
                  <LogsTreino
                    nome={treino.nome}
                    partesAfeto={treino.partesAfeto}
                    foto={treino.foto}
                    date={treino.date}
                    id={treino.id}
                    key={treino.id}
                    setTreinosRealizado={setTreinosRealizado}
                  />
                ))
            ))}
          </div>
          <div className="flex justify-center h-full w-[40%] items-end  pb-32 max-xl:hidden">
            <DatePicker
              open={true}
              readOnly
              maxDate={minDate}
              locale="pt-BR"
              dateFormat="dd/mm/yyyy"
              className="items-center ml-8 flex  w-full rounded-xl text-center text-offWhite-100 py-2 max-md:bg-white p-1 font-poppins text-xl border-primary-700 border-2 text-primary-700 outline-1 outline-offWhite-100"
              selected={startDate}
              onChange={(date) => {
                setFilterChosen(false)
                setSearchTerm(date.toLocaleDateString("pt-BR"));
                ;
              }}
            />
          </div>
        </div>
        "=
        <div className={` w-full h-full flex ${addTreino ? "" : "hidden"} `}>
          {Render()}
        </div>
      </div>
    </div>
  );
}
