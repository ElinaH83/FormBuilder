import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainPage = () => {

    return (
        <div className="min-vh-100 d-flex flex-column justify-content-between" style={{ background: 'linear-gradient(to bottom, #B8C6FF, #EEFFCF)' }}>
            <div>
                <Navbar/>

                <div className="text-center mt-5">
                    <h1 className="display-3 font-weight-bold pt-5 mt-5 fw-bold">Build forms without coding</h1>
                    <p className="lead pt-4 m-3">Create and manage forms easily with our no-code platform</p>
                    <Link to="/design-form" className="btn btn-dark btn-lg bt-5 m-4 p-3 fw-bold">Create Form</Link>
                </div>
            </div>

            <Footer/>
        </div>
    );
};

export default MainPage;