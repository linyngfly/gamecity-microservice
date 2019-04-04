import { randomChineseName } from '../Utils'
export class Player {
    public name: string;  // 名称
    public x: number;    // x轴的位置
    public y: number;   // y轴的位置
    public dir: boolean; // 玩家的方向(左 false 右 true) 简单定义
    constructor( x: number,  y: number,name?: string) {
        this.x = x;
        this.y = y;
        this.name = name || randomChineseName();
        this.dir = true;
    }
}