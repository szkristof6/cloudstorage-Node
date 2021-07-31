import { useState, useEffect } from "react";

import { humanReadableByte, getDate } from "../../global";

const InfoPanel = ({
  settings,
  closeInfo,
  selected,
  pageData,
  files,
  folders,
}) => {
  const [infoItem, setInfoItem] = useState(null);

  useEffect(() => {
    if (pageData.length > 0) {
      const item =
        selected.length > 0
          ? selected[0].type === "file"
            ? files.filter((x) => x._id === selected[0].id)[0]
            : folders.filter((x) => x._id === selected[0].id)[0]
          : pageData[pageData.length - 1];

      setInfoItem(item);
    }
  }, [pageData, selected]);

  return (
    <div className={`info_panel ${settings.InfoPanelOn ? "active" : "back"}`}>
      <div className="i-header">
        <i
          className={
            infoItem !== null
              ? infoItem.meta
                ? infoItem.meta.icon
                : "fas fa-folder"
              : "Töltés..."
          }
          aria-hidden="true"
        ></i>
        <span>{infoItem !== null ? infoItem.name : "Töltés..."}</span>
        <i className="fas fa-times" onClick={closeInfo} aria-hidden="true"></i>
      </div>
      {infoItem !== null ? (
        infoItem.meta ? (
          <div className="details">
            <div className="i-preview">
              <i className={infoItem.meta.icon} aria-hidden="true"></i>
            </div>
            <div className="i-share"></div>
            <div className="i-elem">
              <div className="ie-nev">Típus:</div>
              <div className="ie-ertek">{infoItem.meta.type}</div>
            </div>
            <div className="i-elem">
              <div className="ie-nev">Méret:</div>
              <div className="ie-ertek">{`${humanReadableByte(
                infoItem.meta.size
              )} (${infoItem.meta.size.toLocaleString()} bájt)`}</div>
            </div>
            <div className="i-elem">
              <div className="ie-nev">Hely:</div>
              <div className="ie-ertek">
                {pageData[pageData.length - 1].name}
              </div>
            </div>
            <div className="i-elem">
              <div className="ie-nev">Tulajdonos:</div>
              <div className="ie-ertek">{infoItem.user}</div>
            </div>
            <div className="i-elem">
              <div className="ie-nev">Készült:</div>
              <div className="ie-ertek">{getDate(infoItem.createdAt)}</div>
            </div>
            <div className="i-elem">
              <div className="ie-nev">Módosult:</div>
              <div className="ie-ertek">{getDate(infoItem.updatedAt)}</div>
            </div>
          </div>
        ) : (
          <div className="i-init">
            <i className="fab fa-chromecast" aria-hidden="true"></i>
            <div className="ii-text">
              Ha látni szeretnéd egy fájl, vagy mappa részleteit, kattints rá
            </div>
          </div>
        )
      ) : (
        "Töltés..."
      )}
    </div>
  );
};

export default InfoPanel;
