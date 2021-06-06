import { useState, useEffect } from 'react';

const {listLogEntries} = require('./API');

const App = () => {
  const [ entries, setEntries ] = useState([]);

  useEffect(() => {
    (async () => {
      const logEntries = await listLogEntries();
      setEntries(logEntries);
    })();
  }, []);

  return (
    <div>
      <h1>Hello</h1>
      {
        entries.map(file => (
          <code key={file._id}>{file.name} </code>
        ))
      }
    </div>
  );
}

export default App;
