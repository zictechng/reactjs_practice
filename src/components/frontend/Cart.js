import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function Cart()
{
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    const style = {position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"};
    
    var totalCartPrice = 0;
    /* check if user is logged in with native reactive code here */
    if(!localStorage.getItem('auth_token')){
        history.push('/');
        toast.error("Login to access cart page", {position: 'bottom-center', theme: 'colored'});
    }

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

       /* increment/decrement function goes here */
       const handleDecrement =(cart_id) => {
        setCart(cart =>
            cart.map((item) =>
            cart_id === item.id? {...item, product_qty: item.product_qty - (item.product_qty > 1 ? 1:0) } : item
            )
        );
        updateCartQuantity(cart_id,"dec");
       }

       const handleIncrement =(cart_id) => {
        setCart(cart =>
            cart.map((item) =>
            cart_id === item.id? {...item, product_qty: item.product_qty + (item.product_qty < 10 ? 1:0)} : item
            )
        );
        updateCartQuantity(cart_id,"inc");
       }
       /* ends here */

       /* function to update quantity directly inside the database table */
       function updateCartQuantity(cart_id,scope){
        axios.put(`/api/cart-updatequantity/${cart_id}/${scope}`).then(res =>{
            if(res.data.status === 200)
            {
                // toast.success(res.data.message);
            }
        });
       }

       /* function to delete cart item */
        const deleteCartItem = (e, cart_id) =>{
            e.preventDefault();
            const thisClicked = e.currentTarget;
            thisClicked.innerText = "Removing...";

            axios.delete(`/api/delete-cartitem/${cart_id}`).then(res =>{
                if(res.data.status === 200)
                {
                    toast.success(res.data.message);
                    thisClicked.closest("tr").remove();
                }
                else if(res.data.status === 404)
                {
                    toast.error(res.data.message);
                    // thisClicked.innerText = "Remove";
                }
                else if(res.data.status === 401)
                {
                    toast.info(res.data.message);
                    // thisClicked.innerText = "Remove";
                }
            });
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
       var cart_HTML = '';
       if(cart.length > 0)
       {
        cart_HTML = <div>
        <div>
            <table className="table table-bordered table-responsive">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th className='text-center'>Price</th>
                        <th className='text-center'>Quantity</th>
                        <th className='text-center'>Total Price</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, idx) =>{
                        totalCartPrice += item.product.selling_price * item.product_qty;
                        return(                                                   
                            <tr key={idx}>
                                <td width="10%">
                                    <img src={`http://localhost:8000/${item.product.image}`} alt={item.product.name} width="50px" height="50px" />
                                </td>
                                <td> {item.product.name}</td>
                                <td width="15%" className='text-center'>{item.product.selling_price}</td>
                                <td width="15%"><div className='input-group'>
                                    <button type='button' onClick={() => handleDecrement(item.id)} className='input-group-text'>-</button>
                                    <div className='form-control text-center'>{item.product_qty}</div>
                                    <button type='button' onClick={() => handleIncrement(item.id)} className='input-group-text'>+</button>
                                    </div>
                                </td>
                                <td width="15%" className='text-center'>{item.product_qty * item.product.selling_price}</td>
                                <td width="10%">
                                    <button type='button' onClick={ (e) => deleteCartItem(e, item.id)} className='btn btn-danger btn-sm'><i className="fa fa-remove"></i> </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
            <div className='row'>
                <div className='col-md-8'></div>
                    <div className='col-md-4'>
                        <div className='card card-body mt-3'>
                            <h4>Sub Total:
                            <span className='float-end'> {totalCartPrice}</span>
                            </h4>
                            
                            <h4>Grand Total:
                            <span className='float-end'> {totalCartPrice}</span>
                            </h4>
                            <hr />
                            <Link to="/checkout" className='btn btn-primary'> Checkout</Link>
                        </div>
                    </div>
            </div>
        </div>
       }
       else{
        cart_HTML =
        <div>
            <div className='card card-body py-5 text-center shadow-sm'>
                <h4>Your cart is currently empty!</h4>
                <br/><br/><br/>
                <p><Link to='/collections'><button className='btn btn-info btn-sm text-center'> Start Shopping</button></Link></p>
            </div>
        </div>
       }

       return (
    <div>
            <div className='py-3 bg-warning'>
                <div className='container'>
                    <h6><Link to="/home"> Home </Link> /Cart</h6>
                </div>
            </div>

                <div className='py-4'>
                    <div className='container'>
                        <div className='row'>
                                <div className='col-md-12'>
                                    {cart_HTML}
                                </div>
                               
                                
                        </div>
                    </div>
                </div>
    </div>
       )
}

export default Cart;