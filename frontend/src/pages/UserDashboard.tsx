
import BookCard from "../components/BookCard";


export default function UserDashboard() {
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Books</h1>
      <div>
        <BookCard/>
      </div>
    </div>
  );
}
