import { useState, useEffect } from 'react';
import { getStorage } from '../API';


const humanReadableByte = (fileSizeInBytes) => {
  let i = -1;
  const byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
  do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(0) + byteUnits[i];
};

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
        <progress className="progress is-link" value={storage.remaining} max={storage.size}>{(storage.size/storage.remaining).toFixed(0)}</progress>
        {humanReadableByte(storage.remaining)} / {humanReadableByte(storage.size)} felhasználva
      </div>
    </div>
  );
}

export default Navigation;
