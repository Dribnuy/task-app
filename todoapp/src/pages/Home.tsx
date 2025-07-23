import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetTodosQuery } from "../store/api";
import type { Todo } from "../store/api";

interface ExtendedTodo extends Todo {
  completed?: boolean;
}

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localTodos, setLocalTodos] = useState<ExtendedTodo[]>([]);
  const navigate = useNavigate();

  const { data: apiTodos, error, isLoading } = useGetTodosQuery();

  useEffect(() => {
    if (apiTodos) {
      const savedTodos = localStorage.getItem("todos");
      const localStorageTodos = savedTodos ? JSON.parse(savedTodos) : [];

      const combinedTodos = [...apiTodos];
      localStorageTodos.forEach((localTodo: ExtendedTodo) => {
        if (!combinedTodos.find((todo) => todo.id === localTodo.id)) {
          combinedTodos.push(localTodo);
        }
      });

      setLocalTodos(combinedTodos);
    }
  }, [apiTodos]);

  useEffect(() => {
    if (localTodos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(localTodos));
    }
  }, [localTodos]);

  const filteredTodos = localTodos.filter((todo) =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggle = (id: number) => {
    const updatedTodos = localTodos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setLocalTodos(updatedTodos);
  };

  const handleDelete = (id: number) => {
    const updatedTodos = localTodos.filter((todo) => todo.id !== id);
    setLocalTodos(updatedTodos);
  };
  const handleEdit = (id: number) => {
    navigate(`/new?id=${id}`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center transition-colors duration-500 ml-64">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-300">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-6 transition-colors duration-500 ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">
              Error.Working in offline Mode.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-6 transition-colors duration-500 ml-64">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Todo List
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your tasks</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Title..."
              className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>
          <Link
            to="/new"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-300 text-center"
          >
            + Add Task
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-3 mb-4">
                  <button
                    onClick={() => handleToggle(todo.id)}
                    className={`flex-shrink-0 w-6 h-6 border-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                      todo.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 dark:border-gray-500 hover:border-green-400 dark:hover:border-green-500"
                    }`}
                  >
                    {todo.completed && (
                      <svg
                        className="w-4 h-4 mx-auto mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1">
                    <h3
                      className={`text-lg font-semibold mb-2 line-clamp-2 transition-all duration-200 ${
                        todo.completed
                          ? "text-gray-500 dark:text-gray-400 line-through"
                          : "text-gray-800 dark:text-white"
                      }`}
                    >
                      {todo.title}
                    </h3>
                    <p
                      className={`text-sm line-clamp-3 transition-all duration-200 ${
                        todo.completed
                          ? "text-gray-400 dark:text-gray-500 line-through"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {todo.body || "No Description"}
                    </p>
                  </div>
                </div>

                {todo.dateAdded && (
                  <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500 dark:text-gray-400">
                    📅 {formatDate(todo.dateAdded)}
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(todo.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
                You Don`t Have tasks yet.
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your first task for start the App.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
