"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webApiClient_1 = require("../../tools/webApiClient");
const uqOutRead_1 = require("../../first/converter/uqOutRead");
const facePointPush = async (joint, uqBus, queue, data) => {
    console.log(data);
    // 调用7.253的web api
    let httpClient = new webApiClient_1.WebApiClient();
    // let ret = await httpClient.test({});
    return true;
};
const facePointPull = async (joint, uqBus, queue) => {
    let sql = `select ID, CID, Years, AllScore, ScoreUsed from ProdData.dbo.Export_CustomerScoreBook where ID > @iMaxId order by ID`;
    return await uqOutRead_1.uqPullRead(sql, queue);
};
exports.facePoint = {
    face: '百灵威系统工程部/point/point',
    mapper: {
        member: 'CID@Customer',
        years: 'Years',
        point: "AllScore",
        pointUsed: "ScoreUsed",
    },
    // push: facePointPush,
    pull: facePointPull
};
//# sourceMappingURL=pointBus.js.map