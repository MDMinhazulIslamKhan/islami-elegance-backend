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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const auth_model_1 = __importDefault(require("./auth.model"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const auth_constant_1 = require("./auth.constant");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const checkNumber = yield auth_model_1.default.findOne({ phoneNumber: user.phoneNumber });
    if (user.email) {
        const checkEmail = yield auth_model_1.default.findOne({ email: user.email });
        if (checkEmail) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already used this email!!!');
        }
    }
    if (checkNumber) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already used this phone number!!!');
    }
    const createdUser = yield auth_model_1.default.create(user);
    if (!createdUser) {
        throw new ApiError_1.default(400, 'Failed to create user!');
    }
    const result = yield auth_model_1.default.findById(createdUser._id);
    const tokenInfo = {
        id: createdUser.id,
        phoneNumber: user.phoneNumber,
        role: 'user',
    };
    const accessToken = jwtHelpers_1.jwtHelpers.createToken(tokenInfo, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return { userInfo: result, accessToken };
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    const isUserExist = yield auth_model_1.default.isUserExist(phoneNumber);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User doesn't exist.");
    }
    if (!(yield auth_model_1.default.isPasswordMatch(password, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect.');
    }
    const { role, id } = isUserExist;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ id, phoneNumber, role }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return accessToken;
});
const changePassword = (userInfo, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = payload;
    const isUserExist = yield auth_model_1.default.findById(userInfo.id).select({
        password: true,
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (!(yield auth_model_1.default.isPasswordMatch(oldPassword, isUserExist.password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Old Password is incorrect');
    }
    isUserExist.password = newPassword;
    isUserExist.save();
});
const getOwnProfile = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.default.findById(userInfo.id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Your profile is not exist!!!');
    }
    return result;
});
const updateOwnProfile = (payload, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield auth_model_1.default.findById(userInfo.id);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    if (payload.email) {
        const checkEmail = yield auth_model_1.default.findOne({
            email: payload.email,
        });
        if (checkEmail) {
            throw new ApiError_1.default(http_status_1.default.CONFLICT, 'Already used this email!!!');
        }
    }
    const result = yield auth_model_1.default.findOneAndUpdate({ _id: userInfo.id }, payload, {
        new: true,
    });
    return result;
});
const getAllUsers = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    // for filter data
    if (searchTerm) {
        andConditions.push({
            $or: auth_constant_1.userFilterableField.map(field => ({
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
    const result = yield auth_model_1.default.find(query)
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const count = yield auth_model_1.default.countDocuments(query);
    return {
        meta: {
            page,
            limit,
            count,
        },
        data: result,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.default.findById(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, 'User is not exist!!!');
    }
    return result;
});
const changePasswordByAdmin = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield auth_model_1.default.findById(id);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User does not exist');
    }
    isUserExist.password = payload.newPassword;
    isUserExist.save();
});
exports.AuthService = {
    createUser,
    loginUser,
    changePassword,
    getOwnProfile,
    updateOwnProfile,
    getAllUsers,
    getSingleUser,
    changePasswordByAdmin,
};
