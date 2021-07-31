import { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

import InfoPanel from './panels/InfoPanel';
import Grid from './panels/Grid';
import Table from './panels/Table';
import Message from './form/Message';
import Loader from './Loader';

import { FetchContext } from '../services/FetchContext';
import { FileContext } from '../services/FileContext';

const Area = () => {
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  const [settings, setSettings] = useState({
    sortDesc: true,
    sortType: 'name',
    InfoPanelOn: false,
    showGrid: true,
  });

  const fetchContext = useContext(FetchContext);
  const fileContext = useContext(FileContext);
  const {
    getData,
    folders,
    setFolders,
    files,
    setFiles,
    pageID,
    setPageID,
    pageData,
  } = fileContext;

  const sortByName = (x, y) => {
    let a = x.name.toUpperCase(),
      b = y.name.toUpperCase();

    if (settings.sortDesc) return a === b ? 0 : a > b ? 1 : -1;
    return a === b ? 0 : a > b ? -1 : 1;
  };

  const changeSort = () => {
    setSettings({
      ...settings,
      sortDesc: !settings.sortDesc,
    });

    folders.sort(sortByName);
    setFolders(folders);

    files.sort(sortByName);
    setFiles(files);
  };

  const openInfo = () => {
    setSettings({
      ...settings,
      InfoPanelOn: !settings.InfoPanelOn,
    });
  };

  const changeViewMode = () => {
    setSettings({
      ...settings,
      showGrid: !settings.showGrid,
    });
  };

  useEffect(() => handleLoading(), [pageID]);

  const [requestError, setRequestError] = useState();

  const handleLoading = async () => {
    try {
      setLoading(true);
      await getData();

      setRequestError('');

      setLoading(false);
    } catch (error) {
      setRequestError(error.message);
      setLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="area">
      {loading ? (
        <Loader active={true} color="is-white" label="Töltés..." />
      ) : requestError ? (
        <Message state="is-danger" text={requestError} />
      ) : (
        <form
          className="a-form"
          method="post"
          encType="multipart/form-data"
          style={{ display: 'block' }}
        >
          <div className="file-area">
            <div className="file-menu">
              <div className="tabs is-boxed">
                <ul>
                  {pageData.length > 0 &&
                    pageData.map((url) => (
                      <li key={url._id}>
                        {pageID === 'my-drive' ? (
                          <a>{url.name}</a>
                        ) : url._id === 0 ? (
                          <Link
                            onClick={() => setPageID('my-drive')}
                            to={`/drive/my-drive`}
                          >
                            {url.name}
                          </Link>
                        ) : (
                          <Link
                            onClick={() => setPageID(url._id)}
                            to={`/drive/folder/${url._id}`}
                          >
                            {url.name}
                          </Link>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="info">
                {selected.length === 1 && (
                  <div className="i-icon">
                    <i
                      className="fas fa-share-square"
                      title={`${selected.length} elem megosztása`}
                      aria-hidden="true"
                    ></i>
                  </div>
                )}
                {selected.length > 0 && (
                  <>
                    <div className="i-icon">
                      <i
                        className="fas fa-trash"
                        title={`${selected.length} elem törlése`}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="i-icon">
                      <i
                        className="fas fa-download"
                        title={`${selected.length} elem letöltése`}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div className="i-icon">
                      <i
                        className="fas fa-ellipsis-v"
                        title={`További műveletek`}
                        aria-hidden="true"
                      ></i>
                    </div>

                    <div className="v-divider"></div>
                  </>
                )}
                <div className="i-icon" onClick={changeViewMode}>
                  {settings.showGrid ? (
                    <i
                      className="fas fa-bars"
                      title={`Listanézet`}
                      aria-hidden="true"
                    ></i>
                  ) : (
                    <i
                      className="fas fa-table"
                      title={`Rácsnézet`}
                      aria-hidden="true"
                    ></i>
                  )}
                </div>
                <div
                  className={`i-icon ${settings.InfoPanelOn && 'active'}`}
                  onClick={openInfo}
                >
                  <i
                    className="fas fa-info-circle"
                    title={`Részletek megjelenítése`}
                    aria-hidden="true"
                  ></i>
                </div>
              </div>
            </div>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
              )}
            </div>
            <div className="file-panel">
              {settings.showGrid ? (
                <Grid
                  pageID={pageID}
                  loading={loading}
                  setSelected={setSelected}
                  setPageID={setPageID}
                  settings={settings}
                  changeSort={changeSort}
                  folders={folders}
                  files={files}
                />
              ) : (
                <Table
                  pageID={pageID}
                  loading={loading}
                  setSelected={setSelected}
                  setPageID={setPageID}
                  settings={settings}
                  changeSort={changeSort}
                  folders={folders}
                  files={files}
                />
              )}
              <InfoPanel
                selected={selected}
                folders={folders}
                files={files}
                settings={settings}
                selected={selected}
                pageData={pageData}
                closeInfo={openInfo}
              />
            </div>
          </div>
          <input
            type="file"
            id="file"
            style={{ display: 'none' }}
            webkitdirectory=""
            directory=""
            multiple=""
          />
        </form>
      )}
    </div>
  );
};

export default Area;
