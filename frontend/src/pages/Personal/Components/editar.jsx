import { useState } from 'react';
import Default from '../../../assets/defaultUser.png';
import InputMask from 'react-input-mask';

export function EditarPerf({ open, setOpenper, Initemail, Initnome, Inittel, InitFoto }) {
    const [email, setEmail] = useState(Initemail);
    const [nome, setNome] = useState(Initnome);
    const [tel, setTel] = useState(Inittel);
    const [foto, setFoto] = useState(Default);

    function Pegaimg(e) {
        let fotoup = e.target.files[0];
        if (fotoup) {
            let imgurl = URL.createObjectURL(fotoup);
            setFoto(imgurl);
        }
    }

    const SubmeterForm = (e) => {
        e.preventDefault(); // Impede o comportamento padrão do formulário
        // Aqui você pode adicionar a lógica para salvar as alterações, se necessário
        console.log("Dados do formulário:", { nome, email, tel, foto });
        setOpenper(0)
    };

    return (
        <div className={`w-full fixed inset-0 h-full backdrop-blur-xs flex justify-center items-center py-12 ${open ? '' : 'invisible'}`} onClick={() => setOpenper(0)}>
            <form className="glassBgStrong px-12 rounded-2xl w-1/3 min-w-[500px] h-full border-zinc-600/25 border-4 text-offWhite-100 flex flex-col items-center"
                onSubmit={SubmeterForm} // Adiciona o evento onSubmit
                onClick={(e) => {
                    // Impede o fechamento do modal ao clicar na label ou no input
                    if (e.target.tagName === 'LABEL' || e.target.tagName === 'INPUT') {
                        e.stopPropagation();
                    }
                }}
            >
                <h1>Edição Perfil</h1>
                <div className='justify-center flex flex-col m-4'>
                    <h1 className="text-xl text-center">Imagem do Aluno</h1>
                    <div className="relative w-48 aspect-square rounded-full mt-4" style={{ backgroundImage: `url(${foto})`, backgroundSize: 'cover' }}>
                        <label htmlFor="fotos" className="absolute  top-0 left-0 w-full h-full rounded-full cursor-pointer">
                            <input type="file" id="fotos" name='fotos' className="hidden" onChange={Pegaimg} />
                        </label>
                    </div>
                </div>

                <div className='w-full h-fit flex justify-center items-start flex-col'>
                    <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Nome">Nome
                        <input placeholder={Initnome} onChange={(e) => setNome(e.target.value)} type="text" name='Nome' className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                    </label>
                    <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Email">Email
                        <input placeholder={Initemail} onChange={(e) => setEmail(e.target.value)} type="text" name='Email' className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
                    </label>
                    <label className='w-full text-base h-fit rounded-[8px] ml-1 mt-2' htmlFor="Telefone">Telefone
                    <InputMask
                            mask="(99) 99999-9999"
                            placeholder={Inittel}
                            value={tel}
                            onChange={(e) => setTel(e.target.value)}
                            className='my-2 pl-2 w-full bg-input-100 h-10 rounded-[8px]'
                        />
                    </label>
                </div>

                <button type='submit' className={`w-full mt-12 h-12 text-xl font-bold text-white font-Outfit rounded-[16px] ${open ? 'animate': ''}`}>
                    Confirmar
                </button>

                <svg onClick={() => setOpenper(0)} className='cursor-pointer absolute top-4 right-4' width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M36 12L12 36M12 12L36 36" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </form>
        </div>
    );
}