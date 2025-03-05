export function LogsTreino({ nome, partesAfeto, foto, date }) {
    // Função para formatar a data para dd/mm/yyyy
    const formatDate = (isoString) => {
      const data = new Date(isoString);
      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = data.getFullYear();
      return `${dia}/${mes}/${ano}`;
    };
  
    return (
      <div className="w-full h-24 p-3 justify-start flex px-4 items-center bg-bg-200 rounded-2xl my-2">
        <div
          className="h-16 aspect-square bg-offWhite-100 rounded-full"
          style={{
            background: `url(${"http://localhost:3000" + foto})`,
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
      </div>
    );
  }
  