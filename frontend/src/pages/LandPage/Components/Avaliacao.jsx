


export function Avaliacao({nome,idade,descricao,foto}){
 return(
    <div className="w-full h-full glassBg flex flex-row border-3  border-zinc-500/20 justify-center items-start rounded-2xl pb-8 p-4">
        <div className="w-24 aspect-square mr-4 rounded-2xl" style={{ backgroundImage: `url(${foto})`, backgroundSize: 'cover' }}></div>
        <div className="flex w-2/3 text-offWhite-100 flex-col items-start justify-center">
            <h1 className="text-xl font-Sora-reg">{nome}</h1>
            <h1 className="text-base text-offWhite-100/50 font-Sora-light mb-4">{idade} anos</h1>
            <h1 className="text-sm font-Sora-light">{descricao}</h1>
        </div>
    </div>
 )


}