const Errormsg = ({message}) => {
    const mesStyle = {
        color: 'red',
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

export default Errormsg