import { _decorator, Component, Node, find } from 'cc';
// import { A_Script } from './A_Script';
const { ccclass, property } = _decorator;

@ccclass('B_Script')
export class B_Script extends Component {
    // @property(Node)
    // private aNode: Node = null;

    start() {

    }

    public async runB(): Promise<void> {
        return new Promise((resolve) => {
            console.log("B腳本執行中");
            this.scheduleOnce(() => {
                // this.callA();
                resolve();  //通知原呼叫腳本，涵式已執行完
            }, 2);
        });
    }

    // private callA() {
    //     const aNode = find('A_Component');
    //     aNode.getComponent(A_Script).get();
    // }

}


