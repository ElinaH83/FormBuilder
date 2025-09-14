import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ExploreMain from './exploreMain';
import 'bootstrap/dist/css/bootstrap.min.css';
import './exploreContainer.css';

const ExplorePage = () => {
  return (
    <div className="min-vh-100 d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(to bottom, #B8C6FF, #EEFFCF)' }}>
      <Navbar />
      <div className="main" style={{paddingTop: "20px"}}>
        <ExploreMain />
      </div>
      <Footer />
    </div>
  );
};

export default ExplorePage;
