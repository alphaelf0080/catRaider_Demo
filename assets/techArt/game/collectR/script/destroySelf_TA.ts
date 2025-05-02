import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/* 掛在特效上，時間到刪除自身 */
@ccclass('destroySelf_TA')
export class destroySelf_TA extends Component {

    @property({ type: Number, tooltip:'刪除自身的等待時間'})
    public setTime: number = 1;

    start() {
        this.scheduleOnce(() => {
            this.node.destroy();//刪除自身
        }, this.setTime) 
    }

}


