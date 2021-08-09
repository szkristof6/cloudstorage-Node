import { Link, useHistory } from 'react-router-dom';
import React, { useEffect, useContext } from 'react';
import { FileContext } from '../../services/FileContext';

import Selectable from 'selectable.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faFolder } from '@fortawesome/free-solid-svg-icons';

import { humanReadableByte, getDate } from '../../global';

const Table = ({ loading, setSelected, changeSort, settings }) => {
  const history = useHistory();

  const fileContext = useContext(FileContext);
  const { files, folders, setPageID, pageID } = fileContext;

  const setSelectable = () => {
    const selectionArea = document.querySelector('#infoPanel');
    const selectableItems = selectionArea.querySelectorAll('a.row');

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

        const splitted = node.href.split('/');
        const data = {
          type: splitted[4],
          id: splitted[5],
          elem: node,
        };
        newSelected.push(data);
      });
      setSelected(newSelected);
    });
  };

  useEffect(() => !loading && setSelectable(), [loading, pageID]);

  return (
    <div id="infoPanel" className='dragarea'>
      <div className="dirs">
        <div className="list-header">
          <div className="h-elem">
            Név
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
          <div className="h-elem">Tipus</div>
          <div className="h-elem">Létrehozás</div>
          <div className="h-elem">Fájlméret</div>
        </div>
        <div className="list-body">
          {folders
            ? folders.map((dir) => (
                <Link
                  key={dir._id}
                  className="row"
                  onClick={(e) => e.preventDefault()}
                  onDoubleClick={() => {
                    history.push(`/drive/folder/${dir._id}`);
                    setPageID(dir._id);
                  }}
                  to={`/drive/folder/${dir._id}`}
                >
                  <div className="be-text" title={`Mappa: ${dir.name}`}>
                    <FontAwesomeIcon icon={faFolder} aria-hidden="true"></FontAwesomeIcon>
                    {dir.name}
                  </div>
                  <div className="be-text" title={`Tipus: Mappa`}>
                    Mappa
                  </div>
                  <div
                    className="be-text"
                    title={`Létrehozva ${dir.user} által ${getDate(dir.createdAt)}`}
                  >
                    {getDate(dir.createdAt)}
                  </div>
                  <div className="be-text">-</div>
                </Link>
              ))
            : 'Töltés...'}
          {files
            ? files.map((file) => (
                <Link
                  key={file._id}
                  className="row"
                  onClick={(e) => e.preventDefault()}
                  onDoubleClick={() => {
                    history.push(`/drive/file/${file._id}`);
                    setPageID(file._id);
                  }}
                  to={`/drive/file/${file._id}`}
                >
                  <div className="be-text" title={`${file.meta.name}: ${file.name}`}>
                    <FontAwesomeIcon icon={file.meta.icon} aria-hidden="true"></FontAwesomeIcon>
                    {file.name}
                  </div>
                  <div className="be-text" title={`Tipus: ${file.meta.name}`}>
                    {file.meta.name}
                  </div>
                  <div
                    className="be-text"
                    title={`Létrehozva ${file.user} által ${getDate(file.createdAt)}`}
                  >
                    {getDate(file.createdAt)}
                  </div>
                  <div className="be-text" title={`Méret: ${humanReadableByte(file.meta.size)}`}>
                    {humanReadableByte(file.meta.size)}
                  </div>
                </Link>
              ))
            : 'Töltés...'}
        </div>
      </div>
    </div>
  );
};

export default Table;
