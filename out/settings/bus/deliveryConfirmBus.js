"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceDeliveryConfirm = void 0;
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const deliveryConfirmPull = async (joint, uqBus, queue) => {
    let sql = `SELECT TOP 1 ID, outBoundItemId, outBoundId, warehouseName, logisticsCompanyId, logisticsNumber, deliveryGoodsTime, deliveryAddress, 
        saleOrderId, saleOrderItemId, packageId, quantity, operatorId, operatorName, operatorPhone, customerId
        FROM	ProdData.dbo.Export_deliveryConfirm
        WHERE	ID > @iMaxId order by ID `;
    return await uqOutRead_1.uqOutRead(sql, queue);
};
exports.faceDeliveryConfirm = {
    face: '百灵威系统工程部/Adapter/deliveryConfirm',
    from: 'local',
    mapper: {
        outBoundItemId: 'outBoundItemId',
        outBoundId: 'outBoundId',
        warehouseName: 'warehouseName',
        logisticsCompanyId: 'logisticsCompanyId@ExpressLogistics',
        logisticsNumber: 'logisticsNumber',
        deliveryGoodsTime: 'deliveryGoodsTime',
        deliveryAddress: 'deliveryAddress',
        saleOrderId: 'saleOrderId',
        saleOrderItemId: 'saleOrderItemId',
        packageId: 'packageId',
        quantity: 'quantity',
        operatorId: 'operatorId',
        operatorName: 'operatorName',
        operatorPhone: 'operatorPhone',
        customerId: 'customerId'
    },
    pull: deliveryConfirmPull
};
//# sourceMappingURL=deliveryConfirmBus.js.map