import React from 'react';
import Publicroutelist from '../../routes/Publicroutelist';
import {Route, Switch } from 'react-router-dom';
import Navbar from '../../layouts/frontend/Navbar';

const FrontendLayout = () =>{
return(
    <div>
         <Navbar />
                    <div>
               
                        <Switch>
                            {Publicroutelist.map((routedata, idx) =>{
                                return(
                                    routedata.component && (
                                        <Route
                                        key={idx}
                                        path={routedata.path}
                                        exact={routedata.exact}
                                        name={routedata.name}
                                        render={(props) => (
                                        <routedata.component{ ...props} />
                                        )} 
                                        />
                                    )
                                )
                            })}
                           
                        </Switch>
                        
                    </div>
            </div>

   
)
}

export default FrontendLayout;