//import { useState, useEffect } from 'react';


const Area = () => {
  return (
    <div className="area">
      <div className="loader toltes"></div>
      <form className="a-form" method="post" enctype="multipart/form-data" style={{display: 'block'}}>
        <div className="file-area">
            <div className="file-menu">
                <div className="tabs is-boxed">
                    <ul>
                        <li><a>Saját mappa</a></li>
                    </ul>
                </div>
                <div className="info">
                    <div className="i-icon">
                        <i className="fas fa-bars" aria-hidden="true"></i>
                    </div>
                    <div className="i-icon"><i className="fas fa-info-circle" aria-hidden="true"></i></div>
                </div>
            </div>
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
                            <div className="grid-item">
                                <a className="button" href="/folders/5c37ba81-6556-42b2-948e-be2288b33390">
                                    <i className="fas fa-folder" aria-hidden="true"></i>
                                    <span className="r-text">Névtelen mappa</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="files">
                        <div className="type-row">
                            <div className="m-name">Fájlok</div>
                        </div>
                        <div className="grid">
                            <div className="grid-item">
                                <div className="preview">
                                    <i className="far fa-file-audio" aria-hidden="true"></i>
                                </div>
                                <a className="button" href="/items/0f9d03d8-e68f-4ad1-9689-15445adc6d93">
                                    <i className="far fa-file-audio" aria-hidden="true"></i>
                                    <span className="r-text">12.c_szalagtűző.mp3</span>
                                </a>
                            </div>
                        
                            <div className="grid-item">
                                <div className="preview">
                                    <i className="far fa-file-image" aria-hidden="true"></i>
                                </div>
                                <a className="button" href="/items/8cc46ee7-4d88-4e04-824b-a57054c4ffa7">
                                    <i className="far fa-file-image" aria-hidden="true"></i>
                                    <span className="r-text">1970kor.png</span>
                                </a>
                            </div>
                        
                            <div className="grid-item">
                                <div className="preview">
                                    <i className="fas fa-film" aria-hidden="true"></i>
                                </div>
                                <a className="button" href="/items/06dde8d8-9987-4a1e-824b-dda545df3968">
                                    <i className="fas fa-film" aria-hidden="true"></i>
                                    <span className="r-text">Final.mp4</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
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
            </div>
        </div>
        <input type="file" id="file" style={{display: 'none'}} webkitdirectory="" directory="" multiple="" />
      </form>
    </div>
  );
}

export default Area;
