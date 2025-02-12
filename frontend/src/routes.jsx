import {createBrowserRouter, Outlet} from 'react-router-dom';

import { Login } from './pages/login';
import { Personal } from './pages/Personal';
import { AlunoPage } from './pages/Aluno';
import { Lanpage } from './pages/LandPage';

export const routes = createBrowserRouter([{
    path: '/',
    element: <Outlet/>,
    children: [

        {
            path: '/',
            element: <Lanpage/>
        },
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