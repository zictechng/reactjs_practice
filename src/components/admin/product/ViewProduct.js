import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


function ViewProduct()
{
    const [loading, setLoading] = useState(false);
    const style = {position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"};
    /* set array/variable to get/recieved the product details */
        const [viewProduct, setProduct] = useState([])
    useEffect(() => {
        setLoading(true);
        axios.get(`/api/view-product`).then(res =>{
            if(res.data.status === 200)
            {
                setProduct(res.data.products);
            }
            setLoading(false);
        });
    }, []);

        /* create veriable to hold the result data */
        var  display_produtdata = "";
      /* set laoding icon to display while page is fetching data from api */
        if(loading)
        {
            return(
            <div style={style}>
                    <div className="spinner-border spinner-border-sm" role="status">
                    </div> Loading
            </div>               
            )
        }
        /* end loading display here */
        else
        {       
            var ProdStatus = '';
            /* auto increase row number serial: viewProduct.map((item, i) <tr key{i} <td>{i+1}</td> */
            display_produtdata =  viewProduct.map((item, i) =>{
                // eslint-disable-next-line eqeqeq
                if(item.status == '0')// this mean product is active
                {
                    ProdStatus = <span className='badge bg-success'>Active</span>
                }
                // eslint-disable-next-line eqeqeq
                else if(item.status == '1')
                {
                    ProdStatus = <span className='badge bg-danger'>Deleted</span>;
                }
                return(
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td>{item.category.name}</td>
                        <td>{item.name}</td>
                        <td>{item.selling_price}</td>
                        <td><img src={`http://localhost:8000/${item.image}`} alt={item.name} width='50px'/></td>
                        <td><Link to={`edit-product/${item.id}`} className='btn btn-success btn-sm'> Edit</Link></td>
                        <td>{ProdStatus}</td>
                    </tr>
                )
            })
        }
        return(
        <div className='card mt-3'>
            <div className='card-header'>
                <h4>View Product <Link to="/admin/add-product" className='btn btn-primary btn-sm float-end'> Add Product</Link></h4>
            </div>
            <div className='card-body'>
                <div className='table-responsive'>
                    <table className='table table-bordered table-striped'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Category Name</th>
                                <th>Product Name</th>
                                <th>Selling Price</th>
                                <th>Image</th>
                                <th>Edit</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {display_produtdata}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ViewProduct;