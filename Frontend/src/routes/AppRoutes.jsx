import {createBrowserRouter, RouterProvider} from 'react-router'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import App from '../App'
import Feed from '../features/post/pages/Feed'
import CreatePost from '../features/post/pages/CreatePost'
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
        element:<Feed/>
    },
    {
        path:"/createPost",
        element:<CreatePost/>
    }
])


    return <RouterProvider router={router}/>
}

export default AppRoutes
