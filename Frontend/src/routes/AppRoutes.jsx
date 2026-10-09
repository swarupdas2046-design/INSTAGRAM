import {createBrowserRouter, RouterProvider} from 'react-router'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import App from '../App'
const AppRoutes = () => {

const router = createBrowserRouter([
    {
        path:"/",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/app",
        element:<App/>
    }
])


    return <RouterProvider router={router}/>
}

export default AppRoutes
