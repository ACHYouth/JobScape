const Notif = ({ message }) => {
  if (!message) return null

  return (
    <div className="border border-green-700 mb-15 bg-green-100 text-green-700 px-4 py-2 rounded-md mb-4">
      {message}
    </div>
  )
}

export default Notif
