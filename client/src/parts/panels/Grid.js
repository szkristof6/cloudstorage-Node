import { Link, useHistory } from 'react-router-dom';
import React, { useEffect, useContext } from 'react';
import { FileContext } from '../../services/FileContext';

import Selectable from 'selectable.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faFolder } from '@fortawesome/free-solid-svg-icons';

const Grid = ({ loading, setSelected, changeSort, settings }) => {
  const history = useHistory();

  const fileContext = useContext(FileContext);
  const { files, folders, setPageID, pageID } = fileContext;

  const setSelectable = () => {
    const selectionArea = document.querySelector('#gridPanel');
    const selectableItems = selectionArea.querySelectorAll('.grid-item');

    const selectable = new Selectable({
      filter: selectableItems,
      appendTo: selectionArea,
      autoScroll: {
        threshold: 0,
        increment: 20,
      },
      lasso: {
        zIndex: 10,
        border: '1px solid #d4d4d4',
        background: 'rgba(194, 194, 194, 0.1)',
        boxShadow: '0px 0px 5px 3px rgba(244, 244, 244, 1)',
      },
      toggle: true,
      ignore: ['.order i', '.order span'],
      saveState: true,
      autoRefresh: true,
    });

    selectable.on('start', () => {
      const selectedItems = selectable.getSelectedItems();
      selectable.deselect(selectedItems);

      setSelected([]);
    });

    selectable.on('end', (_, selection) => {
      const newSelected = [];
      selection.forEach((select) => {
        const { node } = select;
        const link = node.querySelector('a');

        const splitted = link.href.split('/');
        const data = {
          type: splitted[4],
          id: splitted[5],
          elem: link,
        };
        newSelected.push(data);
      });
      setSelected(newSelected);
    });
  };

  useEffect(() => !loading && setSelectable(), [loading, pageID]);

  return (
    <div id="gridPanel" className='dragarea'>
      <div className="dirs">
        <div className="type-row">
          <div className="m-name">Mappák</div>
          <div className="order">
            <span title={`Rendezési szempont változtatása`} className="o-type">
              Név
            </span>
            {settings.sortDesc ? (
              <FontAwesomeIcon
                onClick={changeSort}
                title={`Rendezési sorrend változtatása`}
                icon={faArrowUp}
              ></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon
                onClick={changeSort}
                title={`Rendezési sorrend változtatása`}
                icon={faArrowDown}
              ></FontAwesomeIcon>
            )}
          </div>
        </div>
        <div className="grid">
          {folders
            ? folders.map((dir) => (
                <div className="grid-item" title={dir.name} key={dir._id}>
                  <Link
                    className="button"
                    onClick={(e) => e.preventDefault()}
                    onDoubleClick={() => {
                      history.push(`/drive/folder/${dir._id}`);
                      setPageID(dir._id);
                    }}
                    to={`/drive/folder/${dir._id}`}
                  >
                    <FontAwesomeIcon icon={faFolder}></FontAwesomeIcon>
                    <span className="r-text">{dir.name}</span>
                  </Link>
                </div>
              ))
            : 'Nincs mappa..'}
        </div>
      </div>
      <div className="files">
        <div className="type-row">
          <div className="m-name">Fájlok</div>
        </div>
        <div className="grid">
          {files
            ? files.map((file) => (
                <div className="grid-item" title={file.name} key={file._id}>
                  <div className="preview">
                    <FontAwesomeIcon icon={file.meta.icon}></FontAwesomeIcon>
                  </div>
                  <Link
                    className="button"
                    onClick={(e) => e.preventDefault()}
                    to={`/drive/file/${file._id}`}
                  >
                    <FontAwesomeIcon icon={file.meta.icon}></FontAwesomeIcon>
                    <span className="r-text">{file.name}</span>
                  </Link>
                </div>
              ))
            : 'Nincs fájl..'}
        </div>
      </div>
    </div>
  );
};

export default Grid;
