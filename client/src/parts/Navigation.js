import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../services/authContext';

import { APIFetch } from '../services/Public';
import { humanReadableByte } from '../global';

const navItems = [
  {
    label: 'Saját mappa',
    path: '/drive/my-drive',
    icon: 'fas fa-folder',
    active: true,
    allowedRoles: ['user', 'admin']
  },
  {
    label: 'Megosztottak',
    path: '',
    icon: 'fas fa-share-alt',
    active: false,
    allowedRoles: ['user', 'admin']
  },
  {
    label: 'Kuka',
    path: '',
    icon: 'fas fa-trash',
    active: false,
    allowedRoles: ['user', 'admin']
  },
];

const Navigation = () => {
  const [ storage, setStorage ] = useState([]);

    const fetchStorage = async () => {
      const { data } = await APIFetch.get('getStorage');
      setStorage(data);
    };

    useEffect(() => fetchStorage(), []);

    const auth = useContext(AuthContext);
    const { role } = auth.authState.userInfo;

  return (
    <div className="navbar">
      <div className="dropdown" id="new">
        <div className="dropdown-trigger">
          <button className="button is-medium is-rounded new" aria-haspopup="true" aria-controls="dropdown-menu">
              <i className="fas fa-plus"></i><span>Új</span></button>
        </div>
      </div>
      <ul className="n-ul">
        {
          navItems.map((item, index) => (
            <React.Fragment key={index}>
            {
              item.allowedRoles.includes(role) && 
                <li title={item.label}>
                  <a className={item.active ? "active" : ""} href={item.path}><i className={item.icon}></i>{item.label}</a>
                </li>
            }
            </React.Fragment>
          ))
        }
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
