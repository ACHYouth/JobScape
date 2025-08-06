const Errormsg = ({ message }) => {
  if (!message) return null

  return (
    <div className="border border-red-700 mb-15 bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4">
      {message}
    </div>
  )
}

export default Errormsg
