const InfoRow = ({ name, type}) => {
  return (
    <div className="i-elem">
      <div className="ie-nev">{`${name}:`}</div>
      <div className="ie-ertek">{type}</div>
    </div>
  );
};

export default InfoRow;
