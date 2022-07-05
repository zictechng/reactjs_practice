
import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ViewCategory(){

        const [loading, setLoading] = useState(false);
        const [categorylist, setCategorylist] = useState([]);
        const style = {position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"};
        //const style = {textAlign: 'center'};
        /* this will fetch data automatically as the page load with the api request */
        useEffect(() => {
            setLoading(true);
         axios.get(`/api/view-category`).then(res =>{
            if(res.status === 200)
            {
                setCategorylist(res.data.category);
            }
            setLoading(false);
         })
        }, []);
        /* auto fetch ends here ... */

        /* this will send delete request to api and delete data */
        const deleteCategory = (e, id) =>{
            e.preventDefault();
            const thisClicked = e.currentTarget;
            thisClicked.innerHTML = "<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span><span class='sr-only'></span>"
            /* send the request using axios */
            axios.delete(`/api/delete-category/${id}`).then(res =>{
                if(res.data.status ===200)
                {
                    toast.success(res.data.message);
                    thisClicked.closest("tr").remove();
                }
                else if(res.data.status === 404)
                {
                    toast.warning(res.data.message);
                    thisClicked.innerText ="Delete";
                }
            })
        }
        /* delete request ends here ... */
        
        /* define variable to assign display data here */
        var Viewcategory_HTMLTABLE = "";
        //var DisplayLogo = <h4>Loading category list..</h4>;
        /* ends here.. */
        if(loading)
        {
            return(
            <div style={style}>
                    loading <div className="spinner-border spinner-border-sm" role="status">
                    </div>
            </div>               
            )
        }
        else
        {
            /* display the fetch data via html table here ... */
            Viewcategory_HTMLTABLE =
            categorylist.map( (item) =>{
                return(
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.slug}</td>
                        <td>{item.status}</td>
                        <td><Link to={`edit-category/${item.id}`} className="btn btn-success btn-sm ">Edit</Link></td> 
                        <td><button type="button" onClick={ (e) => deleteCategory(e, item.id)} className="btn btn-danger btn-sm ">Delete</button></td> 

                    </tr>
                )
            });
        }
        
    return(
        <div className='card mt-3'>
        <div className="card-header">
            <h4> Category List <Link to="/admin/add-category" className="btn btn-primary btn-sm float-end">Add Category</Link></h4>
            
        </div>
            <div className="card-body">
                <div className='table-responsive'>
                 <table className="table table-bordered table-striped" >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Status</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {Viewcategory_HTMLTABLE}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    )
}

export default ViewCategory;