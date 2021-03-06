
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';


function ViewProduct(props)
{
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState([]);
    const [category, setCategory] = useState([]);
    const style = {position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"};
    
    /* to check if product has any item else show message to user there is no product */
    const productCount = product.length;
    useEffect(() => {
     let isMounted = true;
        const product_slug = props.match.params.slug; // this will get the product from the url and assign it to the variable
     axios.get(`/api/fetchproducts/${product_slug}`).then(res =>{
        if(isMounted)
        {
            if(res.data.status === 200)
            {
                setProduct(res.data.product_data.product);
                setCategory(res.data.product_data.category);
                setLoading(false);
            }
            else if(res.data.status === 400)
            {
                history.push('/collections');
                toast.error(res.data.message, {position: 'bottom-center', theme: 'colored'});
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
    }, [props.match.params.slug, history]);
    
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
                    var showProductList = '';
                    if(productCount) // check if there any value if not show message to user, there is no product available
                    {
                        showProductList = product.map((item, idx) =>{
                            return (
                                <div className='col-md-3' key={idx} >
                                    <div className='card'>
                                        <Link to={`/collections/${item.category.slug}/${item.slug}`}>
                                        <img src={`http://localhost:8000/${item.image}`} className='w-100' alt={item.name} />
                                        </Link>
                                        <div className='card-body'>
                                            <Link to={`/collections/${item.category.slug}/${item.slug}`}>
                                            <h5>{item.name}</h5>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        });
                    }
                    else
                    {
                        showProductList =
                        <div className='col-md-12'>
                            <div style={style}>
                            <h4>No product available for {category.name}</h4>
                            </div>
                            
                        </div>
                    }
                }
    return(
    <div>
        <div className='py-3 bg-warning'>
            <div className='container'>
                <h6><Link to="/collections"> Collections </Link> / {category.name}</h6>
            </div>
        </div>

            <div className='py-3'>
                <div className='container'>
                    <div className='row'>
                        {showProductList} 
                    </div>
                </div>
            </div>
        </div>)
    
}

export default ViewProduct;