// app/components/Footer.tsx
const Footer = () => {
    return (
      <footer className="bg-gray-100 py-4 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} QuizMe. All rights reserved.
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;