// base imports
import React, { PureComponent } from 'react';
import './Impact.css';

function Impact() {
  
  return (
    <div className="Impact">
      <div className = 'impactContainer'>
        <div className = 'dashboard'>
          <div className = 'dashboardHeader'>
            <p className = 'dashboardTitle'>IMPACT DASHBOARD</p>
            <p className = 'carbonFootprint'>CARBON FOOTPRINT ⓘ</p>
            <p className = 'carbonFootprintValue'>1XXXXX kg CO2</p>
          </div>
          <p className = 'emissionsTitle'>EMISSIONS</p>
          <div className = 'dashboardContent'>
            <div className = 'dashboardLeft'>
              <p className = 'contentHeader'>Transactions</p>
              <p></p>
            </div>
            <div className = 'dashboardMiddle'>
              <p className = 'contentHeader'>Gas spent</p>

            </div>
            <div className = 'dashboardRight'>
              <p className = 'contentHeader'>CO2 produced</p>

            </div>
          </div>
          <p className = 'impactTitle'>IMPACT</p>
          <div className = 'dashboardContent'>
            <div className = 'dashboardLeft'>
              <p className = 'contentHeader'>NFTrees</p>

            </div>
            <div className = 'dashboardMiddle'>
              <p className = 'contentHeader'>CO2 offset</p>

            </div>
            <div className = 'dashboardRight'>
              <p className = 'contentHeader'>Trees planted</p>

            </div>
          </div>
          <div className = 'dashboardSummary'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. 
            Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus 
            nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
          </div>
        </div>
      </div>
    </div>
  );
}

export default Impact;