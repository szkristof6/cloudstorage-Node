//import { useState, useEffect } from 'react';


const InfoPanel = () => {
    /*
      const [ entries, setEntries ] = useState([]);

  useEffect(() => {
    (async () => {
      const logEntries = await listLogEntries();
      setEntries(logEntries);
    })();
  }, []);
    */ 
  return (
    <div className="info_panel">
        <div className="i-header">
            <i className="fas fa-folder" aria-hidden="true"></i>
            <span>Saját mappa</span>
            <i className="fas fa-times" aria-hidden="true"></i>
        </div>
        <div className="i-init">
            <i className="fab fa-chromecast" aria-hidden="true"></i>
            <div className="ii-text">Ha látni szeretnéd egy fájl, vagy mappa részleteit, kattints rá</div>
        </div>
    </div>
  );
}

export default InfoPanel;
