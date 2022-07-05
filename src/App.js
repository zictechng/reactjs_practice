import React from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import MasterLayout from "./layouts/admin/MasterLayout";

import Login from "./components/frontend/auth/Login";
import Register from "./components/frontend/auth/Register";
import Page403 from "./components/errors/Page403";
import Page404 from "./components/errors/Page404";
import AdminPrivateRoute from "./AdminPrivateRoute";
import axios from 'axios';

import PublicRoute from "./PublicRoute";

//this declear base url globally for the application to access
axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['accept'] = 'application-/json';
// ends here
axios.defaults.withCredentials = true;

/* this for setting token for logged in user to call when logging out */
axios.interceptors.request.use(function (config){
  const token = localStorage.getItem('auth_token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

function App() {
 return (
   <div className="App">
      <Router>
       <Switch>
         {/* <Route exact path="/" component={Home}/>
         <Route path="/about" component={About}/>
         <Route path="/contact" component={Contact}/> */}
          {/* Admin section protected route goes here */}
          <AdminPrivateRoute path="/admin" name="Admin" />
         {/* Admin section protected route ends here */}
         <PublicRoute path="/" name="Home" />
         <Route path="/403" component={Page403}/>
         <Route path="/404" component={Page404}/>
         
         {/* this will protect the route not to show if user have logged in already */}
         <Route path="/login">
          {localStorage.getItem('auth_token') ? <Redirect to='/' /> : <Login />}
         </Route>
         <Route path="/register">
          {localStorage.getItem('auth_token') ? <Redirect to='/' /> : <Register />}
         </Route>
         {/* Ends here  */}
         {/* <Route path="/admin" name="admin" render={(props) => <MasterLayout {...props}/>} /> */}
         
         {/* Let define another method of routes in reacjs, we are going to 
         have a separate route file to handle all route then call it here. */}
         

        

       </Switch>
       <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />
      </Router>
   </div>
 );
}

export default App;
