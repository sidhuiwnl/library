"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Book title is required"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    author: {
        type: String,
        required: [true, "Book author is required"],
    },
    issuedDate: {
        type: Date,
        default: "null",
    },
    status: {
        type: String,
        enum: ["available", "borrowed", "sold"],
        default: "available"
    },
    issuedTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        default: "null",
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
exports.Book = mongoose_1.default.models.Book || mongoose_1.default.model("Book", BookSchema);
