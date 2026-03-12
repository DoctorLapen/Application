import { Link } from "react-router";

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div className="bg-white border border-gray-300 shadow-lg rounded-2xl p-8 text-center max-w-md w-full hover:shadow-xl hover:bg-gray-50 transition">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-gray-600 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;