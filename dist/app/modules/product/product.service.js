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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_model_1 = __importDefault(require("./product.model"));
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const product_constant_1 = require("./product.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const getAllProducts = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm, lowestPrice = 0, availability, highestPrice = Infinity } = filters, filtersData = __rest(filters, ["searchTerm", "lowestPrice", "availability", "highestPrice"]);
    const andConditions = [];
    // for filter price
    andConditions.push({
        $and: [{ price: { $gte: lowestPrice } }, { price: { $lte: highestPrice } }],
    });
    // for availability
    if (availability != null && availability != 'null') {
        andConditions.push({
            $and: [{ availability: availability }],
        });
    }
    // for filter data
    if (searchTerm) {
        andConditions.push({
            $or: product_constant_1.productSearchableField.map(field => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            })),
        });
    }
    // for exact match user and condition
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const { page, limit, skip, sortBy, sortOrder } = (0, paginationHelper_1.calculatePagination)(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    // if no condition is given
    const query = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield product_model_1.default.find(query)
        .sort(sortConditions)
        .skip(skip)
        .select({
        sellCount: 0,
    })
        .limit(limit)
        .populate({
        path: 'review',
        populate: [
            {
                path: 'userId',
                select: {
                    fullName: true,
                },
            },
        ],
    });
    const count = yield product_model_1.default.countDocuments(query);
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.default.findById(id)
        .select({
        sellCount: 0,
    })
        .populate({
        path: 'review',
        populate: [
            {
                path: 'userId',
                select: {
                    fullName: true,
                    phoneNumber: true,
                },
            },
        ],
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Product is not exist!!!');
    }
    return result;
});
const createProduct = (product, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(product);
    const admin = yield auth_model_1.default.findById(userInfo.id);
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const result = yield product_model_1.default.create(product);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create product!');
    }
    return result;
});
const updateProduct = (id, payload, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'There is no product with this id!!!');
    }
    const admin = yield auth_model_1.default.findById(userInfo.id);
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const result = yield product_model_1.default.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    }).populate({
        path: 'review',
        populate: [
            {
                path: 'userId',
                select: {
                    fullName: true,
                },
            },
        ],
    });
    return result;
});
const deleteProduct = (id, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'There is no product with this id!!!');
    }
    const admin = yield auth_model_1.default.findById(userInfo.id);
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const result = yield product_model_1.default.findByIdAndDelete(id);
    return result;
});
const postReview = (id, userInfo, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'There is no product with this id!!!');
    }
    const user = yield auth_model_1.default.findById(userInfo.id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const checkReview = product.review.find(r => r.userId == userInfo.id);
    if (checkReview) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Your already post a review!!!');
    }
    const review = Object.assign({ userId: userInfo.id }, payload);
    const result = yield product_model_1.default.findOneAndUpdate({ _id: id }, { $push: { review: review } }, {
        new: true,
    })
        .select({
        sellCount: 0,
    })
        .populate({
        path: 'review',
        populate: [
            {
                path: 'userId',
                select: {
                    fullName: true,
                },
            },
        ],
    });
    return result;
});
const deleteReview = (id, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(id);
    if (!product) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'There is no product with this id!!!');
    }
    const user = yield auth_model_1.default.findById(userInfo.id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const result = yield product_model_1.default.findOneAndUpdate({ _id: id }, { $pull: { review: { userId: userInfo.id } } }, {
        new: true,
    })
        .select({
        sellCount: 0,
    })
        .populate({
        path: 'review',
        populate: [
            {
                path: 'userId',
                select: {
                    fullName: true,
                },
            },
        ],
    });
    return result;
});
exports.ProductService = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    postReview,
    deleteReview,
};
