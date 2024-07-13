import React from 'react';

import Dashboard from './Dashboard';
import Navbar from '../global/Navbar';
import Sidebar from '../global/Sidebar';

function StudentDashboard(){
        return (
            <div>
                <Navbar/>
                <div className="container-fluid" id="main">
                 <div className="row row-offcanvas row-offcanvas-left">
                   <Sidebar/>
                    
                  <Dashboard/>
                 
               
             </div>
            </div>  
        </div>  
        );
    }
 
export default StudentDashboard