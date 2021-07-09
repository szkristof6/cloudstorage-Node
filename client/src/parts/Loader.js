const Loader = ({active, color, label}) =>{
    return (
        <div className={`pageloader ${active ? 'is-active' : ''} ${color}`}>
            <span className="title">{label}</span>
        </div>
    )
};

export default Loader;