import { _decorator, Component, find, Node } from 'cc';
import { B_Script } from './B_Script';
const { ccclass, property } = _decorator;

@ccclass('A_Script')
export class A_Script extends Component {

    @property(Node)
    private bNode: Node = null; 

    start() {
        this.run();  
    }

    private async run(){
        console.log("執行B腳本");
        await this.bNode.getComponent(B_Script).runB();  //執行B腳本，並等待執行完後再接者執行下一行
        console.log("繼續執行A");  //B腳本執行完接者執行的內容
    }



    public get(){
        console.log("B呼叫A腳本");
    }
}