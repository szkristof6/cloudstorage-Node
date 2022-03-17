import { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { FetchContext } from './FetchContext';

const FileContext = createContext();
const { Provider } = FileContext;

const FileProvider = ({ children }) => {
  const [pageData, setPageData] = useState([]);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [contextMenu, setContextMenu] = useState({
    isOn: false,
    show: '',
    position: {
      x: 0,
      y: 0,
    },
  });

  const Location = useLocation();
  const [pageID, setPageID] = useState(Location.pathname.split('/').pop());

  const { authAxios } = useContext(FetchContext);

  const fileUpload = async (files) => {
    const API_URL = '/api';

    console.log(files);

    const formData = new FormData();

    for (const i of files) formData.append('files', i);

    try {
      const { data } = await axios.post(`${API_URL}/upload?PGID=${pageID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await getData();

      return data;
    } catch (error) {
      new Error(error);
    }
  };

  const getData = async () => {
    try {
      const location = Location.pathname.split('/').pop();
      setPageID(location);
      const { data } = await authAxios.get('/', {
        params: {
          PGID: pageID || location,
        },
      });

      const { queryData, queryItems } = data;

      setPageData(queryData);
      setFolders(queryItems.dirs);
      setFiles(queryItems.files);

      return true;
    } catch (error) {
      throw new Error(error);
    }
  };

  const replaceItem = async (from, to) => {
    try {
      const { data } = await authAxios.post('/replace', {
        from,
        to,
      });

      if (data.ok === 1) return true;
    } catch (error) {
      throw new Error(error);
    }
  };

  const postionXY = (event) => {
    let Xoffset = 0;
    let Yoffset = 0;

    if (window.innerWidth - event.clientX <= 350) {
      Xoffset = 350;
    }
    if (window.innerHeight - event.clientY <= 160.85) {
      Yoffset = 160.85;
    }

    return {
      x: event.clientY - 70 - Yoffset,
      y: event.clientX - Xoffset,
    };
  };

  return (
    <Provider
      value={{
        fileUpload,
        getData,
        replaceItem,
        pageData,
        setPageData,
        folders,
        setFolders,
        files,
        setFiles,
        pageID,
        setPageID,
        contextMenu,
        setContextMenuOn: (event, show) => {
          const position = postionXY(event);

          // const { parentElement } = event.target;
          // const selectedElement = parentElement.href !== undefined ? parentElement.href : parentElement.querySelector('a').href;

          // console.log(parentElement, selectedElement);

          setContextMenu({ isOn: !contextMenu.isOn, show, position });
        },
        setContextMenuOff: () => {
          if (contextMenu.isOn) setContextMenu({ ...contextMenu, isOn: false });
        },
      }}
    >
      {children}
    </Provider>
  );
};

export { FileContext, FileProvider };
