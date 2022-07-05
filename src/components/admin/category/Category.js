import axios from 'axios';
import React from 'react';
import {toast } from 'react-toastify';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Category(){
    
    const [categoryInput, setCategory] = useState({
        slug:'',
        name:'',
        description:'',
        status:'',
        meta_tile:'',
        meta_keyword:'',
        meta_descrip:'',
        error_list:[],
        
    });


    const handleInput = (e) =>{
        e.persist();
        setCategory({...categoryInput, [e.target.name]: e.target.value})
    }
    const submitCategory = (e) =>{
        e.preventDefault();
        const data = {
            slug:categoryInput.slug,
            name:categoryInput.name,
            description:categoryInput.description,
            status:categoryInput.status,
            meta_tile:categoryInput.meta_tile,
            meta_keyword:categoryInput.meta_keyword,
            meta_descrip:categoryInput.meta_descrip,
        }
        axios.post(`/api/store-category`,data).then(res =>{
            if(res.data.status===200)
            {
                toast.success(res.data.message);
                 document.getElementById("category_form").reset();
            }
            else if(res.data.status === 400)
            {
                setCategory({...categoryInput, error_list:res.data.errors});
            }
        });
    }
    /* this will desplay error as a list in the page at once */
    // var display_errors = [];
    // if(categoryInput.error_list)
    // {
    //     display_errors = [
    //         categoryInput.error_list.slug,
    //         categoryInput.error_list.name,
    //         categoryInput.error_list.meta_tile
    //     ]
    // }
    /* ends here ... */
    return(
       <div className='container-fluid px-4'>
        <h3 className='mt-4'> Category <Link to="/admin/view-category" className="btn btn-info btn-sm float-end">View Category</Link></h3>
       
        {/* {
            display_errors.map((item) =>{
                return (<p className='text-danger mb-1' key={item}>{item}</p>)
            })
        } */}
    <form onSubmit={submitCategory} id="category_form" >
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
                   <span className='text-danger'>{categoryInput.error_list.slug}</span>
                   </div>
                   <div className='form-group mb-3'>
                    <label>Name</label>
                    <input type="text" name='name' onChange={handleInput} value={categoryInput.name} className='form-control'></input>
                    <span className='text-danger'>{categoryInput.error_list.name}</span>
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
                    <input type="text" name='meta_tile' onChange={handleInput} value={categoryInput.title} className='form-control'></input>
                    <span className='text-danger'>{categoryInput.error_list.meta_tile}</span>
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
export default Category;