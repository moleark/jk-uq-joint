"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tool_1 = require("../tool/tool");
const map_1 = require("../tool/map");
async function product(data) {
    let no = data['no'];
    let id = await tool_1.saveTuid('product', data);
    await map_1.map('product', id, no);
}
exports.product = product;
//# sourceMappingURL=product.js.map