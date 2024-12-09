import { useState, useEffect } from "react";
import { Book } from "../types";
import axios from "axios";
import { backendUrl } from "../config";
import { BookOpen, TagIcon, MoreVertical } from "lucide-react";
import Modal from "./ModalCard";

const BookCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-lg animate-pulse">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-gray-300 mr-3 rounded"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      </div>
      <div className="flex items-center mb-2">
        <div className="w-4 h-4 bg-gray-300 mr-2 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div className="mb-4">
        <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      </div>
      <div className="w-full h-10 bg-gray-300 rounded"></div>
    </div>
  </div>
);

export default function BookCard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  async function init() {
    try {
      const response = await axios.get(`${backendUrl}/getBooks`);
      setBooks(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch books", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  const updateBookData = async (bookId: any) => {
    try {
      await axios.put(`${backendUrl}/buyBooks`, {
        bookId: bookId,
        status: "sold",
        issuedDate: new Date(),
      });
      alert("Successfully updated, Refresh to see changes");
    } catch (error) {
      alert("Failed to update book status");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((skeleton) => (
            <BookCardSkeleton key={skeleton} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={JSON.stringify(book._id)}
            className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 relative"
          >
            <div className="absolute top-4 right-4">
              <MoreVertical
                className="cursor-pointer text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedBook(book)}
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-800">{book.title}</h3>
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <TagIcon className="w-4 h-4 mr-2 text-gray-500" />
                <p className="text-sm">{book.author}</p>
              </div>
              <div className="flex items-center text-gray-500 text-xs mb-4">
                <span className="bg-gray-100 px-2 py-1 rounded-full">
                  {book.category}
                </span>
              </div>
              <button
                onClick={() => updateBookData(book._id)}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold tracking-wider uppercase transition-all duration-300 
                  ${book.status === "available" 
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                disabled={book.status !== "available"}
              >
                {book.status === "available" ? "Borrow Now" : "Unavailable"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedBook && (
        <Modal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}
