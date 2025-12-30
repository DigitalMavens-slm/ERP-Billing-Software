import { useNavigate } from "react-router-dom";

function PageActions({
  listPath1,
  listPath2,
  listLabel1 ,
  listLabel2
}) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-4 justify-between">
      {/* Back */}
      <button
        onClick={() => navigate(listPath1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
      >
        <span className="text-lg">←</span>
        <span>{listLabel1}</span>
      </button>

      {/* List */}
      <button
        onClick={() => navigate(listPath2)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
      >
        <span className="text-lg">📋</span>
        <span>{listLabel2}</span>
      </button>
    </div>
  );
}

export default PageActions;
