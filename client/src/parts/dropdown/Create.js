import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FileContext } from '../../services/FileContext';

const dropdownMenu = [
    {
        type: 'modal',
        label: 'Mappa létrehozása',
        icon: 'fas fa-folder-plus',
        onClick: (e) => console.log(e),
    },
    {
        type: 'input',
        label: 'Fájl feltöltés',
        icon: 'fas fa-file-upload',
        id: 'file',
    },
    {
        type: 'input',
        label: 'Mappa feltöltés',
        icon: 'fas fa-upload',
        id: 'directory'
    },
  ];

const Create = ({id}) => {
  const [ files, setFiles ] = useState('');
  
  const fileContext = useContext(FileContext);
  const { fileUpload } = fileContext;

  useEffect(async () => {
    if(files) {
      const data = await fileUpload(files);

      console.log(data);
    }
  }, [files])


  return (
    <div className="dropdown-menu" id={id} role="menu">
        <div className="dropdown-content">
            <ul className="d-ul">
            {
                dropdownMenu.map((item, index) => (
                    <li key={index}>
                        {
                            item.type === 'modal' ? 
                            <Link onClick={item.onClick} to={'#'} className="modal-button">
                                <i className={item.icon}></i>
                                {item.label}
                            </Link>
                            : item.type === 'input' && 
                            <a>
                                <i className={item.icon}></i>
                                {
                                  item.id === 'directory' ? 
                                  <input type="file" name="files" id={item.id} onChange={(e) => setFiles(e.target.files)} multiple webkitdirectory="true" directory="true" style={{'display': 'none'}} ></input>
                                  : <input type="file" name="files" id={item.id} onChange={(e) => setFiles(e.target.files)} multiple style={{'display': 'none'}} ></input>
                                }
                                <label htmlFor={item.id}>{item.label}</label>
                            </a>
                        }
                    </li>
                ))
            }
            </ul>
        </div>
    </div>
  );
};

export default Create;