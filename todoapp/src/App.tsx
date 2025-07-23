import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import NewTodo from "./pages/NewTodo";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { store } from "./store";
import type { RootState } from "./store";

const AppContent = () => {
  const darkTheme = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div
      className={`${
        darkTheme ? "dark" : ""
      } transition-all duration-500 ease-in-out min-h-screen`}
    >
      <Router>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-800 transition-colors duration-500">
          <Sidebar />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new" element={<NewTodo />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
