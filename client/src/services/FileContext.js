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

  const Location = useLocation();
  const [pageID, setPageID] = useState(Location.pathname.split('/').pop());

  const { authAxios } = useContext(FetchContext);

  const fileUpload = async (files) => {
    const API_URL = '/api';

    console.log(files);

    const formData = new FormData();

    for (const i of files) formData.append('files', i);

    try {
      const { data } = await axios.post(
        `${API_URL}/upload?PGID=${pageID}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      await getData();

      return data;
    } catch (error) {
      new Error(error);
    }
  };

  const getData = async () => {
    try {
      setPageID(Location.pathname.split('/').pop());
      const { data } = await authAxios.get('/', {
        params: {
          PGID: pageID,
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

  return (
    <Provider
      value={{
        fileUpload,
        getData,
        pageData,
        setPageData,
        folders,
        setFolders,
        files,
        setFiles,
        pageID,
        setPageID,
      }}
    >
      {children}
    </Provider>
  );
};

export { FileContext, FileProvider };
