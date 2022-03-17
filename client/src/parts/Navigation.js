import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../services/authContext';
import { FetchContext } from '../services/FetchContext';
import { FileContext } from '../services/FileContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faShareAlt, faTrash, faHdd, faPlus } from '@fortawesome/free-solid-svg-icons';

import { humanReadableByte } from '../global';
import ContextMenu from './dropdown/ContextMenu';

const Navigation = () => {
  const [storage, setStorage] = useState([]);

  const auth = useContext(AuthContext);
  const fetchContext = useContext(FetchContext);
  const { pageID, contextMenu, setContextMenuOn} = useContext(FileContext);
  const { role } = auth.authState.userInfo;

  const navItems = [
    {
      label: 'Saját mappa',
      path: '/drive/my-drive',
      icon: faFolder,
      active: !['trash', 'shared'].includes(pageID),
      allowedRoles: ['user', 'admin'],
    },
    {
      label: 'Megosztottak',
      path: '/drive/shared',
      icon: faShareAlt,
      active: pageID === 'shared',
      allowedRoles: ['user', 'admin'],
    },
    {
      label: 'Kuka',
      path: '/drive/trash',
      icon: faTrash,
      active: pageID === 'trash',
      allowedRoles: ['user', 'admin'],
    },
  ];

  const fetchStorage = useCallback(async () => {
    const { data } = await fetchContext.authAxios.get('getStorage');
    setStorage(data);
  });

  useEffect(() => fetchStorage(), []);

  return (
    <div className="navbar">
      <div className={`dropdown ${contextMenu.isOn ? 'is-active' : ''}`} id="new">
        <div className="dropdown-trigger">
          <button
            className="button is-medium is-rounded new"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
            onClick={(event) => setContextMenuOn(event, 'create')}
          >
            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
            <span>Új</span>
          </button>
        </div>
        <ContextMenu id="new" />
      </div>
      <ul className="n-ul">
        {navItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.allowedRoles.includes(role) && (
              <li title={item.label}>
                <a className={item.active ? 'active' : ''} href={item.path}>
                  <FontAwesomeIcon icon={item.icon}></FontAwesomeIcon>
                  {item.label}
                </a>
              </li>
            )}
          </React.Fragment>
        ))}
        <hr className="navbar-divider" />
        <li title={`Tárhely`}>
          <a href="#">
            <FontAwesomeIcon icon={faHdd}></FontAwesomeIcon> Tárhely
          </a>
        </li>
      </ul>
      <div className="storage">
        <progress className="progress is-link" value={storage.remaining} max={storage.size}>
          {(storage.size / storage.remaining).toFixed(0)}
        </progress>
        {humanReadableByte(storage.remaining)} / {humanReadableByte(storage.size)} felhasználva
      </div>
    </div>
  );
};

export default Navigation;
