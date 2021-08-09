import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus, faFileUpload, faUpload } from '@fortawesome/free-solid-svg-icons';

import { FileContext } from '../../services/FileContext';

const dropdownMenu = [
  {
    type: 'modal',
    label: 'Mappa létrehozása',
    icon: faFolderPlus,
    onClick: (e) => console.log(e),
  },
  {
    type: 'input',
    label: 'Fájl feltöltés',
    icon: faFileUpload,
    id: 'file',
  },
  {
    type: 'input',
    label: 'Mappa feltöltés',
    icon: faUpload,
    id: 'directory',
  },
];

const Create = ({ id }) => {
  const [files, setFiles] = useState('');

  const fileContext = useContext(FileContext);
  const { fileUpload } = fileContext;

  const upload = async () => {
    if (files) {
      const data = await fileUpload(files);

      console.log(data);
    }
  };

  useEffect(() => upload(), [files]);

  return (
    <div className="dropdown-menu" id={id} role="menu">
      <div className="dropdown-content">
        <ul className="d-ul">
          {dropdownMenu.map((item, index) => (
            <li key={index}>
              {item.type === 'modal' ? (
                <Link onClick={item.onClick} to={'#'} className="modal-button">
                  <FontAwesomeIcon icon={item.icon}></FontAwesomeIcon>
                  {item.label}
                </Link>
              ) : (
                item.type === 'input' && (
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
                )
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Create;
