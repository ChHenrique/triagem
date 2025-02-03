import { useState } from 'react';
import Default from '../../../assets/defaultUser.png';


export function TreinoCompleto({ open, setOpentreino, Initemail, Initnome, Inittel, InitFoto }) {




    return (
        <div className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 ${open ? '' : 'invisible'}`} onClick={() => setOpentreino(0)}>
            <div className="glassBgStrong px-12 rounded-2xl w-2/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"

                onClick={(e) => {

                    e.stopPropagation();

                }}
            >
                <h1>Treinos do Aluno</h1>
                <div className='justify-start w-full h-fit flex m-4'>
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className="text-xl text-center">Imagem do Aluno</h1>
                        <div className="relative w-48 aspect-square rounded-full mt-4" style={{ backgroundImage: `url(${Default})`, backgroundSize: 'cover' }}>
                        </div>
                    </div>
                    <div className='text-white flex flex-col pt-12 px-8'>
                        <h1 className='text-xl'>Matador das Coab</h1>
                        <h1 className='text-xl font-Sora-light'>(88)96913-4201</h1>
                    </div>

                </div>
                <div className='w-full h-full '>


                </div>




                <svg onClick={() => setOpenper(0)} className='cursor-pointer absolute top-4 right-4' width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 12L12 36M12 12L36 36" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}