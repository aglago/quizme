import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                Study Smarter with QuizMe
              </h1>
              <p className="max-w-[600px] text-white/90 md:text-xl">
                Transform your documents into interactive quizzes, flashcards, and study plans with the power of AI.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-blue-600 shadow transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-white bg-transparent px-8 text-sm font-medium text-white shadow-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Log In
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/images/hero-image.png"
                alt="QuizMe App Screenshot"
                width={500}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Key Features</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Everything you need to transform your study experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {/* Feature cards go here */}
            {/* Example Feature Card */}
            <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg shadow-sm">
              <div className="p-2 bg-blue-100 rounded-full">
                {/* Icon */}
              </div>
              <h3 className="text-xl font-bold">AI-Powered Quizzes</h3>
              <p className="text-gray-500 text-center">
                Generate intelligent questions from your documents with advanced AI technology.
              </p>
            </div>
            {/* Add more feature cards */}
          </div>
        </div>
      </section>

      {/* More sections */}
    </main>
  );
}