import {createBrowserRouter, RouterProvider} from 'react-router'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
const AppRoutes = () => {

const router = createBrowserRouter([
    {
        path:"/",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    }
])


    return <RouterProvider router={router}/>
}

export default AppRoutes
