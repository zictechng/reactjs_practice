import React, { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function Checkout()
{
    const history = useHistory();
      /* check if user is logged in with native reactive code here */
      if(!localStorage.getItem('auth_token')){
        history.push('/');
        toast.error("Login to access cart page", {position: 'bottom-center', theme: 'colored'});
    }

    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const style = {position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"};
    
    var totalCartPrice = 0;

    const [checkoutInput, setCheckoutInput] = useState({
        firstname: '',
        lastname: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
    });
    const [error, setError] = useState([]);
    
    useEffect(() => {
        let isMounted = true;
          
        axios.get(`/api/cart`).then(res =>{
           if(isMounted)
           {
               if(res.data.status === 200)
               {
                   setCart(res.data.cart);
                    setLoading(false);
               }
               else if(res.data.status ===401)
               {
                   history.push('/');
                   toast.error(res.data.message, {position: 'bottom-center', theme: 'colored'});
               }
               
           }
        });
        return() =>{
           isMounted = false;
        };
       }, [history]);


       /* handle input details and send checkout details to api */
        const handleInput = (e) =>{
        e.persist();
        setCheckoutInput({...checkoutInput, [e.target.name]: e.target.value});
       }

       var orderinfo_data ={
        firstname: checkoutInput.firstname,
        lastname: checkoutInput.lastname,
        phone: checkoutInput.phone,
        email: checkoutInput.email,
        address: checkoutInput.address,
        city: checkoutInput.city,
        state: checkoutInput.state,
        zipcode: checkoutInput.zipcode,
        payment_mode: 'Paid by Paypal',
        payment_id: '',
    }
       /* Paypal payment code goes here */
       const PayPalButton = window.paypal.Buttons.driver("react", {React, ReactDOM});
       const createOrder = (data, actions) => {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            amount: {
              //value: totalCartPrice,
              value: "0.1",
            }
          }]
        });
      };
        const  onApprove = (data, actions) =>{
        // This function captures the funds from the transaction.
        //return actions.order.capture();
        return actions.order.capture().then(function(details){
            console.log(details);
            orderinfo_data.payment_id = details.id;

            axios.post(`/api/place-order`, orderinfo_data).then(res =>{
                if(res.data.status === 200)
                {
                    toast.success(res.data.message, {theme: 'colored'});
                    setError([]);
                    history.push('/thank-you');
                }
                else if(res.data.status === 422)
                {
                    toast.error("Missing fields are required", {position: 'top-center', theme: 'colored'});
                    setError(res.data.errors);
                }
            });
        });
        };
        /* end paypal code here */

       /* Submit details and send details to api */
       const submitOrder = (e, payment_mode) =>{
        e.preventDefault();
        var data ={
            firstname: checkoutInput.firstname,
            lastname: checkoutInput.lastname,
            phone: checkoutInput.phone,
            email: checkoutInput.email,
            address: checkoutInput.address,
            city: checkoutInput.city,
            state: checkoutInput.state,
            zipcode: checkoutInput.zipcode,
            payment_mode: payment_mode,
            payment_id: '',
        }
        switch (payment_mode){
            case 'cod':
                axios.post(`/api/place-order`, data).then(res =>{
                    if(res.data.status === 200)
                    {
                        toast.success(res.data.message, {theme: 'colored'});
                        setError([]);
                        history.push('/thank-you');
                    }
                    else if(res.data.status === 422)
                    {
                        toast.error("Missing fields are required", {position: 'top-center', theme: 'colored'});
                        setError(res.data.errors);
                    }
                });
            break;
             
            case 'payonline':
                axios.post(`/api/validate-order`, data).then(res =>{
                    if(res.data.status === 200)
                    {
                         setError([]);
                         //toast.success(res.data.message, {theme: 'colored'});
                        var myModal = new window.bootstrap.Modal(document.getElementById('payOnlineModal'));
                        myModal.show();
                    }
                    else if(res.data.status === 422)
                    {
                        toast.error("Missing fields are required", {position: 'top-center', theme: 'colored'});
                        setError(res.data.errors);
                    }
                });
                break;
                default:
                    break;
        }
        // axios.post(`/api/place-order`, data).then(res =>{
        //     if(res.data.status === 200)
        //     {
        //         toast.success(res.data.message, {theme: 'colored'});
        //         setError([]);
        //         history.push('/thank-you');
        //     }
        //     else if(res.data.status === 422)
        //     {
        //         toast.error("Missing fields are required", {position: 'top-center', theme: 'colored'});
        //         setError(res.data.errors);
        //     }
        // });
       }

       if(loading)
       {
           return(
           <div style={style}>
                   <div className="spinner-border spinner-border-sm" role="status">
                   </div> Loading
           </div>               
           )
       }
       var checkout_HTML = '';
       if(cart.length > 0)
       {
        checkout_HTML = <div>
                <div className='row'>
                <div className='col-md-7'>
                    <div className='card'>
                        <div className='card-header'>
                            <h4>Basic information</h4>
                        </div>
                        <div className='card-body'>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className='form-group md-3'>
                                        <label>First Name</label>
                                        <input type='text' name='firstname' onChange={handleInput} value={checkoutInput.firstname} className='form-control' />
                                        <small className='text-danger'>{error.firstname}</small>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='form-group md-3'>
                                        <label>Last Name</label>
                                        <input type='text' name='lastname' onChange={handleInput} value={checkoutInput.lastname} className='form-control' />
                                        <small className='text-danger'>{error.lastname}</small>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='form-group md-3'>
                                        <label>Phone Number</label>
                                        <input type='text' name='phone' onChange={handleInput} value={checkoutInput.phone} className='form-control' />
                                        <small className='text-danger'>{error.phone}</small>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='form-group md-3'>
                                        <label>Email Address</label>
                                        <input type='text' name='email' onChange={handleInput} value={checkoutInput.email} className='form-control' />
                                        <small className='text-danger'>{error.email}</small>
                                    </div>
                                </div>
                                <div className='col-md-12'>
                                    <div className='form-group md-3'>
                                        <label>Full Address</label>
                                        <textarea rows='3' name='address' onChange={handleInput} value={checkoutInput.address} className='form-control'></textarea>
                                        <small className='text-danger'>{error.address}</small>
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='form-group md-3'>
                                        <label>City</label>
                                        <input type='text' name='city' onChange={handleInput} value={checkoutInput.city} className='form-control' />
                                        <small className='text-danger'>{error.city}</small>
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className='form-group md-3'>
                                        <label>State</label>
                                        <input type='text' name='state' onChange={handleInput} value={checkoutInput.state} className='form-control' />
                                        <small className='text-danger'>{error.state}</small>
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className='form-group md-3'>
                                        <label>Zip Code</label>
                                        <input type='text' name='zipcode' onChange={handleInput} value={checkoutInput.zipcode} className='form-control' />
                                        <small className='text-danger'>{error.zipcode}</small>
                                    </div>
                                </div>

                                <div className='col-md-12 mt-2'>
                                    <div className='form-group text-end'>
                                        
                                        {/* <button type='button' onClick={submitOrder} className='btn btn-primary mx-1'> Place Order</button> */}
                                        <button type='button' onClick={(e) => submitOrder(e, 'cod')} className='btn btn-primary mx-1'> Place Order</button>
                                        <button type='button' onClick={(e) => submitOrder(e, 'payonline')} className='btn btn-warning mx-1'> Pay Online</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className='col-md-5'>
                        <table className="table table-bordered table-responsive">
                            <thead>
                                <tr>
                                    <th width='50%'>Product</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, idx) =>{
                                    totalCartPrice += item.product.selling_price * item.product_qty;
                                    return(                                                   
                                    <tr key={idx}>
                                        <td>{item.product.name}</td>
                                        <td>{item.product.selling_price}</td>
                                        <td>{item.product_qty}</td>
                                        <td>{item.product_qty * item.product.selling_price}</td>
                                    </tr>
                                    )
                                })}
                                <tr>
                                    <td colSpan="2" className='text-end fw-bold'>Grand Total</td>
                                    <td colSpan="2" className='text-end fw-bold'>{totalCartPrice}</td>
                                </tr>
                            </tbody>
                        </table>
                </div>
            </div>
        </div>
        }
    else{
        checkout_HTML =
     <div>
         <div className='card card-body py-5 text-center shadow-sm'>
             <h4>Your cart is currently empty! You are in checkout page</h4>
             <br/><br/><br/>
             <p><Link to='/collections'><button className='btn btn-info btn-sm text-center'> Start Shopping</button></Link></p>
         </div>
     </div>
    }
    return(
        <div>
            <div className="modal fade" id="payOnlineModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Online Payment Mode</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <span className='text-primary'>Secured checkout payment!</span> Checkout with PayPal or Credit/Debit Card.
                            <hr/>
                            <PayPalButton
                            createOrder={(data, actions) => createOrder(data, actions)}
                            onApprove={(data, actions) => onApprove(data, actions)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='py-3 bg-warning'>
                <div className='container'>
                    <h6><Link to="/home"> Home </Link> /Cart</h6>
                </div>
            </div>

                <div className='py-4'>
                    <div className='container'>
                        {checkout_HTML}
                    </div>
                </div>
        </div>
    )
}

export default Checkout;