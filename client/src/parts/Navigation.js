//import { useState, useEffect } from 'react';

const Navigation = () => {
  return (
    <div className="navbar">
      <div className="dropdown" id="new">
        <div className="dropdown-trigger">
          <button className="button is-medium is-rounded new" aria-haspopup="true" aria-controls="dropdown-menu">
              <i className="fas fa-plus"></i><span>Új</span></button>
        </div>
      </div>
      <ul className="n-ul">
        <li>
          <a className="active" href="#"><i className="fas fa-folder"></i> Saját mappa</a>
        </li>
        <li><a href="#"><i className="fas fa-share-alt"></i> Megosztottak</a></li>
        <li>
          <a href="#"><i className="fas fa-trash"></i> Kuka</a>
        </li>
        <hr className="navbar-divider" />
        <li><a href="#"><i className="far fa-hdd"></i> Tárhely</a></li>
      </ul>
      <div className="storage">
        <progress className="progress is-link" value="15" max="100">15%</progress>
        30 TB  / 200 PB felhasználva
      </div>
    </div>
  );
}

export default Navigation;
