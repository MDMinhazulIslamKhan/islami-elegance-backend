"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRouters = void 0;
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("../modules/auth/auth.route");
const product_route_1 = require("../modules/product/product.route");
const order_route_1 = require("../modules/order/order.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRouters,
    },
    {
        path: '/product',
        route: product_route_1.ProductRouters,
    },
    {
        path: '/order',
        route: order_route_1.OrderRouters,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.ApplicationRouters = router;
