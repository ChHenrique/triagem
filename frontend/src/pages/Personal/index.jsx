import { Dashboard } from "./Section/dashboard"

export function Personal(){


    return(
        <div className="w-screen h-screen bg-bg-200 flex-row flex">
            <div className="h-screen w-[20%] min-w-64">
             <Dashboard/>
             </div>
             <div className="h-screen w-[80%] bg-white">
                    <div className="relative w-full justify-center flex items-center h-18 ">
                           <h1 className="font-Outfit text-xl text-offWhite-100">Ola Pedro Lucas, Bem-vindo novamente</h1>
                           <div className="w-1/4 h-4 blur-3xl bg-primary-100 absolute"></div>
                    </div>

             </div>

        </div>
    )
}