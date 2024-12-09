"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbConnect_1 = require("./lib/dbConnect");
const book_1 = require("./modals/book");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/getBooks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, dbConnect_1.dbConnect)();
    try {
        const response = yield book_1.Book.find();
        res.status(200).json({
            success: true,
            data: response,
        });
    }
    catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching books",
        });
    }
}));
app.put("/buyBooks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, dbConnect_1.dbConnect)();
    const { status, bookId, issuedDate } = req.body;
    try {
        const issuedDateObj = new Date(issuedDate);
        const formattedIssuedDate = issuedDateObj.toDateString();
        const dueDateObj = new Date(issuedDateObj);
        dueDateObj.setDate(issuedDateObj.getDate() + 15);
        const formattedDueDate = dueDateObj.toDateString();
        const updatedBook = yield book_1.Book.findByIdAndUpdate(bookId, {
            status: status,
            issuedDate: issuedDateObj,
            dueDate: dueDateObj,
        }, {
            new: true,
            runValidators: true,
        });
        if (!updatedBook) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: Object.assign(Object.assign({}, updatedBook._doc), { issuedDate: formattedIssuedDate, dueDate: formattedDueDate }),
        });
    }
    catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({
            success: false,
            message: "Error updating book",
        });
    }
}));
app.put("/updateBook", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, dbConnect_1.dbConnect)();
    const { bookId, status, title, category } = req.body;
    try {
        const updateBook = yield book_1.Book.findByIdAndUpdate(bookId, {
            status: status,
            title: title,
            category: category,
        }, {
            new: true,
            runValidators: true,
        });
        if (!updateBook) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: Object.assign({}, updateBook._doc),
        });
    }
    catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({
            success: false,
            message: "Error updating book",
        });
    }
}));
app.post("/addBooks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, dbConnect_1.dbConnect)();
    const { title, category, issuedDate, status } = req.body;
    const issuedDateObj = new Date(issuedDate);
    const dueDateObj = new Date(issuedDateObj);
    dueDateObj.setDate(issuedDateObj.getDate() + 15);
    try {
        const response = yield book_1.Book.create({
            title: title,
            category: category,
            issuedDate: issuedDateObj,
            dueDate: dueDateObj,
            status: status
        });
        res.status(200).json({
            success: true,
            data: response
        });
    }
    catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({
            success: false,
            message: "Error Server",
        });
    }
}));
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
