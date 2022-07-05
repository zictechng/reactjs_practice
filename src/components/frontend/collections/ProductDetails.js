import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';


function ProductDetails(props)
{
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState([]);
    const [quantity, setQuantity] = useState([]);
  
    const style = {position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"};
    
    /* to check if product has any item else show message to user there is no product */
    //const productCount = product.length;
    useEffect(() => {
     let isMounted = true;
        const category_slug = props.match.params.category; // this will get the product from the url and assign it to the variable
        const product_slug = props.match.params.product; // this will get the product from the url and assign it to the variable
     axios.get(`/api/viewproductdetail/${category_slug}/${product_slug}`).then(res =>{
        if(isMounted)
        {
            if(res.data.status === 200)
            {
                setProduct(res.data.product);
                 setLoading(false);
            }
            else if(res.data.status ===404)
            {
                history.push('/collections');
                toast.error(res.data.message, {position: 'bottom-center', theme: 'colored'});
            }
            
        }
     });
     return() =>{
        isMounted = false;
     };
    }, [props.match.params.category, props.match.params.product, history]);
          
    /* increment/decrement of product in hooks */
       
        const handleDecrement = () =>{
            // do not decrease if item is less than 1
            if(quantity > 1){ // do not decrease if item is less than 1
            setQuantity(prevCount => prevCount - 1)
            }
        }
        const handleIncrement = () =>{
            if(quantity < 10){ // do not increase more than 1o
                setQuantity(prevCount => prevCount + 1)
            }
        }        
        /* increment/decrement of product ends here */

        /* add to cart function */
        const submitAddtocart = (e) =>{
            e.preventDefault();
            const data = {
                product_id: product.id,
                product_qty: quantity,
            }
            axios.post(`/api/add-to-cart`, data).then(res =>{
                if(res.data.status === 201)
                {
                    toast.success(res.data.message, {position: 'top-center', theme: 'colored'});
                }
                else if(res.data.status === 409){
                    toast.info(res.data.message, {position: 'top-center', theme: 'colored'});
                }
                else if(res.data.status === 401){
                    toast.error(res.data.message, {position: 'top-center', theme: 'colored'});
                }
                else if(res.data.status === 404){
                    toast.warning(res.data.message, {position: 'top-center', theme: 'colored'});
                }
                else if(res.data.status === 500){
                    toast.warning(res.data.message, {position: 'top-center', theme: 'colored'});
                }
            })
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
            else
            {
                var avail_stock = '';
                if(product.qty > 0)
                {
                    avail_stock =
                    <div>
                            <label className='btn-sm btn-success px-4 mt-2'> In Stock</label>
                            <div className='row'>
                                <div className='col-md-3 mt-3'>
                                    <div className='input-group'>
                                        <button type='button' onClick={handleDecrement} className='input-group-text'>-</button>
                                        <div className='form-control text-center'>{quantity}</div>
                                        <button type='button' onClick={handleIncrement} className='input-group-text'>+</button>
                                    </div>
                                </div>
                                <div className='col-md-3 mt-3'>
                                    <button type='button' className='btn btn-primary w-100' onClick={submitAddtocart}> Add to Cart</button>
                                </div>
                            </div>
                    </div>
                }
                else
                {
                    avail_stock =
                    <div>
                    <label className='btn-sm btn-danger px-4 mt-2'> Out of Stock</label>
                    </div>
                }
            }
    return(
        <div>
        <div className='py-3 bg-warning'>
            <div className='container'>
                <h6><Link to="/collections"> Collections </Link> /{product.category.name}/ {product.name}</h6>
            </div>
        </div>

            <div className='py-3'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-4 border-end'>
                            <img src={`http://localhost:8000/${product.image}`} className='w-100' alt={product.name}/>
                        </div>
                        <div className='col-md-8'>
                            <h4>{product.name}
                            <span className='float-end badge btn-sm btn-danger badge-pil'> {product.brand}</span>
                            </h4>
                            <p> {product.description}</p>
                            <h4 className='mb-1'>
                                Rs: {product.selling_price}
                                <s className='ms-2'> Rs: {product.original_price}</s>
                            </h4>
                            <div>
                                {avail_stock}
                            </div>
                                <button type='button' className='btn btn-danger mt-3'> Add to Wishlist</button>
                        </div>
                        {/* {showProductList}  */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails;