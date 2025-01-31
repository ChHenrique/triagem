import {createBrowserRouter, Outlet} from 'react-router-dom';

import { Login } from './pages/login';

export const routes = createBrowserRouter([{
    path: '/',
    element: <Outlet/>,
    children: [
        {
            path: '/login',
            element: <Login/>
        }
    ]
}])