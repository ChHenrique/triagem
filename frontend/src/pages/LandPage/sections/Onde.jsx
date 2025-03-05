import Mulher from "../../../assets/OndeFoto.png";

export function OndeEstamos() {
  return (
    <div className="h-full w-full flex gap-24 flex-row justify-center items-start font-Sora-reg">
      <div className="h-1/2 aspect-square flex flex-col justify-center items-start">
        <h1 className="text-white text-2xl font-Sora-black"> Onde estamos?</h1>
        <h1 className="text-white text-lg mt-10">
          Estamos localizados na{" "}
          <strong className="text-xl font-Sora-black">
            Rua 23 de Janeiro, Santana do Acaraú - CE.
          </strong>
        </h1>
        <h1 className="text-white text-lg mt-3">
          Comece já a transformar sua rotina! Agende seu treino hoje mesmo!
        </h1>

        <button
          onClick={() => {
            navigate("/login");
          }}
          className="text-white  z-20 mt-18 font-Outfit hover:text-bg-100 cursor-pointer animate flex text-xl justify-center items-center font-bold rounded-2xl p-4  h-12 w-64 "
        >
          Agendar meu treino!!
        </button>
      </div>
      <div
        className=" h-1/2 aspect-[100/103]"
        style={{ backgroundImage: `url(${Mulher})`, backgroundSize: "cover" }}
      ></div>
    </div>
  );
}
