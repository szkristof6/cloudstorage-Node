import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom';

import Dragarea from './panels/Dragarea';
import InfoPanel from './panels/InfoPanel';

import { listAll } from '../API';

const Area = () => {
    const [ loading, setLoading ] = useState(true);
    const [ selected, setSelected ] = useState([]);

    const location = useLocation().pathname.split('/');
    const [pageID, setPageID] = useState(location.pop());

    const [ pageData, setPageData ] = useState([]);
    const [ folders, setFolders ] = useState([]);
    const [ files, setFiles ] = useState([]);

    const [ settings, setSettings ] = useState({
        sortDesc: true,
        sortType: 'name',
        InfoPanelOn: false,
    });

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
    }

    useEffect(() => getData(), [pageID]);

    const getData = async () => {
        setLoading(true);

        const query = await listAll(pageID);

        const {queryData, queryItems} = query;

        setPageData(queryData);
        setFolders(queryItems.dirs);
        setFiles(queryItems.files);

        setLoading(false);
    };

    return (
        <div className="area">
            {loading && <div className="loader toltes"></div>}
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

                        <div className="i-icon">
                            <i className="fas fa-bars" title={`Listanézet`} aria-hidden="true"></i>
                        </div>
                        <div className={`i-icon ${settings.InfoPanelOn && 'active'}`} onClick={openInfo}>
                            <i className="fas fa-info-circle" title={`Részletek megjelenítése`} aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
                <div className="file-panel">
                    <Dragarea pageID={pageID} setPageID={setPageID} loading={loading} setSelected={setSelected} changeSort={changeSort} settings={settings} folders={folders} files={files} />
                    <InfoPanel selected={selected} folders={folders} files={files} settings={settings} selected={selected} pageData={pageData} closeInfo={openInfo} />
                </div>

            </div>
            <input type="file" id="file" style={{display: 'none'}} webkitdirectory="" directory="" multiple="" />
            </form>
        </div>
    );
}

export default Area;
