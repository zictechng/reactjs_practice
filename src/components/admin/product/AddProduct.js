import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


function AddProduct(){

    const [productInput, setProduct] = useState({
        category_id: '',
        slug: '',
        name: '',
        description: '',

        meta_tile: '',
        meta_keyword: '',
        meta_descrip: '',

        selling_price:'',
        original_price:'',
        qty:'',
        brand: '',
    });
    const [picture, setPicture] = useState([]);
    const [error_list, setError] = useState([]);

    /* this handle inputs fields */
    const handleInput = (e) => {
        e.persist();
        setProduct({...productInput, [e.target.name]: e.target.value});
    }
    /* this handle image fields */
    const handleImage = (e) => {
        setPicture({image: e.target.files[0]});
    }

 /* fetch all category to populate the select fields */
    const [categorylist, setCategorylist] = useState([])
    /* this handle checkboxes fields */
    const [allcheckbox, setCheckboxes] = useState([]);
    const handleCheckbox = (e) => {
       setCheckboxes({...allcheckbox, [e.target.name]: e.target.checked});
   }
   
    useEffect(() => {
      axios.get(`/api/all-category`).then(res =>{
        if(res.data.status ===200)
        {
            setCategorylist(res.data.category);
        }
      });
    }, []);

    /* send all the input to api and save to database */
    const submitProduct = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('image', picture.image);

        formData.append('category_id', productInput.category_id);
        formData.append('slug', productInput.slug);
        formData.append('name', productInput.name);
        formData.append('description', productInput.description);

        formData.append('meta_tile', productInput.meta_tile);
        formData.append('meta_keyword', productInput.meta_keyword);
        formData.append('meta_descrip', productInput.meta_descrip);

        formData.append('selling_price', productInput.selling_price);
        formData.append('original_price', productInput.original_price);
        formData.append('qty', productInput.qty);
        formData.append('brand', productInput.brand);
        formData.append('featured', allcheckbox.featured ? '1' : '0');
        formData.append('popular', allcheckbox.popular ? '1':'0');
        formData.append('status', allcheckbox.status ? '1':'0');
       
        axios.post(`/api/store-product`, formData).then(res =>{
            if(res.data.status === 200)
            {
                toast.success(res.data.message);
                setProduct({...productInput,
                    category_id: '',
                    slug: '',
                    name: '',
                    description: '',

                    meta_tile: '',
                    meta_keyword: '',
                    meta_descrip: '',

                    selling_price:'',
                    original_price:'',
                    qty:'',
                    brand: '',
                    featured : '',
                    popular: '',
                    status: '',
                });
                setError([]);
            }
            else if(res.data.status === 403)
            {
                toast.warning(res.data.message, {position: 'top-center', theme: 'colored'});
                setError([]);
            }
            else if(res.data.status === 422)
            {
            toast.error('Required fields are missing', {position: 'top-center', theme: 'colored'});
                setError(res.data.errors);
            }
            else
            {
                toast.info("Something went wrong! Try again");
                setError([]);
            }
        })
    }
    return(
        <div className='container-fluid px-4'>
            <div className='card mt-4'>
                <div className='card-header'>
                    <h4> Add Product <Link to="/admin/view-product" className='btn btn-primary btn-sm float-end'> View Product</Link></h4>
                </div>
        <div className='card-body'>
            <form onSubmit={submitProduct} id="category_form" encType='multipart/form-data' >
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="seo-tags-tab" data-bs-toggle="tab" data-bs-target="#seo-tags" type="button" role="tab" aria-controls="seo-tags" aria-selected="false">SEO Tags</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="otherdetails-tab" data-bs-toggle="tab" data-bs-target="#otherdetails-tags" type="button" role="tab" aria-controls="otherdetails-tags" aria-selected="false">Other Details</button>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane card-body border fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    
                    <div className='form-group mb-3'>
                        <label>Select Category</label>
                        <select name='category_id' onChange={handleInput} value={productInput.category_id} className='form-control'>
                            <option>Select Category</option>
                            {
                                categorylist.map((item) =>{
                                    return (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                    )
                                })
                            }                         
                        </select>
                        <small className='text-danger'>{error_list.category_id}</small>
                    </div>
                    <div className='form-group mb-3'>
                        <label>Slug</label>
                        <input type="text" name='slug' onChange={handleInput} value={productInput.slug} className='form-control'></input>
                        <small className='text-danger'>{error_list.slug}</small>
                    </div>
                    <div className='form-group mb-3'>
                        <label>Name</label>
                        <input type="text" name='name' onChange={handleInput} value={productInput.name} className='form-control'></input>
                        <small className='text-danger'>{error_list.name}</small>
                    </div>
                    <div className='form-group mb-3'>
                        <label>Small Description</label>
                        <textarea name='description' onChange={handleInput} value={productInput.description} className='form-control'></textarea>
                    </div>
                    
                    </div>
                    
                    <div className="tab-pane card-body border fade show" id="seo-tags" role="tabpanel" aria-labelledby="seo-tags-tab">
                        <div className='form-group mb-3'>
                            <label>Title</label>
                            <input type="text" name='meta_tile' onChange={handleInput} value={productInput.title} className='form-control'></input>
                            <small className='text-danger'>{error_list.meta_tile}</small>
                        </div>

                        <div className='form-group mb-3'>
                            <label>Meta Keywords</label>
                            <textarea  name='meta_keyword' onChange={handleInput} value={productInput.meta_keyword} className='form-control' />
                        </div>
                        <div className='form-group mb-3'>
                            <label>Meta Description</label>
                            <textarea name='meta_descrip' onChange={handleInput} value={productInput.meta_descrip} className='form-control' />
                        </div>

                    </div>
                    
                    <div className="tab-pane card-body border fade show" id="otherdetails-tags" role="tabpanel" aria-labelledby="otherdetails-tab">
                    <div className='row'>
                        <div className='col-md-4 form-group mb-3'>
                            <label>Selling Price</label>
                            <input type="text" name='selling_price' onChange={handleInput} value={productInput.selling_price} className='form-control'></input>
                            <small className='text-danger'>{error_list.selling_price}</small>
                        </div>

                        <div className='col-md-4 form-group mb-3'>
                            <label>Original Price</label>
                            <input type='text' name='original_price' onChange={handleInput} value={productInput.original_price}  className='form-control' />
                            <small className='text-danger'>{error_list.original_price}</small>
                        </div>
                        <div className='col-md-4 form-group mb-3'>
                            <label>Quantity</label>
                            <input type='text' name='qty' onChange={handleInput} value={productInput.qty} className='form-control' />
                        </div>
                        <div className='col-md-4 form-group mb-3'>
                            <label>Brand</label>
                            <input type='text' name='brand' onChange={handleInput} value={productInput.brand} className='form-control' />
                            <small className='text-danger'>{error_list.Brand}</small>
                        </div>
                        <div className='col-md-4 form-group mb-3'>
                            <label>Image</label>
                            <input type='file' name='image' onChange={handleImage} className='form-control' />
                            <small className='text-danger'>{error_list.image}</small>
                        </div>
                        <br />
                        <div className='col-md-4 form-group mb-3'>
                            <label>Featured (Checked=show)</label>
                            <input type='checkbox' name='featured' onChange={handleCheckbox} defaultChecked={allcheckbox.featured} className='w-50 h-50' />
                        </div>
                        <div className='col-md-4 form-group mb-3'>
                            <label>Popular (Checked=show)</label>
                            <input type='checkbox' name='popular' onChange={handleCheckbox} defaultChecked={allcheckbox.popular} className='w-50 h-50' />
                        </div>
                        <div className='col-md-4 form-group mb-3'>
                            <label>Status (Checked=show)</label>
                            <input type='checkbox' name='status' onChange={handleCheckbox} defaultChecked={allcheckbox.status} className='w-50 h-50' />
                        </div>
                        
                    </div>
                    </div>
                </div>
                <button type='submit' className='btn btn-primary px-4 float-end'> Submit</button>   
            </form>
        </div>
</div>

</div>
    )
}

export default AddProduct;