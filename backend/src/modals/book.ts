import mongoose, { Schema } from "mongoose";

const BookSchema = new Schema({
  title: {
    type: String,
    required: [true, "Book title is required"],
  },

  category: {
    type: String,
    required: [true, "Category is required"],
  },

  issuedDate: {
    type: Date,
    default: "null",
  },

  status : {
    type : String,
    enum : ["available","borrowed","sold"],
    default : "available"
  },

  dueDate: {
    type: Date,
    default: "null",
  },

  isReturned: {
    type: Boolean,
    default: false,
  },

});


// BookSchema.pre("save", function (next) {
//   if (this.issuedDate && !this.dueDate) {
//     const issuedDate = new Date(this.issuedDate);
//     this.dueDate = new Date(issuedDate.setDate(issuedDate.getDate() + 15));
//   }
//   next();
// });

export const Book = mongoose.models.Book || mongoose.model("Book", BookSchema);
