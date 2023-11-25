"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const product_constant_1 = require("./product.constant");
const productSchema = new mongoose_1.Schema({
    proId: {
        type: String,
    },
    imgURL: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: product_constant_1.categoriesList,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: [{ type: String, enum: product_constant_1.sizesList }],
    },
    shortDescription: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    facebookURL: {
        type: String,
    },
    sellCount: {
        type: Number,
        default: 0,
    },
    availability: {
        type: Boolean,
        required: true,
        default: true,
    },
    review: [
        {
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            review: {
                type: String,
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});
const Product = (0, mongoose_1.model)('Product', productSchema);
exports.default = Product;
