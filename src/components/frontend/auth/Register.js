import React, {useState} from 'react';
import Navbar from '../../../layouts/frontend/Navbar';
import axios from 'axios';
import swal from 'sweetalert';
import { useHistory } from 'react-router-dom';

function Register(){
    const history = useHistory();

    const [registerInput, setRegister] = useState({
        // declear all input variable here
        name: '',
        phone: '',
        email: '',
        password: '',
        error_list: [],

    });
    // get/set the variable from the handleinput
    const handleInput = (e) =>{
        e.persist();
        setRegister({...registerInput, [e.target.name]: e.target.value});
    }
    // get the form submit event here
    const registerSubmit = (e) =>{
        e.preventDefault();
        const data = {
            name: registerInput.name,
            email:registerInput.email,
            phone: registerInput.phone,
            password: registerInput.password,
        }
        // Send the details to backend api using axios request to register the details
        /* this below axios.get is use to generate csrtoken */
        axios.get('/sanctum/csrf-cookie').then(response => {
        axios.post(`http://localhost:8000/api/register`, data).then(res =>{
            if(res.data.status === 200)
            {
                localStorage.setItem('auth_token', res.data.token);
                localStorage.setItem('auth_name', res.data.username);
                swal("Success!", res.data.message, "success");
                /* redirect back home after successful registration */
                history.push('/');
            }
            else
            {
                setRegister({...registerInput, error_list: res.data.validation_errors});
            }
            });
        });
    }
    return(
        <div>
            <Navbar />
           <div className="container py-5">
            <div className='row justify-content-center'>
                <div className='col-md-6'>
                    <div className='card'>
                        <div className='card-header'>
                            <h4>Register </h4>
                        </div>
                            <div className='card-body'>
                                <form onSubmit={registerSubmit}>
                                    <div className='form-group mb-3'>
                                        <label>Full Name</label>
                                        <input type='text' name="name" onChange={handleInput} value={registerInput.name} className='form-control'></input>
                                        <span className='text-danger'>{registerInput.error_list.name}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Email</label>
                                        <input type='email' name="email" onChange={handleInput} value={registerInput.email} className='form-control'></input>
                                        <span className='text-danger'>{registerInput.error_list.email}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Phone</label>
                                        <input type='text' name="phone" onChange={handleInput} value={registerInput.phone} className='form-control'></input>
                                        <span className='text-danger'>{registerInput.error_list.phone}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Password</label>
                                        <input type='password' name="password" onChange={handleInput} value={registerInput.password} className='form-control'></input>
                                        <span className='text-danger'>{registerInput.error_list.password}</span>
                                    </div>
                                   
                                    <div className='form-group mb-3'>
                                       
                                        <button type='submit' className='btn btn-primary btn-sm'> Register</button>
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
export default Register;