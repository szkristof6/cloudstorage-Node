import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { listAll } from '../../API';
import { Selectables } from '../../selectables';

const FilePanel = ({pageID, setLoading, selected, setSelected}) => {
    const [ data, setData ] = useState([]);
    const [ settings, setSettings ] = useState({
        sortType: "DESC",
        dropdowns: [],
        sortIcon: null,

    });

    const getData = async () => {
        const query = await listAll(pageID);
        setData(query);
        setLoading(false);
    }

    useEffect(() => {
        getData();
    
        

    }, [pageID]);

    return (
        <div className="file-panel">
            <div className="dragarea" id="dragarea">
                <div className="dirs">
                    <div className="type-row">
                        <div className="m-name">Mappák</div>
                        <div className="order">
                            <span className="o-type">Név</span>
                                <i className="fas fa-arrow-up" aria-hidden="true"></i>
                        </div>
                    </div>
                    <div className="grid">
                        {
                        data.dirs ? data.dirs.map(dir => (
                            <div className="grid-item" key={dir._id}>
                                <Link className="button" to={`/drive/folder/${dir._id}`} >
                                    <i className="fas fa-folder" aria-hidden="true"></i>
                                    <span className="r-text">{dir.name}</span>
                                </Link>
                            </div>
                        )) : 'Nincs mappa..'
                        }
                    </div>
                </div>
                <div className="files">
                    <div className="type-row">
                        <div className="m-name">Fájlok</div>
                    </div>
                    <div className="grid">
                        {
                        data.files ? data.files.map(file => (
                            <div className="grid-item" key={file._id}>
                                <div className="preview">
                                    <i className="far fa-file-audio" aria-hidden="true"></i>
                                </div>
                                <Link className="button" to={`/drive/file/${file._id}`} >
                                    <i className="far fa-file-audio" aria-hidden="true"></i>
                                    <span className="r-text">{file.name}</span>
                                </Link>
                            </div>
                        )) : 'Nincs fájl..'
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FilePanel;
