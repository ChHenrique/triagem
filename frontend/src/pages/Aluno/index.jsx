import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dashboard } from './Section/dashboard';
import { CriarTreinos } from './Section/criarTreinos';


export function AlunoPage() {
  const [userName, setUserName] = useState('');
  const [page,setPage] = useState(0);


  function RenderContet() {
    if (page === 0) { 
        return <CriarTreinos/>;
    }
}

  useEffect(() => {

    axios
      .get('http://localhost:3000/users/me', { withCredentials: true })
      .then((response) => {
        setUserName(response.data.name)
      })
      .catch((error) => {
        console.error('erro ao buscar dados do usuário', error)
      });
  }, []);

  return (
    <div className="w-screen h-screen bg-bg-200 flex-row flex overflow-hidden">
      <div className="h-screen w-[20%] min-w-64">
        <Dashboard page={page} setPage={setPage} />
      </div>
      <div className="h-screen w-[80%]">
        <div className="relative w-full justify-center flex items-center h-18">
          <h1 className="font-Outfit text-xl text-offWhite-100">
            Olá {userName}, Bem-vindo novamente
          </h1>
          <div className="w-1/4 h-4 blur-3xl bg-primary-100 absolute"></div>
        </div>
        <div className="w-full h-full">
          {RenderContet()}
        </div>
      </div>
    </div>
  );
}
