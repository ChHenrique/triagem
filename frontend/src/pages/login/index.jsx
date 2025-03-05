import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Bg from '../../assets/Imagem-Login.jpg';
import './animation.css';
import api from "../../../@lib/api"

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(0);
  const [loading, setLoading] = useState(false);

  async function Validacao() {
    // Validação do email
    if (!email.includes('@') || email.length < 5) {
      setError(1);
      setTimeout(() => setError(0), 3000);
      return;
    }

    // Validação da senha
    if (senha.length < 7) {
      setError(1);
      setTimeout(() => setError(0), 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        '/auth/login',
        {
          email: email,
          password: senha,
        },
        {
          withCredentials: true,
        }
      );

      console.log('resposta do backend:', response.data);

      // Agora fazemos uma requisição para a rota "/users/me" para pegar os dados do usuário
      const userResponse = await api.get('/users/me', {
        withCredentials: true,
      });

      const userData = userResponse.data;

      // Verifica o cargo do usuário e redireciona para a página correta
      if (userData.role === 'PERSONAL') {
        navigate('/personal');
      } else if (userData.role === 'CLIENT') {
        navigate('/aluno');
      } else {
        console.error('Cargo do usuário não reconhecido');
        setError(1);
        setTimeout(() => setError(0), 3000);
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'erro ao fazer login';
        console.error('Erro ao fazer login:', errorMessage);
        setError(1);
        setTimeout(() => setError(0), 3000);
      } else {
        console.error('erro desconhecido:', error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`w-screen h-screen items-center justify-start overflow-hidden`} style={{ backgroundImage: `url(${Bg}) `, backgroundSize: 'cover', backgroundPosition: '-100% 20%' }}>
      <div className='w-[20%] h-full bg-bg-100 justify-between items-center flex-col min-w-[440px] Apleft  relative z-10 px-10'>
        <div className='w-full h-1/3 pt-8 justify-center flex items-center flex-col font-Sora-reg'>
          <div className='h-1/3 w-full  mb-8'>
            <div className='h-full w-full flex justify-center items-center'>

              <svg className='aspect-square h-full w-full' viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M140 70C140 114.36 108.66 140 70 140C31.3401 140 0 114.36 0 70C0 25.6395 31.3401 5.40206e-06 70 5.40206e-06C108.66 5.40206e-06 140 25.6395 140 70Z" fill="white" />
                <path d="M47.4681 27.8453V68.7675H38.5095V27.8453H47.4681ZM64.5558 36.1403H39.339V27.8453H64.5558V36.1403ZM61.8461 52.7857H39.1178V44.7119H61.8461V52.7857ZM86.1052 41.1174H105.128V48.1958H86.1052V41.1174ZM99.875 68.7675H91.3587V32.5458H99.875V68.7675Z" fill="url(#paint0_linear_100_279)" />
                <path d="M47.5426 115.826C43.7822 115.826 40.5748 115.071 37.9204 113.559C35.3028 112.011 33.2936 109.891 31.8927 107.2C30.4917 104.471 29.7913 101.356 29.7913 97.8538C29.7913 94.3146 30.3443 91.0703 31.4503 88.121C32.5931 85.1348 34.1784 82.5541 36.2061 80.379C38.2338 78.2038 40.6117 76.5264 43.3398 75.3466C46.068 74.1669 49.0542 73.577 52.2984 73.577C55.6902 73.577 58.6027 74.2038 61.0359 75.4572C63.506 76.7107 65.4046 78.4619 66.7318 80.7108C68.0959 82.9596 68.8332 85.5772 68.9438 88.5634H59.7087C59.4875 87.0518 58.9898 85.8168 58.2156 84.8583C57.4414 83.8997 56.446 83.1993 55.2294 82.7569C54.0496 82.2776 52.704 82.038 51.1924 82.038C49.3122 82.038 47.6164 82.4251 46.1048 83.1993C44.6301 83.9366 43.3582 85.0057 42.2891 86.4067C41.22 87.7707 40.4089 89.3929 39.8559 91.2731C39.3029 93.1164 39.0264 95.1257 39.0264 97.3008C39.0264 99.2916 39.3766 101.043 40.0771 102.554C40.7776 104.066 41.7914 105.246 43.1186 106.094C44.4458 106.941 46.0311 107.365 47.8744 107.365C50.3814 107.365 52.4828 106.849 54.1787 105.817C55.8745 104.785 57.1833 103.089 58.105 100.729H67.6166C66.0313 105.67 63.5244 109.43 60.0958 112.011C56.6672 114.554 52.4828 115.826 47.5426 115.826ZM111.781 91.5496C111.781 94.9782 111.228 98.1672 110.122 101.117C109.016 104.066 107.467 106.647 105.476 108.859C103.523 111.034 101.218 112.748 98.564 114.001C95.9096 115.218 93.0155 115.826 89.8818 115.826C86.3426 115.826 83.2274 115.071 80.5361 113.559C77.8817 112.048 75.7987 109.946 74.2872 107.255C72.8125 104.564 72.0752 101.448 72.0752 97.9091C72.0752 94.4805 72.6097 91.2915 73.6789 88.3422C74.7849 85.3928 76.3149 82.8122 78.2688 80.6002C80.2596 78.3881 82.5822 76.6738 85.2366 75.4572C87.891 74.2038 90.7851 73.577 93.9188 73.577C97.4948 73.577 100.61 74.3328 103.264 75.8443C105.956 77.3559 108.039 79.4573 109.513 82.1486C111.025 84.8398 111.781 87.9735 111.781 91.5496ZM102.546 92.4344C102.546 90.2224 102.177 88.3422 101.44 86.7938C100.702 85.2454 99.6331 84.0656 98.2322 83.2546C96.8312 82.4066 95.1354 81.9827 93.1446 81.9827C91.4487 81.9827 89.8818 82.3698 88.444 83.144C87.0062 83.8813 85.7528 84.932 84.6836 86.2961C83.6145 87.6601 82.785 89.2639 82.1951 91.1072C81.6052 92.9137 81.3103 94.8676 81.3103 96.969C81.3103 99.1073 81.679 100.969 82.4163 102.554C83.1536 104.103 84.2228 105.301 85.6237 106.149C87.0615 106.96 88.7574 107.365 90.7113 107.365C92.4072 107.365 93.9741 106.997 95.4119 106.259C96.8497 105.485 98.1031 104.416 99.1723 103.052C100.241 101.688 101.071 100.103 101.661 98.2962C102.251 96.4897 102.546 94.5358 102.546 92.4344Z" fill="#131313" />
                <path d="M52.093 93.467C52.093 92.1944 53.1246 91.1628 54.3972 91.1628H86.6556C87.9282 91.1628 88.9598 92.1944 88.9598 93.467C88.9598 94.7395 87.9282 95.7711 86.6556 95.7711H54.3972C53.1246 95.7711 52.093 94.7395 52.093 93.467Z" fill="#131313" />
                <path d="M52.093 93.467C52.093 92.1944 53.1246 91.1628 54.3972 91.1628H86.6556C87.9282 91.1628 88.9598 92.1944 88.9598 93.467C88.9598 94.7395 87.9282 95.7711 86.6556 95.7711H54.3972C53.1246 95.7711 52.093 94.7395 52.093 93.467Z" stroke="#131313" />
                <path d="M74.8882 41.9186H81.3953L81.9142 68.3451H74.8882L74.8882 41.9186Z" fill="url(#paint1_linear_100_279)" />
                <path d="M68.3719 41.9186L81.3952 41.9186L70.8138 68.3721L65.7883 68.3719L68.3719 41.9186Z" fill="url(#paint2_linear_100_279)" />
                <circle cx="74.8837" cy="34.186" r="6.51163" fill="url(#paint3_linear_100_279)" />
                <defs>
                  <linearGradient id="paint0_linear_100_279" x1="69.9999" y1="9.76746" x2="69.9999" y2="84.7675" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FFDE2E" />
                    <stop offset="1" stop-color="#F9AB46" />
                  </linearGradient>
                  <linearGradient id="paint1_linear_100_279" x1="78.399" y1="41.5116" x2="78.399" y2="68.3451" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FFB85C" />
                    <stop offset="1" stop-color="#F9AB46" />
                  </linearGradient>
                  <linearGradient id="paint2_linear_100_279" x1="75.294" y1="39.9688" x2="69.5507" y2="68.8225" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FFB85C" />
                    <stop offset="1" stop-color="#F9AB46" />
                  </linearGradient>
                  <linearGradient id="paint3_linear_100_279" x1="74.8837" y1="27.6744" x2="74.8837" y2="40.6977" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#FFDE2E" />
                    <stop offset="1" stop-color="#F9AB46" />
                  </linearGradient>
                </defs>
              </svg>

            </div>

          </div>
          <p className='text-2xl text-offWhite-100'> Seja bem-vindo de volta!</p>
          <div className='flex flex-row mt-3 font-Sora-light'>
            <p className='text-[14px] text-offGray-100 mr-1'>Ainda não tem uma conta?  </p>
            <p className='text-[14px] font-Sora-reg underline cursor-pointer text-offWhite-100'>Visite-nos!</p>
          </div>
        </div>

        <form method='POST' onSubmit={(e) => e.preventDefault()} className='w-full h-fit font-Sora-reg flex-col text-offWhite-100 text-xl justify-start items-center flex my-20 lg:my-10  gap-12 '>
        <div className='h-fit w-full'>
          <label className='w-full text-base h-fit rounded-[8px] ml-1' htmlFor="Email">Email
            <input placeholder='exemplo@email.com' onChange={(e) => setEmail(e.target.value)} type="text" name='Email' className=' pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
          </label>
          </div>

          <div className='h-fit w-full'>
            <label className='w-full text-base h-fit rounded-[8px] ml-1' htmlFor="Senha">Senha
              <input placeholder='Senha123$' onChange={(e) => setSenha(e.target.value)} type="password" name='Senha' className=' pl-2 w-full bg-input-100 h-10 rounded-[8px]' />
            </label>
          </div>

          <h1 className={`font-Outfit text-xl text-red-400 absolute -translate-y-8  ${error ? 'flex' : 'hidden'}  `}>Erro nas credenciais!</h1>
          <button type='submit' onClick={Validacao} className="w-full h-12 text-xl font-bold text-white font-Outfit rounded-[16px] animate" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
        
      </div>
      <svg className='w-[23%] Apleft h-screen absolute left-0 top-0 object-fill  min-w-[450px]' viewBox="0 0 740 700" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H740C740 0 722.076 75.9227 722.076 125C722.076 174.077 739.923 200.923 740 250C740.077 299.617 721.92 326.772 722.076 376.389C722.229 424.927 739.974 451.462 740 500C740.026 548.718 722.178 575.356 722.076 624.074C721.972 673.511 740.078 700.563 740 750C739.923 798.897 722.127 825.64 722.076 874.537C722.024 923.794 740 1000 740 1000H0V0Z" fill="#131313" />
            </svg>
    </div>
  );
}