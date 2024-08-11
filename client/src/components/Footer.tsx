import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-600 text-white py-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; 2024 Quiz Generator. All Rights Reserved.</p>
        <p className="text-sm mt-2">
          <Link
            to="/privacy-policy"
            className="hover:underline hover:text-blue-300"
          >
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link
            to="/terms-of-service"
            className="hover:underline hover:text-blue-300"
          >
            Terms of Service
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
