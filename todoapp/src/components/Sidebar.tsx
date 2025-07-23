import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/themeSlice";
import type { RootState } from "../store";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 transition-colors duration-500 overflow-y-auto z-30">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Todo App
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Your Tasks</p>
      </div>

      <nav className="space-y-2 mb-8">
        <Link
          to="/"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
            isActive("/")
              ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            />
          </svg>
          <span>Your Current Tasks</span>
        </Link>

        <Link
          to="/new"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
            isActive("/new")
              ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>New Task</span>
        </Link>
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="flex items-center justify-between w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            {darkMode ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </div>
          <div
            className={`w-12 h-6 rounded-full transition-colors duration-300 ${
              darkMode ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-0.5 ${
                darkMode ? "translate-x-6" : "translate-x-0.5"
              }`}
            ></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
