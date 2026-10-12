import {createBrowserRouter, RouterProvider} from 'react-router'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import App from '../App'
import Feed from '../features/post/pages/Feed'
import CreatePost from '../features/post/pages/CreatePost'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'
import ProtectedMainLayout from '../layouts/ProtectedMainLayout'
import ProtectedAuthLayout from '../layouts/ProtectedAuthLayout'
const AppRoutes = () => {

const router = createBrowserRouter([

    {
        path:"/app",
        element:<ProtectedMainLayout/>,
        children:[
            {
                path:"",
                element:<MainLayout/>,
                children:[
                {
                    path:"",
                    element:<Feed/>
                },
                {
                    path:"createPost",
                    element:<CreatePost/>
                }
                ]
            }
        ]
    },

    {
        path:"/",
        element:<ProtectedAuthLayout/>,
        children:[
            {
                path:"",
                element:<AuthLayout/>,
                children:[
                {
                    path:"",
                    element:<Login/>
                },
                {
                    path:"register",
                    element:<Register/>
                },
            ]
            }
        ]
    }

    
])


    return <RouterProvider router={router}/>
}

export default AppRoutes
