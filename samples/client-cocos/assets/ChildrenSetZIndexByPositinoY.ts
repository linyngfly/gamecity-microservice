const {ccclass, property} = cc._decorator;

@ccclass
export default class ChildrenSetZIndexByPositinoY extends cc.Component {

    lateUpdate(){
        this.node.children.sort((a:cc.Node,b:cc.Node)=>{
            return b.getBoundingBox().yMin - a.getBoundingBox().yMin;
        }).forEach((child,key:number)=>{
            child.zIndex = key;
        })
    }
}
