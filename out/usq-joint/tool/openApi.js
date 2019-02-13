"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const fetch_1 = require("./fetch");
const centerApi_1 = require("./centerApi");
const setHostUrl_1 = require("./setHostUrl");
class OpenApi extends fetch_1.Fetch {
    constructor(baseUrl, unit) {
        super(baseUrl);
        this.unit = unit;
    }
    appendHeaders(headers) {
        headers.append('unit', String(this.unit));
    }
    async fresh(unit, stamps) {
        let ret = await this.post('open/fresh', {
            unit: unit,
            stamps: stamps
        });
        return ret;
    }
    async bus(faces, faceUnitMessages) {
        let ret = await this.post('open/bus', {
            faces: faces,
            faceUnitMessages: faceUnitMessages,
        });
        return ret;
    }
    async readBus(face, queue) {
        let ret = await this.post('open/joint-read-bus', {
            unit: this.unit,
            face: face,
            queue: queue
        });
        return ret;
    }
    async writeBus(face, from, queue, body) {
        let ret = await this.post('open/joint-write-bus', {
            unit: this.unit,
            face: face,
            from: from,
            sourceId: queue,
            body: body,
        });
        return ret;
    }
    async tuid(unit, id, tuid, maps) {
        let ret = await this.post('open/tuid', {
            unit: unit,
            id: id,
            tuid: tuid,
            maps: maps,
        });
        return ret;
    }
    async saveTuid(tuid, data) {
        let ret = await this.post('joint/tuid/' + tuid, data);
        return ret;
    }
    async saveTuidArr(tuid, arr, owner, data) {
        let ret = await this.post(`joint/tuid-arr/${tuid}/${owner}/${arr}`, data);
        return ret;
    }
    async getTuidVId(tuid) {
        let parts = tuid.split('.');
        let url;
        if (parts.length === 1)
            url = `joint/tuid-vid/${tuid}`;
        else
            url = `joint/tuid-arr-vid/${parts[0]}/${parts[1]}`;
        let ret = await this.get(url);
        return ret;
    }
    async scanSheet(sheet, scanStartId) {
        let ret = await this.get('joint/sheet-scan/' + sheet + '/' + scanStartId);
        return ret;
    }
    async action(action, data) {
        await this.post('joint/action-json/' + action, data);
    }
    async setMap(map, data) {
        await this.post('joint/action-json/' + map + '$add$', data);
    }
    async delMap(map, data) {
        await this.post('joint/action-json/' + map + '$del$', data);
    }
}
exports.OpenApi = OpenApi;
const usqOpenApis = {};
async function getOpenApi(usqFullName, unit) {
    let openApis = usqOpenApis[usqFullName];
    if (openApis === null)
        return null;
    if (openApis === undefined) {
        usqOpenApis[usqFullName] = openApis = {};
    }
    let usqUrl = await centerApi_1.centerApi.urlFromUsq(unit, usqFullName);
    if (usqUrl === undefined)
        return openApis[unit] = null;
    let { url, urlDebug } = usqUrl;
    if (urlDebug !== undefined) {
        try {
            urlDebug = setHostUrl_1.urlSetUsqHost(urlDebug);
            urlDebug = setHostUrl_1.urlSetUnitxHost(urlDebug);
            let ret = await node_fetch_1.default(urlDebug + 'hello');
            if (ret.status !== 200)
                throw 'not ok';
            let text = await ret.text();
            url = urlDebug;
        }
        catch (err) {
        }
    }
    return openApis[unit] = new OpenApi(url, unit);
}
exports.getOpenApi = getOpenApi;
//# sourceMappingURL=openApi.js.map