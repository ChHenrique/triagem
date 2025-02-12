import HeroIMG from "../../../assets/Imagem-Hero.svg";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();


  return (
    <div className="w-full h-full bg-bg-100 justify-center items-center pt-14 flex text-white font-Sora-black relative">

      <div className="w-1/3 h-fit  top-14 absolute z-20 justify-center items-center flex flex-col ApDown">

        <div className="absolute bg-[#EDB369]/40 blur-3xl z-10 h-60 aspect-video"></div>
        <div className="absolute bg-[#EDB369]/20 blur-3xl z-10 bottom-0 h-24 aspect-video"></div>

        <h1 className="text-5xl  text-center z-20 ">
          Invista no seu maior patrimônio,{" "}
          <strong className=" bg-gradient-to-r from-[#FFB85C] to-[#FFDE2E] bg-clip-text text-transparent">
            Sua saúde.
          </strong>
        </h1>
        <h1 className="text-2xl h-14 max-md:w-84 break-words text-center font-Outfit mt-6 z-20">
          Venha para nossa academia e inicie sua jornada com nosso sistema
          inteligente e suporte completo!
        </h1>

        <button onClick={
            () => {
                navigate('/login')
            }
        }
        
        className="text-white  z-20 mt-18 font-Outfit hover:text-bg-100 cursor-pointer animate flex text-xl justify-center items-center font-bold rounded-2xl p-4  h-12 w-72">
          Agendar meu treino!!
        </button>
        <h1 className="text-base text-white/70 h-14 w-76 break-words text-center font-Outfit mt-6 z-20">
        Mais de 7 mil alunos já transformam suas vidas diariamente em busca de evolução!
        </h1>

      </div>


      <div className="w-full h-full relative z-0">
        <div className="absolute bottom-0 w-full h-full z-10 bg-bg-100/20"></div>
        <div className="absolute bottom-0 w-full h-[25%] z-10 bg-gradient-to-b from-transparent to-bg-100"></div>
        <div className="absolute top-0 w-full h-[40%] z-10 bg-gradient-to-t from-transparent to-bg-100"></div>
        <div
          className="w-full h-full absolute top-0 left-0 z-0"
          style={{
            background: `url(${HeroIMG})`,
            backgroundSize: "cover",
            backgroundPositionY: "35%",
          }}
        ></div>
      </div>
    </div>
  );
}
