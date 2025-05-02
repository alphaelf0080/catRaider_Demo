import { _decorator, Component, Node, Material, Sprite, Label } from 'cc';
const { ccclass, property } = _decorator;

/* 材質控制 */
@ccclass('materialContro_TA')
export class materialContro_TA extends Component {
    
    @property({type: Node, tooltip:'有material的節點'})
    public materialNode: Node = null;
    
    start() {
        // this.setGrayScale(true); 
    }

    /* 控制地板下倍率符號數字的灰階顯示開關，以Animation事件啟動 */
    setGrayScale(_switch:boolean){
        let _label = this.materialNode.getComponent(Label);
        _label.getMaterialInstance(0).recompileShaders({'IS_GRAY': _switch}); //實例化label上的Shader並利用字串取得參數項目做控制
        console.error('加乘倍率獎金-啟動灰階');
    }
}


