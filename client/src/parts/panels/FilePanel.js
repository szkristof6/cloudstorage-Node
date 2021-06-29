import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

import Selectable from 'selectable.js';

const FilePanel = ({pageID, setPageID, loading, setSelected, setFolders, setFiles, folders, files}) => {
    const [ settings, setSettings ] = useState({
        sortDesc: true,
        sortType: 'name'
    });

    const setSelectable = () => {
        const selectionArea = document.querySelector("#dragarea");
        const selectableItems = selectionArea.querySelectorAll(".grid-item");

        const selectable = new Selectable({
                filter: selectableItems,
                appendTo: selectionArea,
                autoScroll: {
                    threshold: 0,
                    increment: 20,
                },
                lasso: {
                    zIndex: 10,
                    border: "1px solid #d4d4d4",
                    background: "rgba(194, 194, 194, 0.1)",
                    boxShadow: "0px 0px 5px 3px rgba(244, 244, 244, 1)",
                },
                toggle: true,
                ignore: ['.order i', '.order span'],
                saveState: true,
                autoRefresh: true,
        });

        selectable.on("start", () => {
            const selectedItems = selectable.getSelectedItems();
            selectable.deselect(selectedItems);

            setSelected([]);
        });

        selectable.on("end", (_, selection) => {
            const newSelected = [];
            selection.forEach(select => {
                const {node} = select;
                const link = node.querySelector("a");

                const splitted = link.href.split("/");
                const data = {
                    type: splitted[4],
                    id: splitted[5],
                    elem: link
                };
                newSelected.push(data);
                
            });
            setSelected(newSelected);
        });
    };

    useEffect(() => !loading && setSelectable(), [loading, pageID]);

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

    const history = useHistory();

    return (
        <div className="file-panel">
            <div className="dragarea" id="dragarea">
                <div className="dirs">
                    <div className="type-row">
                        <div className="m-name">Mappák</div>
                        <div className="order">
                            <span className="o-type">Név</span>
                            { settings.sortDesc ? <i onClick={changeSort} className="fas fa-arrow-up"></i> : <i onClick={changeSort} className="fas fa-arrow-down"></i> }
                        </div>
                    </div>
                    <div className="grid">
                        {
                        folders ? folders.map(dir => (
                            <div className="grid-item" key={dir._id}>
                                <Link className="button" onClick={e => e.preventDefault()} onDoubleClick={() => {
                                    history.push(`/drive/folder/${dir._id}`);
                                    setPageID(dir._id)
                                    }} to={`/drive/folder/${dir._id}`} >
                                    <i className="fas fa-folder"></i>
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
                        files ? files.map(file => (
                            <div className="grid-item" key={file._id}>
                                <div className="preview">
                                    <i className={file.meta.icon}></i>
                                </div>
                                <Link className="button" onClick={e => e.preventDefault()} to={`/drive/file/${file._id}`} >
                                    <i className={file.meta.icon}></i>
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
