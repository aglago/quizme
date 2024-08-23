import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Book, Brain, ChartLine, ArrowRight } from "lucide-react";

const LandingPage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gradient-to-b from-blue-500 to-purple-600 min-h-screen text-white">
      <main className="container mx-auto px-4 py-16">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bold mb-4">Learn, Quiz, Excel</h1>
          <p className="text-2xl mb-8">
            Create and take quizzes on any topic. Boost your knowledge and have
            fun!
          </p>
          {isLoggedIn ? (
            <Link
              to="/dashboard"
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300 inline-flex items-center"
            >
              Visit Dashboard <ArrowRight className="ml-2" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300 inline-flex items-center"
            >
              Get Started <ArrowRight className="ml-2" />
            </Link>
          )}
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FeatureCard
            icon={<Book className="w-12 h-12 mb-4" />}
            title="Create Quizzes"
            description="Craft custom quizzes on any topic. Ideal for educators, students, and lifelong learners."
          />
          <FeatureCard
            icon={<Brain className="w-12 h-12 mb-4" />}
            title="Take Quizzes"
            description="Expand your horizons with diverse quizzes. Test your knowledge and learn something new every day."
          />
          <FeatureCard
            icon={<ChartLine className="w-12 h-12 mb-4" />}
            title="Track Progress"
            description="Visualize your growth over time. Identify strengths and areas for improvement."
          />
        </motion.div>

        <motion.div
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-3xl font-semibold mb-7">
            Ready to start quizzing?
          </h3>
          {isLoggedIn ? (
            <Link
              to="/generate-quiz"
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300 inline-flex items-center"
            >
              Generate a Quiz <ArrowRight className="ml-2" />
            </Link>
          ) : (
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-100 transition duration-300 inline-flex items-center"
            >
              Sign Up Now <ArrowRight className="ml-2" />
            </Link>
          )}
        </motion.div>
      </main>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <motion.div
    className="bg-white bg-opacity-10 p-6 rounded-lg text-center"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {icon}
    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
    <p>{description}</p>
  </motion.div>
);

export default LandingPage;
