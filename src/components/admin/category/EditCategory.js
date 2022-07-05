import axios from 'axios';
import React, { useEffect } from 'react';
import {toast } from 'react-toastify';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

function EditCategory(props){
    const [loading, setLoading] = useState(true);
    const history = useHistory();
    const [categoryInput, setCategory] = useState([]);
    const [error, setError] = useState([]);

    /* fetch the category details from databse with the ID pass to this page */
    useEffect(() => {
     const category_id = props.match.params.id;
     axios.get(`/api/edit-category/${category_id}`).then(res =>{
        if(res.data.status === 200)
        {
            setCategory(res.data.category); 
        }
        else if(res.data.status === 404)
        {
            toast.warning(res.data.message);
            history.push('/admin/view-category');
        }
        setLoading(false);
     });
    }, [props.match.params.id, history]);
    
    const handleInput = (e) =>{
        e.persist();
        setCategory({...categoryInput, [e.target.name]: e.target.value})
    }
    
    /* this will handle the update processing request to the api */
    const updateCategory = (e) => {
        e.preventDefault();
        const category_id = props.match.params.id;
        const data = categoryInput;
        axios.put(`/api/update-category/${category_id}`, data).then(res =>{

            if(res.data.status === 200)
            {
                toast.success(res.data.message);
                setError([]);
                history.push('/admin/view-category');
            }
            else if(res.data.status === 422)
            {
                toast.warning("Required data missing!");
                setError(res.data.errors);
            }
            else if(res.data.status === 400)
            {
                toast.warning(res.data.message);
                setError([]);
                history.push('/admin/view-category');
            }
            else
            {
                toast.info("Sorry, something went wrong!");
                setError([]);
            }
        });
    }
    
    if(loading)
        {
            return(
                <h4>Fetching data..</h4>
            )
        }
    return(
       <div className='container-fluid px-4'>
        <h3 className='mt-4'> Edit Category <Link to="/admin/view-category" className="btn btn-info btn-sm float-end">View Category</Link></h3>
       
        {/* {
            display_errors.map((item) =>{
                return (<p className='text-danger mb-1' key={item}>{item}</p>)
            })
        } */}
    <form onSubmit={updateCategory} >
        <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="seo-tags-tab" data-bs-toggle="tab" data-bs-target="#seo-tags" type="button" role="tab" aria-controls="seo-tags" aria-selected="false">SEO Tags</button>
            </li>
            
        </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane card-body border fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                   
                   <div className='form-group mb-3'>
                    <label>Slug</label>
                    <input type="text" name='slug' onChange={handleInput} value={categoryInput.slug} className='form-control'></input>
                     <small className='text-danger'>{error.slug}</small>
                   </div>
                   <div className='form-group mb-3'>
                    <label>Name</label>
                    <input type="text" name='name' onChange={handleInput} value={categoryInput.name} className='form-control'></input>
                    <small className='text-danger'>{error.name}</small>
                   </div>
                   <div className='form-group mb-3'>
                    <label>Description</label>
                    <textarea name='description' onChange={handleInput} value={categoryInput.description} className='form-control' />
                   </div>
                   <div className='form-group mb-3'>
                    <label>Status </label>
                    <input type="checkbox" name='status' onChange={handleInput} value={categoryInput.status} /> Status 0 = show, 1 = hidden
                   </div>
                </div>
                
            <div className="tab-pane card-body border fade show" id="seo-tags" role="tabpanel" aria-labelledby="seo-tags-tab">
                <div className='form-group mb-3'>
                    <label>Title</label>
                    <input type="text" name='meta_tile' onChange={handleInput} value={categoryInput.meta_tile} className='form-control'></input>
                    <small className='text-danger'>{error.meta_tile}</small>
                   </div>

                <div className='form-group mb-3'>
                    <label>Meta Keywords</label>
                    <textarea  name='meta_keyword' onChange={handleInput} value={categoryInput.meta_keyword} className='form-control' />
                </div>
                <div className='form-group mb-3'>
                    <label>Meta Description</label>
                    <textarea name='meta_descrip' onChange={handleInput} value={categoryInput.meta_descrip} className='form-control' />
                </div>

            </div>
            
        </div>
        <button type='submit' className='btn btn-primary px-4 float-end'> Submit</button>   
    </form>   
    </div>
    )
}
export default EditCategory;