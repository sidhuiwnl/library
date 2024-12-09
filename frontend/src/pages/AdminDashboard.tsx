import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import axios from "axios";
import { backendUrl } from "../config";
import { Book } from "../types";
import AddBookModal from "../components/BookModal";

export default function AdminDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  async function init() {
    try {
      const response = await axios.get(`${backendUrl}/getBooks`);
      setBooks(response.data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  }

  useEffect(() => {
    init();
  }, []);

  const booksByCategory = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const overdueBooks = books.filter((book) => {
    if (book.status === "sold") {
      const issuedDate = book.issuedDate ? new Date(book.issuedDate) : null;
      const dueDate = book.dueDate
        ? new Date(book.dueDate)
        : issuedDate
        ? new Date(issuedDate.getTime() + 15 * 24 * 60 * 60 * 1000)
        : null;

      return dueDate && dueDate < new Date();
    } else {
      return false;
    }
  });

  const soldBooks = books.filter(
    (book) => book.status === "sold" && book.issuedDate
  );

  const monthlyData = soldBooks.reduce((acc, book) => {
    if (book.issuedDate) {
      const issuedDate = new Date(book.issuedDate);
      const month = format(issuedDate, "MMMM");
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    books: count,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        onClick={() => setModalOpen(true)}
      >
        Add a Book
      </button>

      <AddBookModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Books by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(booksByCategory).map(([category, count]) => (
            <div
              key={category}
              className="bg-white p-4 rounded-lg shadow text-center"
            >
              <h3 className="text-lg font-medium">{category}</h3>
              <p className="text-3xl font-bold text-indigo-600">{count}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overdue Books</h2>
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overdueBooks.map((book) => (
                <tr key={JSON.stringify(book._id)}>
                  <td className="px-6 py-4 whitespace-nowrap">{book.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {book.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {book.dueDate
                      ? format(new Date(book.dueDate), "MMM, dd, yyyy")
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-red-300 rounded-full px-2">
                      Overdue
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Monthly Book Sales</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="books" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
