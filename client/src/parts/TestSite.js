import React, { useState, useEffect } from 'react';
import Sortable, { MultiDrag, Swap } from 'sortablejs';

const App = () => {
  const [files, setFiles] = useState([
    { id: 1, name: 'file 1' },
    { id: 2, name: 'file 2' },
  ]);
  const [folders, setFolders] = useState([
    { id: 1, name: 'mappa 1' },
    { id: 2, name: 'mappa 2' },
  ]);

  useEffect(() => {
    var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));

    for (var i = 0; i < nestedSortables.length; i++) {
      new Sortable(nestedSortables[i], {
        group: 'nested',
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.65,
      });
    }
  }, []);

  return (
    <div id="nestedDemo" className="list-group col nested-sortable">
      {files.map((file) => (
        <div
          key={file.id}
          style={{
            background: '#A9A9A9',
            fontSize: '1em',
            margin: '10px 0',
            padding: '.5em 1em',
            border: '1px solid black',
          }}
        >
          {file.name}
        </div>
      ))}
      {folders.map((folder) => (
        <div
          key={folder.id}
          style={{
            background: '#d3d3d3',
            fontSize: '1em',
            margin: '10px 0',
            padding: '.5em 1em',
            border: '1px solid black',
          }}
          className="nested-sortable"
        >
          {folder.name}
        </div>
      ))}
    </div>
  );
};

export default App;
