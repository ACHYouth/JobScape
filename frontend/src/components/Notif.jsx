const Notif = ({message}) => {
    const mesStyle = {
        color: 'green',
        paddingBottom: 20
    }

    if (message === "") {
        return null
    }

    return (
        <div style={mesStyle}>
            {message}
        </div>
    )
}


export default Notif