import { useState, useEffect, useContext } from 'react';

import { humanReadableByte, getDate } from '../../global';

import { FileContext } from '../../services/FileContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faChromecast } from '@fortawesome/free-brands-svg-icons';

import InfoRow from './InfoRow';

const InfoPanel = ({ settings, closeInfo, selected }) => {
  const [infoItem, setInfoItem] = useState(null);
  const [infoList, setInfoList] = useState(null);

  const fileContext = useContext(FileContext);
  const { files, folders, pageData } = fileContext;

  useEffect(() => {
    if (pageData.length > 0) {
      const item =
        selected.length > 0
          ? selected[0].type === 'file'
            ? files.filter((x) => x._id === selected[0].id)[0]
            : folders.filter((x) => x._id === selected[0].id)[0]
          : pageData[pageData.length - 1];

      setInfoItem(item);
    }
  }, [pageData, selected]);

  useEffect(() => {
    if (infoItem) {
      if (infoItem.meta) {
        setInfoList([
          {
            name: 'Tipus',
            type: infoItem.meta.type,
          },
          {
            name: 'Méret',
            type: `${humanReadableByte(
              infoItem.meta.size
            )} (${infoItem.meta.size.toLocaleString()} bájt)`,
          },
          {
            name: 'Hely',
            type: pageData[pageData.length - 1].name,
          },
          {
            name: 'Tulajdonos',
            type: infoItem.user,
          },
          {
            name: 'Készült',
            type: getDate(infoItem.createdAt),
          },
          {
            name: 'Módosult',
            type: getDate(infoItem.updatedAt),
          },
        ]);
      }
    }
  }, [infoItem]);

  return (
    <div className={`info_panel ${settings.InfoPanelOn ? 'active' : 'back'}`}>
      <div className="i-header">
        {infoItem !== null ? (
          <FontAwesomeIcon
            icon={infoItem.meta ? infoItem.meta.icon : faFolder}
            aria-hidden="true"
          ></FontAwesomeIcon>
        ) : (
          'Töltés...'
        )}
        <span>{infoItem !== null ? infoItem.name : 'Töltés...'}</span>
        <FontAwesomeIcon icon={faTimes} onClick={closeInfo} aria-hidden="true"></FontAwesomeIcon>
      </div>
      {infoItem !== null ? (
        infoItem.meta ? (
          <div className="details">
            <div className="i-preview">
              <FontAwesomeIcon icon={infoItem.meta.icon} aria-hidden="true"></FontAwesomeIcon>
            </div>
            <div className="i-share"></div>
            {infoList &&
              infoList.map((row, index) => <InfoRow key={index} name={row.name} type={row.type} />)}
          </div>
        ) : (
          <div className="i-init">
            <FontAwesomeIcon icon={faChromecast} aria-hidden="true"></FontAwesomeIcon>
            <div className="ii-text">
              Ha látni szeretnéd egy fájl, vagy mappa részleteit, kattints rá
            </div>
          </div>
        )
      ) : (
        'Töltés...'
      )}
    </div>
  );
};

export default InfoPanel;
