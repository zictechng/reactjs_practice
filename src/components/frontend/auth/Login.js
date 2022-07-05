import React, { useState } from 'react';
//import Navbar from '../../../layouts/frontend/Navbar';
import {toast } from 'react-toastify';

import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login(){
    
    const history = useHistory();
    const [loginInput, setLogin] = useState({
        /* declear veriable */
        email: '',
        password: '',
        error_list: [],
    });
    /* set/get the value from the input flieds */
    const handleInput = (e) =>{
        e.persist();
        setLogin({...loginInput, [e.target.name]: e.target.value});
    }
    /* create login function to send request to api here */
    const loginSubmit = (e) =>{
        e.preventDefault();
        /*collect the input data entered by user here*/
        const data = {
            email: loginInput.email,
            password: loginInput.password,
        }
        /* send request to api using axios here*/
        /* this below axios.get is use to generate csrtoken */
        axios.get('/sanctum/csrf-cookie').then(response => {
        axios.post(`/api/login`, data).then(res =>{
                if(res.data.status === 200)
                {
                    localStorage.setItem('auth_token', res.data.token);
                    localStorage.setItem('auth_name', res.data.username);
                    toast.success("Success! " + res.data.message);
                    //swal("Success!", res.data.message, "success");
                    if(res.data.role === 1)
                    {
                        history.push('/admin/dashboard');
                    }
                    else
                    {
                        history.push('/');
                    }
                   
                }
                else if(res.data.status === 401)
                {
                    toast.warning("Sorry! " + res.data.message);
                    //swal("Warning!", res.data.message, "warning");
                }
                else 
                {
                    /* show/get errors message if user didn't fill the fields here */
                    setLogin({...loginInput, error_list: res.data.validation_errors});
                    toast.error("Required fields are missing", {
                        theme: "colored"
                      });
                }
            });
        });
    }
    return(
        <div>
            {/* <Navbar /> */}
            <div className="container py-5">
            <div className='row justify-content-center'>
                <div className='col-md-6'>
                    <div className='card'>
                        <div className='card-header'>
                            <h4>Login </h4>
                        </div>
                            <div className='card-body'>
                                <form onSubmit={loginSubmit}>
                                    <div className='form-group mb-3'>
                                        <label>Email</label>
                                        <input type='email' name="email" onChange={handleInput}  value={loginInput.email} className='form-control'></input>
                                        <span className='text-danger'>{loginInput.error_list.email}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Password</label>
                                        <input type='password' name="password" onChange={handleInput}  value={loginInput.password}  className='form-control'></input>
                                        <span className='text-danger'>{loginInput.error_list.password}</span>
                                    </div>
                                     <div className='form-group mb-3'>
                                         <button type='submit' className='btn btn-primary btn-sm'> Login</button>
                                    </div>
                                </form>
                            </div>
                    </div>
                </div>
            </div>
           </div>
        </div>
    )
}
export default Login;