import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFolderPlus,
  faFileUpload,
  faUpload,
  faShareSquare,
  faPaperPlane,
  faFileSignature,
  faTrash,
  faDownload,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import { FileContext } from '../../services/FileContext';

const dropdownMenu = [
  {
    type: 'modal',
    label: 'Mappa létrehozása',
    icon: faFolderPlus,
    onClick: (e) => console.log(e, 'create a new folder'),
    show: ['create'],
  },
  {
    type: 'input',
    label: 'Fájl feltöltés',
    icon: faFileUpload,
    id: 'file',
    show: ['create'],
  },
  {
    type: 'input',
    label: 'Mappa feltöltés',
    icon: faUpload,
    id: 'directory',
    show: ['create'],
  },
  {
    type: 'modal',
    label: 'Megosztás',
    icon: faShareSquare,
    onClick: (e) => console.log(e, 'share'),
    show: ['item'],
  },
  {
    type: 'modal',
    label: 'Áthehyezés',
    icon: faPaperPlane,
    onClick: (e) => console.log(e, 'replace'),
    show: ['item'],
  },
  {
    type: 'modal',
    label: 'Átnevezés',
    icon: faFileSignature,
    onClick: (e) => console.log(e, 'rename'),
    show: ['item'],
  },
  {
    type: 'function',
    label: 'Részletek',
    icon: faInfoCircle,
    onClick: () => console.log('show details'),
    show: ['item'],
  },
  {
    type: 'function',
    label: 'Letöltés',
    icon: faDownload,
    onClick: () => console.log('download'),
    show: ['item'],
  },
  {
    type: 'modal',
    label: 'Törlés',
    icon: faTrash,
    onClick: (e) => console.log(e, 'delete'),
    show: ['item'],
  },
];

const ContextMenu = ({ id }) => {
  const [files, setFiles] = useState('');

  const fileContext = useContext(FileContext);
  const { fileUpload, contextMenu } = fileContext;

  const upload = async () => {
    if (files) {
      const data = await fileUpload(files);

      console.log(data);
    }
  };

  useEffect(() => upload(), [files]);

  return (
    <div
      className="dropdown-menu"
      id={id}
      role="menu"
      style={{ top: `${contextMenu.position.x}px`, left: `${contextMenu.position.y}px` }}
    >
      <div className="dropdown-content">
        <ul className="d-ul">
          {dropdownMenu.map((item, index) => (
            <React.Fragment key={index}>
              {item.show.includes(contextMenu.show) && (
                <li>
                  {item.type === 'modal' ? (
                    <Link onClick={item.onClick} to={'#'} className="modal-button">
                      <FontAwesomeIcon icon={item.icon}></FontAwesomeIcon>
                      {item.label}
                    </Link>
                  ) : item.type === 'input' ? (
                    <a>
                      <FontAwesomeIcon icon={item.icon}></FontAwesomeIcon>
                      {item.id === 'directory' ? (
                        <input
                          type="file"
                          name="files"
                          id={item.id}
                          onChange={(e) => setFiles(e.target.files)}
                          multiple
                          webkitdirectory="true"
                          directory="true"
                          style={{ display: 'none' }}
                        ></input>
                      ) : (
                        <input
                          type="file"
                          name="files"
                          id={item.id}
                          onChange={(e) => setFiles(e.target.files)}
                          multiple
                          style={{ display: 'none' }}
                        ></input>
                      )}
                      <label htmlFor={item.id}>{item.label}</label>
                    </a>
                  ) : (
                    item.type === 'function' && (
                      <a onClick={item.onClick}>
                        <FontAwesomeIcon icon={item.icon}></FontAwesomeIcon>
                        {item.label}
                      </a>
                    )
                  )}
                  {index % 3 === 0 && <hr className="navbar-divider"></hr>}
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContextMenu;
