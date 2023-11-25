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
exports.OrderService = void 0;
const order_model_1 = __importDefault(require("./order.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const order_constant_1 = require("./order.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const product_model_1 = __importDefault(require("../product/product.model"));
const createOrder = (order, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield auth_model_1.default.findById(userInfo.id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const count = (_a = order.product) === null || _a === void 0 ? void 0 : _a.length;
    let total = order.shippingCost;
    for (let i = 0; i < count; i++) {
        const product = yield product_model_1.default.findById(order.product[i].productId);
        if (!product) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, `${order.product[i].productName} is not available.`);
        }
        total += order.product[i].price;
    }
    order.userId = userInfo.id;
    order.total = total;
    const result = yield order_model_1.default.create(order);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create product!');
    }
    return result;
});
const deleteOrder = (id, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const isOrder = yield order_model_1.default.findOne({
        $and: [{ _id: id }, { userId: userInfo.id }],
    });
    if (!isOrder) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Order doesn't exist or this is not your order.");
    }
    if (isOrder.status == 'accept') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Your order is on the way, can't delete order.");
    }
    const result = yield order_model_1.default.findOneAndDelete({
        $and: [{ _id: id }, { userId: userInfo.id }],
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete order!');
    }
    return result;
});
const myPendingOrders = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.default.findById(userInfo.id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const result = yield order_model_1.default.find({
        $and: [{ status: { $nin: 'delivered' } }, { userId: userInfo.id }],
    });
    return result;
});
const myCompletedOrder = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.default.findById(userInfo.id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const result = yield order_model_1.default.find({
        $and: [{ status: 'delivered' }, { userId: userInfo.id }],
    });
    return result;
});
const acceptOrder = (id, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield auth_model_1.default.findById(userInfo.id);
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const isOrder = yield order_model_1.default.findOne({
        _id: id,
    });
    if (!isOrder) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Order doesn't exist.");
    }
    if (isOrder.status !== 'process') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Order is in '${isOrder.status}' stage.`);
    }
    const result = yield order_model_1.default.findOneAndUpdate({ _id: id }, { status: 'accept' }, { new: true });
    return result;
});
const cancelOrder = (id, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield auth_model_1.default.findById(userInfo.id);
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const isOrder = yield order_model_1.default.findOne({
        _id: id,
    });
    if (!isOrder) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Order doesn't exist.");
    }
    if (isOrder.status == 'delivered' || isOrder.status == 'cancel') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Order is already ${isOrder.status}.`);
    }
    const result = yield order_model_1.default.findOneAndUpdate({ _id: id }, { status: 'cancel' }, { new: true });
    return result;
});
const deliveredOrder = (id, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield auth_model_1.default.findById(userInfo.id);
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const isOrder = yield order_model_1.default.findOne({
        _id: id,
    });
    if (!isOrder) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Order doesn't exist.");
    }
    // return isOrder;
    if (isOrder.status == 'delivered' || isOrder.status == 'cancel') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Order is already ${isOrder.status}.`);
    }
    else if (isOrder.status == 'process') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Order is not accept yet.`);
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        yield order_model_1.default.findOneAndUpdate({ _id: id }, { status: 'delivered' }, {
            session,
        });
        yield auth_model_1.default.findOneAndUpdate({ _id: isOrder.userId }, { $inc: { complectedOrder: 1 } }, {
            session,
        });
        yield auth_model_1.default.findOneAndUpdate({ _id: isOrder.userId }, { $inc: { totalCost: isOrder.total } }, {
            session,
        });
        const productUpdatePromises = isOrder.product.map((singleProduct) => __awaiter(void 0, void 0, void 0, function* () {
            yield product_model_1.default.findOneAndUpdate({ _id: singleProduct.productId }, { $inc: { sellCount: singleProduct.quantity } }, { session });
        }));
        yield Promise.all(productUpdatePromises);
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    const result = yield order_model_1.default.findById(id);
    return result;
});
const allPendingOrders = (filters, paginationOptions, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield auth_model_1.default.findById(userInfo.id);
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // for filter pending orders
    andConditions.push({
        $and: [{ status: 'process' }],
    });
    // for filter data
    if (searchTerm) {
        andConditions.push({
            $or: order_constant_1.orderSearchableField.map(field => ({
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
    const query = andConditions.length > 0 ? { $and: andConditions } : { status: 'process' };
    const result = yield order_model_1.default.find(query)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .populate({
        path: 'userId',
    })
        .populate({
        path: 'product.productId',
    });
    const count = yield order_model_1.default.countDocuments(query);
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
const allDeliveredOrders = (filters, paginationOptions, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield auth_model_1.default.findById(userInfo.id);
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // for filter creator of task
    andConditions.push({
        $and: [{ status: 'delivered' }],
    });
    // for filter data
    if (searchTerm) {
        andConditions.push({
            $or: order_constant_1.orderSearchableField.map(field => ({
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
    const query = andConditions.length > 0
        ? { $and: andConditions }
        : { status: 'delivered' };
    const result = yield order_model_1.default.find(query)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .populate({
        path: 'userId',
    })
        .populate({
        path: 'product.productId',
    });
    const count = yield order_model_1.default.countDocuments(query);
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
const allAcceptedOrders = (filters, paginationOptions, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield auth_model_1.default.findById(userInfo.id);
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile does not exist!!!');
    }
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // for filter creator of task
    andConditions.push({
        $and: [{ status: 'accept' }],
    });
    // for filter data
    if (searchTerm) {
        andConditions.push({
            $or: order_constant_1.orderSearchableField.map(field => ({
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
    const query = andConditions.length > 0 ? { $and: andConditions } : { status: 'accept' };
    const result = yield order_model_1.default.find(query)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .populate({
        path: 'userId',
    })
        .populate({
        path: 'product.productId',
    });
    const count = yield order_model_1.default.countDocuments(query);
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
exports.OrderService = {
    createOrder,
    allPendingOrders,
    allDeliveredOrders,
    allAcceptedOrders,
    deleteOrder,
    myPendingOrders,
    myCompletedOrder,
    acceptOrder,
    cancelOrder,
    deliveredOrder,
};
