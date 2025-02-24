import Default from '../../../../../assets/defaultUser.png';
import { useState } from 'react';
import '../../../Styles/animations.css';
import axios from 'axios';

export function Treino({nome,descricao,partesAfeto,open,setOpenExer,id,alunoid,setTreinoid,setTreinos,foto,treinos,}) {

  // Função para desassociar treino
  const handleDissociateTraining = async (alunoid, treinoid, setExclude, setTreinos, treinos) => {
    try {

      const response = await axios.delete(`http://localhost:3000/trainings/${treinoid}/dissociate`, {
        data: { userId: alunoid },
      });

      setTreinos(prevTreinos => prevTreinos.filter(treino => treino.trainingId !== treinoid))

      setExclude(0)


    } catch (error) {
      console.error('Erro ao desassociar treino:', error)
    }
  };
  const [exclude, setExclude] = useState(0)

  return (
    <div className="w-80 aspect-[10/12] glassBg border-2 border-zinc-500 flex-col font-Sora-light justify-center flex items-center p-4 rounded-[16px]">
      {/* Exibe a imagem do treino */}
      <div className="h-1/3 aspect-square rounded-2xl" style={{ backgroundImage: `url(${foto})`, backgroundSize: 'cover' }}></div>

      {/* Exibe o nome, partes afetadas e descrição */}
      <div className="h-1/3 w-full flex flex-col justify-center text-offWhite-100 items-center">
        <h2 className="text-xl">{nome}</h2>
        <h2 className="text-lg">{partesAfeto}</h2>
        <h2 className="text-base text-center">{descricao}</h2>
      </div>

      {/* Botões para ver o treino e desassociar */}
      <div className={`grid grid-cols-1 font-Outfit w-full h-2/3 p-2 place-content-center place-items-center gap-4 ${exclude ? 'hidden' : ''}`}>
        <button
          className={`w-full h-12 font-Outfit bg-offWhite-100 text-bg-100 rounded-sm font-semibold text-lg cursor-pointer hover:bg-amber-100 ${open ? 'duration-300' : ''} ease-in-out`}
          onClick={() => {
            setOpenExer(1);
            setTreinoid(id);
          }}
        >
          Ver Treino Completo
        </button>
        <button
          className="w-full font-Outfit h-12 redbg text-offWhite-100 rounded-sm font-semibold text-lg cursor-pointer duration-300 ease-in-out"
          onClick={() => setExclude(1)} 
        >
          Desassociar treino
        </button>
      </div>

      {/* Confirmação para desassociar */}
      <div className={`justify-center flex h-2/3 w-full flex-col ${exclude ? '' : 'hidden'}`}>
        <h2 className="text-xl font-bold text-offWhite-100 text-center">
          Realmente deseja dessasociar esse treino desse usuário?
        </h2>
        <div className="h-12 w-full flex items-center justify-center gap-12 mt-4">
          <button
            onClick={() => handleDissociateTraining(alunoid, id, setExclude, setTreinos, treinos)}
            className="h-12 redbg aspect-video rounded-sm font-semibold text-lg cursor-pointer duration-300 ease-in-out flex justify-center items-center"
          >
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M40 12L18 34L8 24" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => setExclude(0)}
            className="h-12 bg-offWhite-100 aspect-video rounded-sm font-semibold text-lg cursor-pointer hover:bg-amber-100 duration-300 ease-in-out flex justify-center items-center"
          >
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M36 12L12 36M12 12L36 36" stroke="#131313" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
