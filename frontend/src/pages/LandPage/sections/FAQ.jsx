import { useState } from "react";

export function FAQ() {
  const [resposta, setResposta] = useState(null);

  const perguntas = [
    {
      id: 1,
      pergunta:
        "Como funciona o sistema virtual da academia para o acompanhamento dos treinos?",
      resposta:
        "O sistema oferece planos de treino personalizados, acompanhamento de desempenho em tempo real e orientação dos personal trainers, garantindo suporte seguro e eficaz.",
    },
    {
      id: 2,
      pergunta: "É seguro realizar os treinos sugeridos pelo sistema virtual?",
      resposta:
        "Sim! Os treinos são desenvolvidos com profissionais qualificados e adaptados ao seu nível físico. Além disso, os personal trainers estão disponíveis para ajustes e orientações.",
    },
    {
      id: 3,
      pergunta:
        "Os personal trainers estão disponíveis para tirar dúvidas durante os treinos?",
      resposta:
        "Sim, você pode entrar em contato com os personal trainers pelo aplicativo ou plataforma virtual para obter suporte imediato.",
    },
    {
      id: 4,
      pergunta:
        "Como o sistema garante que estou treinando de forma correta e segura?",
      resposta:
        "O sistema inclui vídeos explicativos, guias detalhados e feedback em tempo real. Se necessário, um personal trainer pode revisar sua técnica e ajustar o treino.",
    },
    {
      id: 5,
      pergunta:
        "Posso adaptar os treinos caso tenha alguma limitação ou lesão?",
      resposta:
        "Sim! O sistema permite que você informe suas condições físicas, ajustando os treinos automaticamente. Você também pode consultar um personal trainer para orientações específicas.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <h1 className=" text-white flex flex-row justify-center items-center text-5xl font-Sora-black h-24 w-full ">
        Algumas Perguntas Frequentes
      </h1>
      <div className="w-full h-full grid-cols-1 grid mt-20 place-content-center place-items-center items-start justify-center">
        {perguntas.map((pergunta) => (
          <div
            key={pergunta.id}
            className={`w-[700px] h-28  duration-300 relative  flex flex-col items-start justify-center p-6 rounded-2xl ${resposta == pergunta.id ? "h-40" : ""} `}
          >
            <h1
              onClick={() => {
                if (resposta != pergunta.id) {
                  setResposta(pergunta.id);
                } else {
                  setResposta(null);
                }
              }}
              className="text-lg flex flex-row duration-300 items-center font-Sora-reg text-offWhite-100"
            >
              {pergunta.pergunta}
              <svg
                className={`right-0 absolute duration-300 ${resposta == pergunta.id ? "rotate-180" : ""}`}
                width="16"
                height="9"
                viewBox="0 0 16 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.70711 0.292893C8.31658 -0.097631 7.68342 -0.097631 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 3V1H7V3H9Z"
                  fill="white"
                />
              </svg>
            </h1>
            <h1
              className={`text-sm font-Sora-light text-offWhite-100/60 duration-300 mt-4 
                ${resposta == pergunta.id ? "h-12" : "invisible h-0 -translate-y-16 opacity-0"}`}
            >
              {pergunta.resposta}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
}
