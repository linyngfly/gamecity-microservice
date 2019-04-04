"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
class Player {
    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name || Utils_1.randomChineseName();
        this.dir = true;
    }
}
exports.Player = Player;
