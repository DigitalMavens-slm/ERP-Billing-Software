
function Logout() {

  return (
    <button
                    onClick={() => logout()}
                    className="text-red-600 hover:underline"
                  >
                    logout
                  </button>
  )
}

export default Logout