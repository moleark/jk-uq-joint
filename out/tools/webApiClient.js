"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpClient = exports.WebApiClient = void 0;
const config_1 = __importDefault(require("config"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const uq_joint_1 = require("uq-joint");
const webApiBaseUrl = config_1.default.get("busOutUrl");
class WebApiClient extends uq_joint_1.Fetch {
    constructor() {
        super(webApiBaseUrl);
    }
    async addSaleOrderCoupon(order) {
        try {
            let result = await this.get("SaleOrder/AddSaleOrderCoupon", order);
            return result;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async newOrder(order) {
        try {
            // order = { Id: 'N20190201JKA', Customer: { Id: 'A250001' }, Maker: 'L38', SaleOrderItems: [{ Id: 'xxuigeuiiwege', PackageId: 'A250011_100g', Qty: 1, SalePrice: { Value: 100, Currency: 'RMB' } }] };
            let result = await this.post("SaleOrder/CreateNewSaleOrder", order);
            return result;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async addUseCouponOrder(order) {
        try {
            // order = { Id: 'N20190201JKA', Customer: { Id: 'A250001' }, Maker: 'L38', SaleOrderItems: [{ Id: 'xxuigeuiiwege', PackageId: 'A250011_100g', Qty: 1, SalePrice: { Value: 100, Currency: 'RMB' } }] };
            let result = await this.post("SaleOrder/CreateNewSaleOrder", order);
            return result;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async ExchangePoint(orderId) {
        try {
            await this.post(`PointShop/Exchange?saleOrderId=${orderId}`, undefined);
            return true;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async getPrice(packageId, salesRegionId) {
        try {
            /*
            不能使用uq-joint中提供的Fetch，该Fetch要求返回结果的格式是{ok: true|false, res: data}，下面的方法不提供该格式
            return await this.get("ProductCatalog/GetPrice", { packageId: packageId, salesRegionId: salesRegionId });
            */
            let res = await node_fetch_1.default(webApiBaseUrl + "ProductCatalog/GetPrice?packageId=" + encodeURI(packageId) + "&salesRegionId=" + salesRegionId);
            if (res.status === 200) {
                return res.json();
            }
            return undefined;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async test(data) {
        let ret = await this.get("Customer/Get/0023A8557A");
        return ret;
    }
}
exports.WebApiClient = WebApiClient;
exports.httpClient = new WebApiClient();
//# sourceMappingURL=webApiClient.js.map