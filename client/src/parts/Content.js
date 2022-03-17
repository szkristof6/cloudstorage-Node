import { useContext } from 'react';
import { FileContext } from '../services/FileContext';

import Navigation from './Navigation';
import Area from './Area';

const Content = () => {
  const { setContextMenuOff } = useContext(FileContext);

  return (
    <div
      className="content"
      onContextMenu={(e) => e.preventDefault()}
      onClick={() => setContextMenuOff()}
    >
      <Navigation />
      <Area />
    </div>
  );
};

export default Content;
