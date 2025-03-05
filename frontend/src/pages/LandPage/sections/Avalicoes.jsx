import Carlos from "../../../assets/Carlos.png";
import Maria from "../../../assets/Maria.png";
import Luiz from "../../../assets/Luiz.png";

import { Avaliacao } from "../Components/Avaliacao";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function Avaliacoes() {


  const containerRef = useRef(null);

  useGSAP(() =>{
  
      
      gsap.from('.avaGs', {
          duration: 0.6,
          opacity: 0,
          x: 50,
          stagger: 0.3,
          scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
              once: true,
          }
      })
  }, {scope: containerRef.current})


  const Avaliacoes = [
    {
      nome: "Carlos Eduardo",
      descricao:
        "A FitCore mudou minha vida! Perdi peso, ganhei energia e me livrei das dores nas costas. O ambiente é excelente, com equipamentos modernos e suporte profissional sempre disponível.",
      foto: Carlos,
      idade: 37,
    },
    {
      nome: "Maria Laura",
      descricao:
        "Com 33 anos, melhorei meu condicionamento e minha energia diária. Os treinos personalizados e o acompanhamento constante foram essenciais para alcançar meus objetivos. O ambiente é acolhedor e motivador.",
      foto: Maria,
      idade: 33,
    },
    {
      nome: "Luiz Felipe",
      descricao:
        "A FitCore me ajudou a melhorar meu desempenho físico, ganhar mais disposição e definir meu corpo. Os treinos personalizados e o suporte dos profissionais fizeram toda a diferença.",
      foto: Luiz,
      idade: 19,
    },
  ];
  

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <h1 className=" text-white flex flex-row justify-center items-center text-5xl font-Sora-black h-24 w-full ">
        Experiencia de nossos alunos
      </h1>
      <div ref={containerRef} className="mt-20  items-center place-content-center place-items-center grid-cols-3 justify-center grid  gap-16 w-fit h-fit">
        {Avaliacoes.map((avaliacao) => {
          return(<div className="w-96 h-72 max-2xl:w-72 max-2xl:h-96   avaGs">
                   <Avaliacao nome={avaliacao.nome} foto={avaliacao.foto} idade={avaliacao.idade} descricao={avaliacao.descricao}/>;
                </div>   
                )    
        })}
      </div>
    </div>
  );
}
