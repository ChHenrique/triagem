import {createBrowserRouter, Outlet} from 'react-router-dom';

import { Login } from './pages/login';
import { Personal } from './pages/Personal';
import { AlunoPage } from './pages/Aluno';

export const routes = createBrowserRouter([{
    path: '/',
    element: <Outlet/>,
    children: [
        {
            path: '/login',
            element: <Login/>
        },
        {
            path: '/personal',
            element: <Personal/>
        },
        {
            path: '/aluno',
            element: <AlunoPage/>
        }
    ]
}])