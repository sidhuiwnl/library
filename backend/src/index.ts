import express from "express";

import { dbConnect } from "./lib/dbConnect";

import { Book } from "./modals/book";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());



app.get("/getBooks", async (req, res) => {
  await dbConnect();
  try {
    const response = await Book.find();
    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching books",
    });
  }
});

app.put("/buyBooks", async (req, res) => {
  await dbConnect();

  const { status, bookId, issuedDate } = req.body;

  try {
    const issuedDateObj = new Date(issuedDate);
    const formattedIssuedDate = issuedDateObj.toDateString();

    const dueDateObj = new Date(issuedDateObj);
    dueDateObj.setDate(issuedDateObj.getDate() + 15);
    const formattedDueDate = dueDateObj.toDateString();

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        status: status,
        issuedDate: issuedDateObj,
        dueDate: dueDateObj,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBook) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...updatedBook._doc,
        issuedDate: formattedIssuedDate,
        dueDate: formattedDueDate,
      },
    });
  } catch (error) {
    console.error("Error updating book:", error);

    res.status(500).json({
      success: false,
      message: "Error updating book",
    });
  }
});

app.put("/updateBook", async (req, res) => {
  await dbConnect();
  const { bookId, status, title, category } = req.body;

  try {
    const updateBook = await Book.findByIdAndUpdate(
      bookId,
      {
        status: status,
        title: title,
        category: category,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateBook) {
      res.status(404).json({
        success: false,
        message: "Book not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        ...updateBook._doc,
      },
    });
  } catch (error) {
    console.error("Error updating book:", error);

    res.status(500).json({
      success: false,
      message: "Error updating book",
    });
  }
});



app.post("/addBooks",async(req,res) =>{
  await dbConnect()
  const { title,category,issuedDate,status } = req.body;

  const issuedDateObj = new Date(issuedDate);
  const dueDateObj = new Date(issuedDateObj);
  dueDateObj.setDate(issuedDateObj.getDate() + 15);

  try {
      const response = await Book.create({
        title : title,
        category : category,
        issuedDate : issuedDateObj,
        dueDate : dueDateObj,
        status : status
      })

      res.status(200).json({
        success : true,
        data : response
      })

  } catch (error) {
    console.error("Error updating book:", error);

    res.status(500).json({
      success: false,
      message: "Error Server",
    });
  }
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
