import { useNavigate } from "react-router-dom";
import PageActions from "../Components/PageActions";

function CommonList({
  title,
  newPath,
  listPath,
  columns,
  data,
  onView,
  onDelete
}) {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <PageActions
        listPath1={newPath}
        listPath2={listPath}
        listLabel1={`New ${title}`}
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow mt-4">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700">
                    {item[col.key] || "-"}
                  </td>
                ))}

                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => onView(item._id)}
                    className="px-3 py-1 text-blue-600 border border-blue-600 rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() => onDelete(item._id)}
                    className="px-3 py-1 text-red-600 border border-red-600 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CommonList;
