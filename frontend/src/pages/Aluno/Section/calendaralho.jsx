import React, { useState,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import DatePicker from 'react-datepicker';
import { registerLocale } from "react-datepicker";
import ptBR from 'date-fns/locale/pt-BR'; // Importa a localidade brasileira
import axios from 'axios';
import { TreinoCalen } from "../Components/treinoCalen";


import './index.css';
import 'react-datepicker/dist/react-datepicker.css';
import { set } from "date-fns";

export function Main() {
  registerLocale('pt-BR', ptBR);
  
  const [hour, setHour] = useState("");
  const [fdate, setfDate] = useState("");
  const id = localStorage.getItem('id');

  const[treinos, setTreinos] = useState([]);

  const [treinoid, setTreinoid] = useState(null);
  const [alerta, setAlerta] = useState({ visivel: false, mensagem: '' }); // Alterado para objeto

  const mostrarAlerta = (mensagem, tipo) => {
    setAlerta({ visivel: true, mensagem }); // Atualiza o estado com a mensagem
    setTimeout(() => 
      setAlerta({ visivel: false, mensagem: '' }, Navigate('/home/paciente')), 3000); // Esconde o alerta após 3 segundos
    
  };



  useEffect(() => {      
    axios.get(`http://localhost:3000/trainings`, { withCredentials: true })
        .then(response => {
                   
            const treinos = response.data.map(treino => ({
            nome: treino.name,
            descricao: treino.description,
            partesAfeto: treino.bodyParts,
            id: treino.id,
            photoUrl: treino.photoUrl

            }))
         setTreinos(treinos);
          

        })
        .catch(error => {
            console.error("erro ao buscar os treinos", error)
        });
}, [treinos]);


  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const[minDate,setMinDate] = useState(new Date());



  async function handleConfirm() {
    const formattedDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}`;
  
    if (formattedDate !== "" ) {
      setPage(0);
      const id_paciente = localStorage.getItem('id');
      const consultaData = {
        id_paciente,
        data: formattedDate,
        horario: formattedHour,
        status: 'pendente',
      };

      try {
        const response = await fetch(`http://localhost:3000/consulta?id=${id_psicologo}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(consultaData),
        });

        const result = await response.json();
        if (result.success) {
          mostrarAlerta(result.message, "sucesso"); // Exibe o alerta de sucesso
        } else {
          mostrarAlerta(result.message, "erro"); // Exibe o alerta de erro
        }
      } catch (error) {
        console.error('Erro ao agendar consulta:', error);
        mostrarAlerta('Erro ao agendar consulta', "erro"); // Exibe o alerta de erro
      }
    } else {
      mostrarAlerta('Por favor, preencha todos os campos e tente novamente.', "erro"); // Exibe o alerta de erro
    }
  }





  function Render() {
    if (page === 1) {
      return (
        <div className="w-full h-full flex justify-center items-center font-Sora-light flex-col pb-[40%] max-md:pb-[60%] text-white">
          <h1 className="font-satoshi-Regular text-xl font-semibold text-white/70 pb-6 text-center">Defina o treino realizado em alguma data</h1>
          <div className="flex flex-row justify-center items-center mr-12">
            <DatePicker
              open={true}
              maxDate={minDate}
              locale="pt-BR"
              dateFormat="d/MM/y"
              className="items-center ml-8 flex w-full rounded-xl text-center py-2 max-md:bg-white p-1 font-poppins text-xl border-primary-700 border-2 text-primary-700 outline-1 outline-offWhite-100"
              selected={startDate}
              onChange={(date) => {setStartDate(date)
                setPage(2);
              }}
            />


            
</div></div>
        
      );
    } else if(page === 2){
      return (
        <div className="w-full h-full flex justify-center items-center flex-col font-Sora-reg">
          <h1 className="font-satoshi-Regular text-xl font-semibold text-primary-700 pb-2 text-center text-white">Qual treino você realizou esse dia?</h1>
          <h1 className="font-satoshi-Regular text-xl font-bold text-primary-700 p-2 border-2 border-white text-white max-md:bg-blue-50 rounded-[16px] m-2 flex-row flex justify-center items-center">
            Data: {startDate.getUTCDate()} / {startDate.getUTCMonth() + 1}
            <svg width="30" height="30" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-4">
              <path d="M28 2V10M12 2V10M2 18H38M6 6H34C36.2091 6 38 7.79086 38 10V38C38 40.2091 36.2091 42 34 42H6C3.79086 42 2 40.2091 2 38V10C2 7.79086 3.79086 6 6 6Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </h1>

          <div className="h-1/2 w-full grid grid-cols-1 overflow-y-auto overflow-x-hidden place-items-center gap-y-6">
                                 {
                                    treinos.map((treino)=>{
                                        return <TreinoCalen
                                        
                                        partesAfeto={treino.partesAfeto} 
                                        nome={treino.nome}
                                         key={treino.id} 
                                         descricao={treino.descricao}
                                          id={treino.id} 
                                          foto={'http://localhost:3000' + treino.photoUrl}
                                          setTreinoid={setTreinoid}
                />
                                    })
                                 }
 
          </div>
     
          <div className="w-full flex justify-center relative ">
            <button 
            className="h-fit text-xl p-2 px-8 bg-offWhite-100 hover:bg-amber-100 max-md:w-fit text-bg-200  rounded-[16px] m-12 font-bold hover:bg-primary-800 duration-300"
            onClick={handleConfirm}
          >
            Confirmar
          </button>

          {/* Exibição do alerta */}
          {alerta.visivel && (
            <div
              className={`p-2 rounded-lg transition-all duration-500 absolute bottom-0 translate-y-5 ${alerta.visivel ? "bg-primary-100 text-white opacity-100" : "bg-red-500 text-white opacity-0"}`}
            >
              {alerta.mensagem}
            </div>
          )}
          </div>
        </div>
      );
    }else if(page == 0){
      window.location.href = '/psicologos'
    }
  }

  return (
    <div className="w-full h-full flex flex-row  max-md:bg-primary-300 rounded-2xl relative font-poppins">
      <div className="w-1/2 h-full flex justify-center items-center">
      

      </div>
      <div className="w-1/2 h-full flex justify-center relative">
      <button 
        className="absolute m-4 h-fit w-fit left-8 top-20"
        onClick={() => { if (page !== 0) setPage(page - 1); }}
      >
             <svg className='cursor-pointer' width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M36 12L12 36M12 12L36 36" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

      </button>
  
      {Render()}
      </div>
    </div>
  );
}
