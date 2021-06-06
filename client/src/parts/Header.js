//import { useState, useEffect } from 'react';
import Logo from '../static/Logo.png';

const Header = () => {
  return (
    <div className="header">
      <div className="logo">
        <figure className="image is-48x48">
          <img className="is-rounded" alt="Logo" src={Logo} />
        </figure>
        <div className="s-name">Martin Cloud</div>
      </div>
      <div className="kereses"></div>
      <div className="fiok">
        <div className="logout">
          <a href="/logout"><i className="fas fa-sign-out-alt"></i></a>
        </div>
        <div className="profile">
          <div className="p-icon">K</div>
        </div>
      </div>
    </div>
  );
}

export default Header;
