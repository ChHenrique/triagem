import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Bg from '../../assets/Imagem-Login.jpg'
import './animation.css'

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState(0)
  const [loading, setLoading] = useState(false)

  async function Validacao() {
    if (!email.includes('@') || email.length < 5) {
      setError(1)
      setTimeout(() => setError(0), 3000);
      return
    }

    if (senha.length < 7) {
      setError(1);
      setTimeout(() => setError(0), 3000);
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:3000/auth/login',
        {
          email: email,
          password: senha,
        },
        {
          withCredentials: true, 
        }
      )

      console.log('resposta do backend:', response.data)
      navigate('/personal')
    } catch (error) {
    
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || 'erro ao fazer login'
        console.error('Erro ao fazer login:', errorMessage)
        setError(1);
        setTimeout(() => setError(0), 3000)
      }
      
       else {
        console.error('erro desconhecido:', error)
      }
    } 

    finally {
      setLoading(false)
    }
  }

  return (
    <div className={`w-screen h-screen items-center justify-start overflow-hidden`} style={{ backgroundImage: `url(${Bg}) `, backgroundSize: 'cover', backgroundPosition: '-100% 20%' }}>
      <div className='w-[20%] h-full bg-bg-100 justify-between items-center flex-col min-w-[440px] Apleft  relative z-10 px-10'>
        <div className='w-full h-1/3 pt-8 justify-center flex items-center flex-col font-Sora-reg'>
          <div className='h-1/2 mb-8'>
            {/* Seu SVG aqui */}
          </div>
          <p className='text-2xl text-offWhite-100'> Seja bem-vindo de volta!</p>
          <div className='flex flex-row mt-3 font-Sora-light'>
            <p className='text-[14px] text-offGray-100 mr-1'>Ainda não tem uma conta?  </p>
            <p className='text-[14px] font-Sora-reg underline cursor-pointer text-offWhite-100'>Visite-nos!</p>
          </div>
        </div>

        <form method='POST' onSubmit={(e) => e.preventDefault()} className='w-full h-fit font-Sora-reg flex-col text-offWhite-100 text-xl justify-start items-center flex my-20 lg:my-10  gap-12 '>
          <label className='w-full text-base h-fit rounded-[8px]' htmlFor="Email">Email
            <input placeholder='exemplo@email.com' onChange={(e) => setEmail(e.target.value)} type="text" name='Email' className='w-full bg-input-100 h-10 rounded-[8px]' />
          </label>

          <div className='h-fit w-full'>
            <label className='w-full text-base h-fit rounded-[8px]' htmlFor="Senha">Senha
              <input placeholder='Senha123$' onChange={(e) => setSenha(e.target.value)} type="password" name='Senha' className='w-full bg-input-100 h-10 rounded-[8px]' />
            </label>
          </div>

          <h1 className={`font-Outfit text-xl text-red-400 absolute -translate-y-8 ${error ? 'flex' : 'hidden'}  `}>Erro nas credenciais!</h1>
          <button type='submit' onClick={Validacao} className="w-full h-12 text-xl font-bold text-white font-Outfit rounded-[16px] animate" disabled={loading}>
            {loading ? 'Carregando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}