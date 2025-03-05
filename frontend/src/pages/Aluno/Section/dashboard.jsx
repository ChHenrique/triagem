import Default from '../../../assets/defaultUser.png'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import api from '../../../../@lib/api';

export function Dashboard({setPage, page}) {
    //troquei as props por usestate
  const [nome, setNome] = useState('')
  const [foto, setFoto] = useState('') // usestate como padrão a foto "Default"
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Erro ao tentar fazer logout', error);
    }
  };

  //fazendo a requisição pra pegar o nome a foto do usuario
  useEffect(() => {
    api
      .get('/users/me', { withCredentials: true })
      .then((response) => {

         const user = response.data
        setNome(user.name)
          setFoto(user.photoUrl)
       
      })
      .catch((error) => {
        console.error('erro ao buscar dados do usuário', error)
      })
  }, [])

  return (
    <div className="h-screen w-full flex flex-col items-start justify-between px-3 py-4 font-Outfit">
      <div>
        <div className="h-12 w-full flex items-center justify-start p-6 mb-32">
          <div
            className="h-12 aspect-square mr-2 rounded-full bg-offWhite-100"
                                // foto do usuário aqui
            style={{ backgroundImage: `url(${api.defaults.baseURL+foto})`, backgroundSize: 'cover' }}
          ></div>

          <div className="h-12 flex flex-col">
                                                {/* colocar o nome do usuário aqui */}
            <h2 className="text-xl text-offWhite-100">{nome || 'Carregando...'}</h2>
            <h4 className="text-base font-light text-offWhite-100">Aluno</h4>
          </div>
        </div>

        <div>
          <div className="h-12 mb-12 w-full flex items-center justify-start bg-bg-300 rounded-[16px] p-6">
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1" y="1.5" width="14" height="14" rx="1" stroke="white" stroke-width="2" />
              <rect x="20" y="1.5" width="14" height="14" rx="1" stroke="white" stroke-width="2" />
              <rect x="1" y="19.5" width="14" height="14" rx="1" stroke="white" stroke-width="2" />
              <rect x="20" y="19.5" width="14" height="14" rx="1" stroke="white" stroke-width="2" />
            </svg>

            <h2 className="ml-6 text-xl text-offWhite-100">Dashboard</h2>
          </div>

          {/* Area de abas */}
          <h2 className="ml-2 my-4 text-xl text-offWhite-100">Geral</h2>

          <div>
            
            <div onClick={()=>setPage(0)} className={`h-12 my-2 w-full flex items-center justify-start  rounded-[16px] p-6 ${page ?  '': 'bg-bg-300 popAnim'} `}>
              <svg
                width="28"
                height="35"
                viewBox="0 0 28 35"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="1"
                  y="2.73096"
                  width="22.973"
                  height="28.1961"
                  rx="1"
                  stroke="white"
                  stroke-width="2"
                />
                <path
                  d="M26.8944 33.0586C26.8156 33.2158 26.6965 33.3494 26.5507 33.4458C26.676 33.327 26.7911 33.1974 26.8944 33.0586Z"
                  stroke="white"
                  stroke-width="2"
                />
                <rect
                  x="6.0542"
                  y="0.388916"
                  width="2.27027"
                  height="4.02614"
                  rx="1.13514"
                  fill="white"
                />
                <rect
                  x="21.1895"
                  y="0.388916"
                  width="2.27027"
                  height="4.02614"
                  rx="1.13514"
                  fill="white"
                />
                <rect
                  x="0.756836"
                  y="0.388916"
                  width="2.27027"
                  height="4.02614"
                  rx="1.13514"
                  fill="white"
                />
                <rect
                  x="11.3516"
                  y="0.388916"
                  width="2.27027"
                  height="4.02614"
                  rx="1.13514"
                  fill="white"
                />
                <rect
                  x="16.6484"
                  y="0.388916"
                  width="2.27027"
                  height="4.02614"
                  rx="1.13514"
                  fill="white"
                />
                <rect
                  x="14.3779"
                  y="14.4805"
                  width="3.78378"
                  height="11.4074"
                  rx="1.89189"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.78393 14.4805C6.82863 14.4805 6.0542 15.2549 6.0542 16.2102V24.1581C6.0542 25.1134 6.82863 25.8879 7.78393 25.8879C8.73923 25.8879 9.51366 25.1135 9.51366 24.1581V21.1347H16.4326V19.2335H9.51366V16.2102C9.51366 15.2549 8.73923 14.4805 7.78393 14.4805ZM9.51366 19.2335H7.784V21.1347H9.51366V19.2335Z"
                  fill="white"
                />
                <rect
                  x="3.78369"
                  y="7.09912"
                  width="17.4054"
                  height="1.34205"
                  fill="white"
                />
                <rect
                  x="3.78369"
                  y="9.7832"
                  width="17.4054"
                  height="1.34205"
                  fill="white"
                />
              </svg>

              <h2 className="ml-6 text-xl text-offWhite-100">Visualizar Treinos</h2>
            </div>

            <div onClick={()=>setPage(1)} className={`h-12 my-2 w-full flex items-center justify-start  rounded-[16px] p-6 ${page ?  'bg-bg-300 popAnim' : ''} `}>
            <svg width="28" height="35" viewBox="0 0 28 35" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1" y="2.73096" width="22.973" height="28.1961" rx="1" stroke="white" stroke-width="2"/>
<path d="M26.8944 33.0586C26.8156 33.2158 26.6965 33.3494 26.5507 33.4458C26.676 33.327 26.7911 33.1974 26.8944 33.0586Z" stroke="white" stroke-width="2"/>
<rect x="6.0542" y="0.388916" width="2.27027" height="4.02614" rx="1.13514" fill="white"/>
<rect x="21.1895" y="0.388916" width="2.27027" height="4.02614" rx="1.13514" fill="white"/>
<rect x="0.756836" y="0.388916" width="2.27027" height="4.02614" rx="1.13514" fill="white"/>
<rect x="11.3516" y="0.388916" width="2.27027" height="4.02614" rx="1.13514" fill="white"/>
<rect x="16.6484" y="0.388916" width="2.27027" height="4.02614" rx="1.13514" fill="white"/>
<rect x="4.66699" y="7" width="15.5556" height="2.33333" fill="white"/>
<rect x="4.66699" y="10.1111" width="15.5556" height="17.1111" fill="white"/>
</svg>


              <h2 className="ml-6 text-xl text-offWhite-100">Calendario de Treinos</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button onClick={handleLogout} className="h-12 w-full flex items-center justify-start rounded-[16px] p-6">
        <svg
          width="36"
          height="29"
          viewBox="0 0 36 29"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M36 0.5H24V13H20V3.45299L0 15L20 26.547V17H24V28.5H36V0.5ZM24 17H28V13H24V17Z"
            fill="white"
          />
        </svg>

        <h2 className="ml-6 text-xl text-offWhite-100">Sair</h2>
      </button>
    </div>
  );
}
