import api from '../../../../../../@lib/api'




export function LogsTreino({ nome, partesAfeto, foto, date, id, setTreinosRealizado  }) {
    // Função para formatar a data para dd/mm/yyyy
    const formatDate = (isoString) => {
      const data = new Date(isoString);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;


    };



    async function deletarTreinolog() {
      try {
        const response = await api.delete(`/trainings/training-log/${id}`)
        setTreinosRealizado(prevTreinos => prevTreinos.filter(treino => treino.id !== id))
      } catch (error) {
        console.error('Erro ao deletar treino log', error)
      }
    } 
  
    return (
      <div className="w-full h-24 p-3 justify-start flex px-4 items-center bg-bg-200 rounded-2xl my-2">
        <div
          className="h-16 aspect-square bg-offWhite-100 rounded-full"
          style={{
            background: `url(${api.defaults.baseURL + foto})`,
            backgroundSize: "cover",
          }}
        ></div>
        <div className="flex flex-col h-16 w-2/3 pl-2 justify-center items-start">
          <h1 className="text-xl text-offWhite-100">{nome}</h1>
          <h1 className="text-base text-offWhite-100/50">{partesAfeto}</h1>
        </div>
        <div className="flex flex-col h-16 w-1/2 pl-2 justify-center items-end">
          <h1 className="text-xl text-offWhite-100">{formatDate(date)}</h1>
        </div>

        <svg className='ml-3 text-offWhite-100 hover:text-red-400 duration-200 cursor-pointer' width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"
        onClick={deletarTreinolog}
        >
            <path d="M6 12H10M10 12H42M10 12V40C10 41.0609 10.4214 42.0783 11.1716 42.8284C11.9217 43.5786 12.9391 44 14 44H34C35.0609 44 36.0783 43.5786 36.8284 42.8284C37.5786 42.0783 38 41.0609 38 40V12M16 12V8C16 6.93913 16.4214 5.92172 17.1716 5.17157C17.9217 4.42143 18.9391 4 20 4H28C29.0609 4 30.0783 4.42143 30.8284 5.17157C31.5786 5.92172 32 6.93913 32 8V12M20 22V34M28 22V34" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

      </div>
    );
  }
  