import { useState, useEffect, useCallback, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom';

import InfoPanel from './panels/InfoPanel';
import Grid from './panels/Grid';
import Table from './panels/Table';
import Message from './form/Message';

import { APIFetch } from '../services/API';
import { FetchContext } from '../services/FetchContext';
import { FileContext } from '../services/FileContext';

const Area = () => {
    const [ loading, setLoading ] = useState(true);
    const [ selected, setSelected ] = useState([]);

    const [ settings, setSettings ] = useState({
        sortDesc: true,
        sortType: 'name',
        InfoPanelOn: false,
        showGrid: true
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
        pageData
    } = fileContext;

    const sortByName = (x, y) => {
        let a = x.name.toUpperCase(),
            b = y.name.toUpperCase();

        if(settings.sortDesc)
            return a === b ? 0 : a > b ? 1 : -1;
        return a === b ? 0 : a > b ? -1 : 1;
    }

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
            InfoPanelOn: !settings.InfoPanelOn
        });
    };

    const changeViewMode = () => {
        setSettings({
            ...settings,
            showGrid: !settings.showGrid
        });
    };

    useEffect(() => handleLoading(), [pageID]);

    const [requestError, setRequestError] = useState();

    const handleLoading = useCallback(async () => {
        try {
            setLoading(true);
            await getData();

            setRequestError('')

            setLoading(false);
        } catch (error) {
            setRequestError(error.message)
            setLoading(false);
        }
    });

    return (
        <div className="area">
            {
                loading ? <div className="loader toltes"></div> : 
                requestError ? <Message state="is-danger" text={requestError} /> :
                    <form className="a-form" method="post" encType="multipart/form-data" style={{display: 'block'}}>
                    <div className="file-area">
                        <div className="file-menu">
                            <div className="tabs is-boxed">
                                <ul>
                                {
                                    pageData.length > 0 &&
                                    pageData.map((url) => (
                                        <li key={url[0]._id}>
                                            {
                                                pageID === 'my-drive' ? <a>{url[0].name}</a> : url[0]._id === 0 ? <Link onClick={() => setPageID('my-drive')} to={`/drive/my-drive`}>{url[0].name}</Link> : <Link onClick={() => setPageID(url[0]._id)} to={`/drive/folder/${url[0]._id}`}>{url[0].name}</Link>
                                            }
                                        </li>
                                    ))
                                }
                                </ul>
                            </div>
                            <div className="info">
                            {
                                selected.length === 1 && 
                                <div className="i-icon">
                                    <i className="fas fa-share-square" title={`${selected.length} elem megosztása`} aria-hidden="true"></i>
                                </div>
                            }
                            {
                                selected.length > 0 && 
                                <>
                                <div className="i-icon">
                                    <i className="fas fa-trash" title={`${selected.length} elem törlése`} aria-hidden="true"></i>
                                </div>
                                <div className="i-icon">
                                    <i className="fas fa-download" title={`${selected.length} elem letöltése`} aria-hidden="true"></i>
                                </div>
                                <div className="i-icon">
                                    <i className="fas fa-ellipsis-v" title={`További műveletek`} aria-hidden="true"></i>
                                </div>
    
                                <div className="v-divider"></div>
                                </>
                            }
                                <div className="i-icon" onClick={changeViewMode}>
                                    {
                                        settings.showGrid ? <i className="fas fa-bars" title={`Listanézet`} aria-hidden="true"></i> : <i className="fas fa-table" title={`Rácsnézet`} aria-hidden="true"></i>
                                    }
                                </div>
                                <div className={`i-icon ${settings.InfoPanelOn && 'active'}`} onClick={openInfo}>
                                    <i className="fas fa-info-circle" title={`Részletek megjelenítése`} aria-hidden="true"></i>
                                </div>
                            </div>
                        </div>
                        <div className="file-panel">
                        {
                            settings.showGrid ? 
                                <Grid pageID={pageID} loading={loading} setSelected={setSelected} setPageID={setPageID} settings={settings} changeSort={changeSort} folders={folders} files={files} />
                                : <Table pageID={pageID} loading={loading} setSelected={setSelected} setPageID={setPageID} settings={settings} changeSort={changeSort} folders={folders} files={files} />
                        }
                            <InfoPanel selected={selected} folders={folders} files={files} settings={settings} selected={selected} pageData={pageData} closeInfo={openInfo} />
                        </div>
        
                    </div>
                    <input type="file" id="file" style={{display: 'none'}} webkitdirectory="" directory="" multiple="" />
                </form>
            }
        </div>
    );
}

export default Area;
