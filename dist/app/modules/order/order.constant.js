"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSearchableField = exports.orderFilterableField = exports.statusType = void 0;
exports.statusType = [
    'process',
    'accept',
    'cancel',
    'delivered',
];
exports.orderFilterableField = ['searchTerm', 'status'];
exports.orderSearchableField = [
    'status',
    'details.name',
    'details.phoneNumber',
    'details.address',
];
