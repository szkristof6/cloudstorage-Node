import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'

import FilePanel from './panels/FilePanel';
import InfoPanel from './panels/InfoPanel';

const Area = () => {
    const [ loading, setLoading ] = useState(true);
    const [ selected, setSelected ] = useState([]);

    const location = useLocation().pathname.split('/');
    const [pageID, setPageID] = useState(location.pop());

    const [ pageData, setPageData ] = useState([]);

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
                                pageData[0].path.map((path, index) => (
                                    <li key={index}><a>{path}</a></li>
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
                <FilePanel pageID={pageID} setLoading={setLoading} selected={selected} setSelected={setSelected} setPageData={setPageData} />
                <InfoPanel />
            </div>
            <input type="file" id="file" style={{display: 'none'}} webkitdirectory="" directory="" multiple="" />
            </form>
        </div>
    );
}

export default Area;
