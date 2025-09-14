import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {

  return (
      <footer className="bg-light text-center py-2 w-100 navbar bg-dark bg-opacity-75">
        <Link to="#" className="navbar-brand ps-5">Form Builder</Link>
        <p className="m-3 pe-3 b-2 pe-5">&copy; 2025 all rights reserved</p>
      </footer>
  );
};

export default Footer;