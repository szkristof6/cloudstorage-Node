const Message = ({text, state}) => {
    return (
        <article className={`message ${state}`}>
            <div className="message-body">
                {text}
            </div>
        </article> 
    )
}


export default Message;