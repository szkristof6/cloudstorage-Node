import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShareSquare,
  faTrash,
  faDownload,
  faEllipsisV,
  faBars,
  faTable,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import InfoPanel from './panels/InfoPanel';
import Grid from './panels/Grid';
import Table from './panels/Table';
import Message from './form/Message';
import Loader from './Loader';

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

  const fileContext = useContext(FileContext);
  const { fileUpload, getData, folders, setFolders, files, setFiles, pageID, setPageID, pageData } =
    fileContext;

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

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles) {
      const data = await fileUpload(acceptedFiles);

      console.log(data);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const iconList = [
    {
      icon: faShareSquare,
      title: `${selected.length} elem megosztása`,
      visibility: 'one',
      show: true,
      onClick: (e) => console.log(e),
    },
    {
      icon: faTrash,
      title: `${selected.length} elem törlése`,
      visibility: 'multiple',
      show: true,
      onClick: (e) => console.log(e),
    },
    {
      icon: faDownload,
      title: `${selected.length} elem letöltése`,
      visibility: 'multiple',
      show: true,
      onClick: (e) => console.log(e),
    },
    {
      icon: faEllipsisV,
      title: `További műveletek`,
      visibility: 'multiple',
      show: true,
      onClick: (e) => console.log(e),
    },
    {
      icon: faBars,
      title: `Listanézet`,
      visibility: 'always',
      show: settings.showGrid,
      onClick: () => changeViewMode(),
    },
    {
      icon: faTable,
      title: `Rácsnézet`,
      visibility: 'always',
      show: !settings.showGrid,
      onClick: () => changeViewMode(),
    },
    {
      icon: faInfoCircle,
      title: `Részletek megjelenítése`,
      visibility: 'always',
      show: true,
      class: settings.InfoPanelOn ? 'active' : '',
      onClick: () => openInfo(),
    },
  ];

  const iconListPaint = (icon, index) => (
    <div className={`i-icon ${icon.class || ''}`} key={index} onClick={icon.onClick}>
      <FontAwesomeIcon icon={icon.icon} title={icon.title} aria-hidden="true"></FontAwesomeIcon>
    </div>
  );

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
                        {pageID === 'my-drive' || 'trash' ? (
                          <a>{url.name}</a>
                        ) : url._id === 0 ? (
                          <Link onClick={() => setPageID('my-drive')} to={`/drive/my-drive`}>
                            {url.name}
                          </Link>
                        ) : (
                          <Link onClick={() => setPageID(url._id)} to={`/drive/folder/${url._id}`}>
                            {url.name}
                          </Link>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
              <div className="info">
                {selected.length === 1 &&
                  iconList
                    .filter((icon) => icon.visibility === 'one' && icon.show)
                    .map((icon, index) => iconListPaint(icon, index))}
                {selected.length > 0 &&
                  iconList
                    .filter((icon) => icon.visibility === 'multiple' && icon.show)
                    .map((icon, index) => iconListPaint(icon, index))}
                {selected.length > 0 && <div className="v-divider"></div>}
                {iconList
                  .filter((icon) => icon.visibility === 'always' && icon.show)
                  .map((icon, index) => iconListPaint(icon, index))}
              </div>
            </div>
            <div className="file-panel">
              <div className={`dragarea ${isDragActive && 'is-dragover'}`} {...getRootProps()}>
                <input {...getInputProps()} />
                {settings.showGrid ? (
                  <Grid
                    loading={loading}
                    setSelected={setSelected}
                    settings={settings}
                    changeSort={changeSort}
                    dragActive={isDragActive}
                  />
                ) : (
                  <Table
                    loading={loading}
                    setSelected={setSelected}
                    settings={settings}
                    changeSort={changeSort}
                    dragActive={isDragActive}
                  />
                )}
              </div>
              <InfoPanel selected={selected} settings={settings} closeInfo={openInfo} />
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default Area;
