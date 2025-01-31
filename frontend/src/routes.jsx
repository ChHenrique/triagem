import {createBrowserRouter, Outlet} from 'react-router-dom';

import { Login } from './pages/login';
import { Personal } from './pages/Personal';

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
        }
    ]
}])