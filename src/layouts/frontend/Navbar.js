import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import {toast } from 'react-toastify';

function Navbar(){

    const history = useHistory(); 
    /* logout function goes here */
    const logoutSubmit = (e) =>{
        e.preventDefault();
        axios.post(`/api/logout`).then(res =>{

        /* check if logout is successful and clear all data store */
        if(res.data.status === 200)
        {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_name');
            toast.success(res.data.message);
            history.push('/');
        }
        });
    }
    /* to check if user have logged in and if there is any token store */
    /* then do not show login and registration link */
    var AuthButtons = '';
    if(!localStorage.getItem('auth_token'))
    {
        AuthButtons = (
            <ul className='navbar-nav'>
                    <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                    </li>
            </ul>
        );
    }
    else
    {
        AuthButtons =(
            <li className="nav-item">
                    <button type='button' onClick={logoutSubmit} className="nav-link btn btn-danger btn-sm">Logout</button>
                    </li> 
        );
    }
    return(
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary shadow sticky-top">
        <div className="container">
            <Link className="navbar-brand" to="#">Navbar</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 text-white">
                    <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                    </li>
                    
                    <li className="nav-item">
                    <Link className="nav-link" to="/collections">Collection</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" to="/cart">Cart</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/about">About</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" aria-current="page" to="/contact">Contact</Link>
                    </li>
                    
                    {AuthButtons}                                     
                   
                </ul>
            
            </div>
        </div>
</nav>
    )
}
export default Navbar;