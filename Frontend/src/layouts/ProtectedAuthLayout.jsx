import React, { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router';
import { AuthContext } from '../features/authProvider';

const ProtectedAuthLayout = () => {

  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

useEffect(() => {
    (async () => {
        const response = await currentUser();
        // console.log(response.data);
        if (response) {
            navigate("/app")
    }
    })();
}, []);




  return <Outlet/>
}

export default ProtectedAuthLayout