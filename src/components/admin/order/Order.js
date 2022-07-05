import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


function Order()
{
    const [loading, setLoading] = useState(false);
    const style = {position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"};
    /* set array/variable to get/recieved the product details */
        const [orders, setOrders] = useState([])
    useEffect(() => {
       
        document.title = "Orders"; // this will show the page title name
        setLoading(true);
        axios.get(`/api/admin/orders`).then(res =>{
            if(res.data.status === 200)
            {
                setOrders(res.data.orders);
                setLoading(false);
            }
            
        });
        return () =>{
         
        };
    }, []);

     /* create veriable to hold the result data */
     var  display_orderdata = "";
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
            display_orderdata =  orders.map((item, i) =>{
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
                        <td>{item.tracking_no}</td>
                        <td>{item.phone}</td>
                        <td>{item.email}</td>
                        <td>{ProdStatus}</td>
                         <td><Link to={`view-order/${item.id}`} className='btn btn-success btn-sm'> View</Link></td>
                        
                    </tr>
                )
            })
        }
        return(
            <div className='card mt-3'>
                <div className='card-header'>
                    <h4>Order Details <Link to="/admin/view-product" className='btn btn-primary btn-sm float-end'> View Product</Link></h4>
                </div>
                <div className='card-body'>
                    <div className='table-responsive'>
                        <table className='table table-bordered table-striped'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Trancking No</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Action</th>                                    
                                </tr>
                            </thead>
                            <tbody>
                                {display_orderdata}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
}

export default Order;