import { useAddTodoMutation } from "../store/api";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Todo } from "../store/api";

const NewTodo = () => {
  const [addTodo] = useAddTodoMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [todoId, setTodoId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    if (id) {
      setIsEdit(true);
      setTodoId(parseInt(id));
      const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
      const todoToEdit = savedTodos.find((t: Todo) => t.id === parseInt(id));
      if (todoToEdit) {
        setTitle(todoToEdit.title);
        setBody(todoToEdit.body || "");
      }
    }
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    try {
      const newTodo = {
        id: isEdit && todoId ? todoId : Date.now(),
        title: title.trim(),
        body: body.trim(),
        dateAdded: isEdit ? undefined : new Date().toISOString(),
      };

      const savedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
      let updatedTodos;

      if (isEdit && todoId) {
        updatedTodos = savedTodos.map((t: Todo) =>
          t.id === todoId ? { ...t, title: title.trim(), body: body.trim() } : t
        );
      } else {
        updatedTodos = [...savedTodos, newTodo];
      }

      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate("/");
    } catch (error) {
      console.error("Error saving todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 p-6 transition-colors duration-500 ml-64">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {isEdit ? "Edit Task" : "New Task"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? "Input Changes to task" : "Create new Task"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title*
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Input task title"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Description of your task..."
                rows={4}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-300 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!title.trim() || isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800 text-white rounded-lg transition-colors duration-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{isEdit ? "Updating..." : "Creating..."}</span>
                  </>
                ) : (
                  <span>{isEdit ? "Update" : "Create"}</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {!isEdit && (title || body) && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Preview
            </h2>
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {title || "Title"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                {body || "Description"}
              </p>
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-500 dark:text-gray-400">
                📅{" "}
                {new Date().toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewTodo;
