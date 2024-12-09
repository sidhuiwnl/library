import { Types } from "mongoose";

export interface Book {
  _id : Types.ObjectId,
   title: string;
  category: string;
  author: string;
  issuedDate: Date | null;
  status: "available" | "borrowed" | "sold";
  issuedTo: Types.ObjectId | null;
  dueDate: Date | null;
  isReturned: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  returned: boolean;
}