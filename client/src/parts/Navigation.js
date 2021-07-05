import { useState, useEffect } from 'react';

import { getStorage } from '../API';
import { humanReadableByte } from '../global';

const Navigation = () => {
  const [ storage, setStorage ] = useState([]);

    useEffect(() => {
      const fetchStorage = async () => {
        const query = await getStorage();
        setStorage(query);
      };
      
    fetchStorage();
    }, []);


  return (
    <div className="navbar">
      <div className="dropdown" id="new">
        <div className="dropdown-trigger">
          <button className="button is-medium is-rounded new" aria-haspopup="true" aria-controls="dropdown-menu">
              <i className="fas fa-plus"></i><span>Új</span></button>
        </div>
      </div>
      <ul className="n-ul">
        <li title={`Saját mappa`}>
          <a className="active" href="#"><i className="fas fa-folder"></i> Saját mappa</a>
        </li>
        <li title={`Megosztottak`}>
          <a href="#"><i className="fas fa-share-alt"></i> Megosztottak</a></li>
        <li title={`Kuka`}>
          <a href="#"><i className="fas fa-trash"></i> Kuka</a>
        </li>
        <hr className="navbar-divider" />
        <li title={`Tárhely`}>
          <a href="#"><i className="far fa-hdd"></i> Tárhely</a></li>
      </ul>
      <div className="storage">
        <progress className="progress is-link" value={storage.remaining} max={storage.size}>{(storage.size/storage.remaining).toFixed(0)}</progress>
        {humanReadableByte(storage.remaining)} / {humanReadableByte(storage.size)} felhasználva
      </div>
    </div>
  );
}

export default Navigation;
