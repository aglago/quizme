import { useState } from "react";
import { Play, Save, X } from "lucide-react";
import { motion } from "framer-motion";

interface QuizGeneratedModalProps {
  onClose: () => void;
  quizName: string;
  setQuizName: (name: string) => void;
  handleSaveLater: () => void;
  handlePlayNow: () => void;
}

const QuizGeneratedModal: React.FC<QuizGeneratedModalProps> = ({
  onClose,
  quizName,
  setQuizName,
  handleSaveLater,
  handlePlayNow,
}) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = () => {
    setIsSaving(true);
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
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">Quiz Generated Successfully!</h2>
        <p className="mb-4">
          Would you like to save the quiz for later or play it now?
        </p>

        <div className="flex justify-end space-x-4">
          {!isSaving && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveClick}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Save className="mr-2" size={18} />
                Save for Later
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayNow}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded hover:bg-green-600"
              >
                <Play className="mr-2" size={18} />
                Play Now
              </motion.button>
            </>
          )}
        </div>

        {isSaving && (
          <div className="mt-4">
            <p className="mb-4">Please enter a name to save your quiz:</p>
            <input
              type="text"
              placeholder="Enter quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveLater}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Save className="mr-2" size={18} />
              Save Quiz
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuizGeneratedModal;
