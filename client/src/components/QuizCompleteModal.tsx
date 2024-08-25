import { useState } from "react";
import { motion } from "framer-motion";

interface QuizCompleteModalProps {
  onClose: () => void;
  onSave: (quizName: string, save: boolean) => void;
}

const QuizCompleteModal: React.FC<QuizCompleteModalProps> = ({
  onClose,
  onSave,
}) => {
  const [quizName, setQuizName] = useState("");

  const handleSave = () => {
    onSave(quizName || "Generated Questions", true);
    onClose();
  };

  const handleSkipSave = () => {
    onSave("", false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div className="relative bg-white rounded-lg p-6 w-full max-w-md">
        {/* Close Button */}
        <button
          type="button"
          title="close"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">Quiz Complete!</h2>
        <p className="mb-4">Enter a name to save this quiz with:</p>
        <input
          type="text"
          placeholder="Enter quiz name"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkipSave}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Don't Save
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Quiz
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuizCompleteModal;
