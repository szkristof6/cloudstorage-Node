import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom';

import FilePanel from './panels/FilePanel';
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
                        <div className="i-icon">
                            <i className="fas fa-bars" aria-hidden="true"></i>
                        </div>
                        <div className="i-icon"><i className="fas fa-info-circle" aria-hidden="true"></i></div>
                    </div>
                </div>
                <FilePanel pageID={pageID} loading={loading} setSelected={setSelected} setFolders={setFolders} setFiles={setFiles} folders={folders} files={files} />
                <InfoPanel selected={selected} folders={folders} files={files} />
            </div>
            <input type="file" id="file" style={{display: 'none'}} webkitdirectory="" directory="" multiple="" />
            </form>
        </div>
    );
}

export default Area;
