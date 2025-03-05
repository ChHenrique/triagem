import React, { useState, useEffect } from "react";
import Default from "../../../../assets/defaultUser.png";

import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR"; // Importa a localidade brasileira
import axios from "axios";
import { TreinoCalen } from "./components/TreinoCalen";
import { LogsTreino } from "./components/LogsTreino";

import "../Styles/index.css";
import "react-datepicker/dist/react-datepicker.css";
import { set } from "date-fns";

export function Main({userid}) {
  registerLocale("pt-BR", ptBR);


  const [treinos, setTreinos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [treinoid, setTreinoid] = useState(null);

  const [treinosRealizado,setTreinosRealizado] = useState([]);
  const [addTreino, setAddTreino] = useState(0);
  
  console.log(userid)

  useEffect(() => {
    axios
      .get(`http://localhost:3000/users/${userid}`, { withCredentials: true })
      .then((response) => {
        const aluno = response.data;
        setTreinos(aluno.trainings);
        console.log(treinos)
      })
      .catch((error) => {
        console.error("erro ao buscar os treinos", error);
      });
  }, [userid]);



  //treinos realizados
  useEffect(() => {
    axios
      .get(`http://localhost:3000/trainings/training-log/${userid}`, { withCredentials: true })
      .then((response) => {
        if (response.data.message) {
          setTreinosRealizado([])
          console.log("não tem treinos realizados")
          return
        }



        const treinosrelizados = response.data.map((treino) => ({
          nome: treino.training.name,
          descricao: treino.training.description,
          partesAfeto: treino.training.bodyParts,
          id: treino.id,
          foto: treino.training.photoUrl,
          date: treino.date
        }));
        setTreinosRealizado(treinosrelizados);
        
      })
      .catch((error) => {
        console.error("erro ao buscar os treinos realizados", error);
      });
  }, []); //uma vez só


  


  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [minDate, setMinDate] = useState(new Date());


  

  function Render() {
    if (page === 0) {
      return (
        <div className="w-full h-full flex justify-center items-center font-Sora-light flex-col pb-[40%] max-md:pb-[60%] text-white">
          <h1 className="font-satoshi-Regular text-xl font-semibold text-white/70 pb-6 text-center">
            Defina o treino realizado em alguma data
          </h1>
          <div className="flex flex-row justify-center items-center mr-12">
            <DatePicker
              open={true}
              maxDate={minDate}
              locale="pt-BR"
              dateFormat="d/MM/y"
              className="items-center ml-8 flex w-full rounded-xl text-center py-2 max-md:bg-white p-1 font-poppins text-xl border-primary-700 border-2 text-primary-700 outline-1 outline-offWhite-100"
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setPage(1);
              }}
            />
          </div>
        </div>
      );
    } else if (page === 1) {
      return (
        <div className="w-full h-full flex justify-center items-center flex-col font-Sora-reg">
          <h1 className="font-satoshi-Regular text-xl font-semibold text-primary-700 pb-2 text-center text-white">
            Qual treino você realizou esse dia?
          </h1>
          <h1 className="font-satoshi-Regular text-xl font-bold text-primary-700 p-2 border-2 border-white text-white max-md:bg-blue-50 rounded-[16px] m-2 flex-row flex justify-center items-center">
            Data: {startDate.getUTCDate()} / {startDate.getUTCMonth() + 1}
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

          <div className="h-1/2 w-full grid grid-cols-1 overflow-y-auto overflow-x-hidden place-items-center gap-y-6">
            {treinos.map((treino) => {
              return (
                <TreinoCalen
                  partesAfeto={treino.training.bodyParts}
                  nome={treino.trainig.name}
                  key={treino.trainingId}
                  descricao={treino.training.description}
                  id={treino.trainingIdid}
                  foto={"http://localhost:3000" + treino.training.photoUrl}
                  setTreinoid={setTreinoid}
                />
              );
            })}
          </div>

          <div className="w-full flex justify-center relative ">
            <button
              className="h-fit text-xl p-2 px-8 bg-offWhite-100 hover:bg-amber-100 max-md:w-fit text-bg-200  rounded-[16px] m-12 font-bold hover:bg-primary-800 duration-300"
              onClick={handleConfirm}
            >
              Confirmar
            </button>


          </div>
        </div>
      );
    } else if (page == 0) {
      window.location.href = "/psicologos";
    }
  }

  const filteredTreinos = treinosRealizado.filter((treino) =>
    treino.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  {/*Return da aba principal*/}

  return (
    <div className="w-full h-full flex flex-row items-end  max-md:bg-primary-300 rounded-2xl relative font-Outfit">
      <div className="w-full h-5/6 rounded-t-2xl p-4 justify-center ">

           <div className="w-[40%] overflow-x-hidden overflow-y-auto pb-20 h-full font-Outfit flex relative pt-20 flex-col min-w-[600px] justify-start bg-bg-300 items-center p-6 rounded-2xl">
           <input
            type="text"
            placeholder="Pesquisar..."
            className=" w-[calc(100%-48px)]  absolute top-4 glassBg h-12 p-2 py-5 text-lg outline-1 outline-white/30 placeholder-white/50 rounded-xl border-3 text-white border-neutral-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
                
                <h1 className="text-xl w-full text-offWhite-100 pb-2">Calendario de treinos</h1>


             {/* Componente do LOG*/}

             {filteredTreinos.length === 0 ? (
            <div className="w-full h-24 justify-start flex px-1 items-center rounded-2xl my-2">
              <h1 className="text-xl text-offWhite-100/70">Nenhum treino realizado</h1>
            </div>
          ) : (
            filteredTreinos.map((treino) => (
              <LogsTreino nome={treino.nome} partesAfeto={treino.partesAfeto} foto={treino.foto} date={treino.date} key={treino.id} />
            ))
          )}

           </div>




      
         <div className={` w-full h-full flex ${addTreino ? '' : 'hidden'} `}>
        {Render()}
        </div>
      </div>
    </div>
  );
}
