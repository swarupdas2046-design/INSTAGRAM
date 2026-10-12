import React, { useContext, useEffect } from "react";
import { AuthContext } from "../features/authProvider";
import { Outlet, useNavigate } from "react-router";

const ProtectedMainLayout = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

useEffect(() => {
    (async () => {
        const response = await currentUser();
        // console.log(response.data);
        if (!response) {
            navigate("/")
    }
    })();
}, []);

return <Outlet />;
};

export default ProtectedMainLayout;
