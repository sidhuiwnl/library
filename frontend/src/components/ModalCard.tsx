import { useState, useEffect } from "react";
import { Book } from "../types";
import axios from "axios";
import { backendUrl } from "../config";

interface ModalProps {
  book: Book;
  onClose: () => void;
}

export default function Modal({ book, onClose }: ModalProps) {
  const [updatedBook, setUpdatedBook] = useState<Book>({ ...book });

  const handleChange = (field: keyof Book, value: string) => {
    setUpdatedBook((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function init() {
    try {
      const response = await axios.put(`${backendUrl}/updateBook`, {
        bookId: updatedBook._id,
        status: updatedBook.status,
        title: updatedBook.title,
        category: updatedBook.category,
      });

      if (response.status === 200) {
        alert("Successfully updated");
        onClose();
      }
    } catch (error) {
      console.error("Failed to fetch books", error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Book Details</h2>
        <div className="mb-4">
          <label className="block text-gray-800 font-bold mb-1">Name:</label>
          <input
            type="text"
            value={updatedBook.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 font-bold mb-1">
            Category:
          </label>
          <input
            type="text"
            value={updatedBook.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-800 font-bold mb-1">Status:</label>
          <input
            type="text"
            value={updatedBook.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={init}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
