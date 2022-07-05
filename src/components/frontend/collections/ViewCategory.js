
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

function ViewCategory()
{
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const style = {position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"};
    const [category, setCategory] = useState([]);

    useEffect(() => {
        let isMounted = true;
      axios.get(`/api/getCategory`).then(res =>{
        if(isMounted)
        {
            if(res.data.status === 200)
            {
                setCategory(res.data.category);
                setLoading(false);
            }
            else
            {
               toast.info("Sorry, no data available at the moment", {position: 'bottom-center', theme: 'colored'});
               history.push('/');
            }
        }
      });
      return() =>{
        isMounted = false;
     };
    },[history]);
    
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
            var showCategoryList = '';
            showCategoryList = category.map((item) =>{
                return(
                    <div className='col-md-4' key={item.id}>
                    <div className='card mt-4'>
                        <Link to={`/collections/${item.slug}`}>
                            <img src={`http://localhost:8000/${item.image}`} className='w-100' alt={item.name} />
                        </Link>
                        <div className='card-body'>
                        <Link to={`/collections/${item.slug}`}>
                            <h5>{item.name}</h5>
                            </Link>
                        </div>
                    </div>
                </div>
                )
            });
        }
    return(
        <div>
        <div className='py-3 bg-warning'>
            <div className='container'>
                <h6>Collections Category</h6>
            </div>
        </div>

            <div className='py-3'>
                <div className='container'>
                    <div className='row'>
                        {showCategoryList}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewCategory;