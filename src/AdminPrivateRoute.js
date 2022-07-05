import React, { useEffect, useState } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import MasterLayout from "./layouts/admin/MasterLayout";
import axios from 'axios';
import {toast } from 'react-toastify';
/* this is to protect the admin section from user who has not logged in */
function AdminPrivateRoute({...rest}){

    const history = useHistory();
    const [Authenticated, setAuthenticated] = useState(false);
    const [loading, setloading] = useState(true);
    const style = {position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"};
    
    useEffect(() => {
        
        axios.get(`/api/checkingAuthenticated`).then(res => {
            if(res.status === 200)
            {
                setAuthenticated(true);
                //console.log(res.data.message);
               
            }
            else if(res.status === 401)
            {
                toast.warning("Login to continue..");
            }
            setloading(false);
        });
        return () =>{
            setAuthenticated(false);
        };
    }, []);

        /* this will check if users have not logged in then send them back to home page or login page */
        axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err){
            if(err.response.status === 401)
            {
                toast.warning(err.response.data.message);
                history.push('/');
            }
            return Promise.reject(err);
        });

        axios.interceptors.response.use(function (response) {
            return response}, function(error){
                if(error.response.status === 403) // this call access denied error
                {
                    toast.warning(error.response.data.message);
                    history.push('/403');
                }
                else if(error.response.status === 404) // this call page not found
                {
                    toast.warning("Sorry! It seem you are checking wrong page");
                    history.push('/404');
                }
                return Promise.reject(error);
            }
            
            )
        /* end here --- */
        if(loading)
        {
            return(
            <div style={style}>
                    <div className="spinner-border float-right" role="status">
                        
                    </div>
            </div>               
            )
        }

    return(
        <Route {...rest}
        render={ ({props, location}) =>
            Authenticated ?
        //localStorage.getItem('auth_token') ?
        (<MasterLayout {...props} />) :
        (<Redirect to={{ pathname: "/login", state: {from: location} }} />)
        }
        />
        );
}

export default AdminPrivateRoute;