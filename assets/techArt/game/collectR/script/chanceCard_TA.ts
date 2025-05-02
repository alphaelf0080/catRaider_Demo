import { _decorator, Component, Node, Animation, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('chanceCard_TA')
export class chanceCard_TA extends Component {

    @property({ type: Number, displayName:'翻牌結果ID'})
    public textureID: number;

    @property({ type: Node, displayName:'機會卡Node'})
    public card: Node[] = [null];

    @property({ type: [SpriteFrame], displayName:'機會卡貼圖'})
    public cardTexture: SpriteFrame[] = [null];

    start() {
        this.scheduleOnce(function() {
            this.node.getComponent(Animation).play('chanceCard_change'); 
            }, 1);   //延遲時間
    }

    /* 調整卡片排序 */
    changeChildrenIndex(cardID: number, index: number){ //cardID:卡片ID，index:節點排序ID
        this.card[cardID].setSiblingIndex(index);  
        // console.log(`卡片${cardID}子物件ID` + this.card[cardID].getSiblingIndex( ));

    }

    /* 置換卡片貼圖 */
    changeSprite(cardID: number){ //cardID:卡片ID
        this.card[cardID].children[0].getComponent(Sprite).spriteFrame = this.cardTexture[this.textureID];  
    }

    /* 置換為卡片背面貼圖 */
    changeCardBack(cardID: number){ //cardID:卡片ID
        this.card[cardID].children[0].getComponent(Sprite).spriteFrame = this.cardTexture[3];
    }

}


