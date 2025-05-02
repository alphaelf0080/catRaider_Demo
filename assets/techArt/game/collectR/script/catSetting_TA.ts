import { _decorator, Component, Node, SpriteFrame, Sprite, Animation, find, UIOpacity } from 'cc';
import { demoInfo_TA } from './demoInfo_TA';
import { reelRun_TA } from './reelRun_TA';
const { ccclass, property } = _decorator;

//* 角色符號功能，掛在角色節點上 *//
@ccclass('catSetting_TA')
export class catSetting_TA extends Component {
    @property({ type: [SpriteFrame], tooltip: "symbol圖" })
    public symLevelPicN: SpriteFrame[] = []!;

    @property({ type: [SpriteFrame], tooltip: "模糊版symbol圖" })
    public symLevelPicB: SpriteFrame[] = []!;

    private demoInfoTA: demoInfo_TA = null;

    private _reelRun: Node = null;
    
    private _Animation: Animation = null;

    start(){
        this._reelRun = find('Canvas/TADemo/reelRun_TA')!;  //找尋Canvas之下的reelRun_TA節點
        this._Animation = this.node.getComponent(Animation);
    }

    /* 依照Level置換符號顯示貼圖 */
    setSymLevelPic(symTextureID: number) {
        if (symTextureID>0 && symTextureID<=8) { //防呆，貼圖索引只有1~8
            this.node.children[1].children[0].getComponent(Sprite).spriteFrame = this.symLevelPicN[symTextureID-1]; //置換正常版貼圖，-1 輸入1時讀入索引0
            this.node.children[1].children[1].getComponent(Sprite).spriteFrame = this.symLevelPicB[symTextureID-1]; //置換模糊版貼圖，-1 輸入1時讀入索引0
        }else{
            console.error(`符號貼圖索引數值錯誤:${symTextureID}，只接受1~8`);
        }
    }

    /* 落下結束(到達盤面定位) */
    dropEnding(){
        this._Animation.play('sym_DropEnd'); //掉落結束時播放回彈動畫
        this.node.children[1].children[0].active = true; //開啟清楚版符號貼圖
        this.node.children[1].children[1].active = false;  //關閉模糊版符號貼圖
    }

    /* 開始落下 */
    dropStarting(){
        this.node.children[1].children[0].active = false; //關閉清楚版符號貼圖
        this.node.children[1].children[1].active = true;  //開啟模糊版符號貼圖
    }

    /* 貓跳躍-攻擊地鼠 */
    catJump(){
        this._Animation.play('cat_Jump');
    }

    /* 貓驚喜-發現地鼠 */
    async catYeah(): Promise<void>{
        return new Promise((resolve) => {
            this.node.getChildByName('signCtrl').active = true ; //開啟驚嚇圖示
            this._Animation.play('cat_Yeah');
            setTimeout(()=>{
                resolve();   //通知原呼叫腳本，涵式已執行完，讓腳本播續播地鼠害怕動作
            },300) //等待驚喜圖示播完
            setTimeout(()=>{
                this.node.getChildByName('signCtrl').active = false ; //關閉驚嚇圖示
            },700) //等待地鼠害怕動作播一段時間
        });
    }

    /* 地鼠害怕-被貓發現 */
    async mouseFrightened(): Promise<void>{
        return new Promise((resolve) => {
            this.node.getChildByName('signCtrl').active = true ; //開啟驚嚇圖示
            this._Animation.play('mouse_frightened');
            this._Animation.on(Animation.EventType.FINISHED, () => {  //動畫若播完執行以下工作
                this._Animation.play('mouse_frightened_loop');  //播放驚嚇Loop動作
            })
            setTimeout(()=>{
                resolve();   //等地鼠害怕播一段時間再通知原呼叫腳本，涵式已執行完
            },300) //等待地鼠害怕播一段時間
        });
    }

    /* 地鼠受擊-受貓攻擊，彈跳掉出畫面 */
    mouseHit(fallDirection: string){ //fallDirection:被擊中摔出的方向 'L'或'R'
        this._Animation.play('mouse_hit_fall_'+fallDirection); //利用輸入的字串組合出完整的動作檔名稱
        setTimeout(()=>{
            this.symPool_Recovery(); //呼叫回收功能
        },900) //等待受攻擊動作播完
    }

    /* 重置設定並回收進物件池 */
    symPool_Recovery(){
        console.log('symPool_Recovery() 執行角色重置狀態並回收進物件池 '+this.node.name);
        this.node.setScale(1,1,1);
        this.node.getChildByName('posCtrl').getComponent(UIOpacity).opacity = 255;  //回收前重置主體Sprite透明度，避免再次取用時透明度異常
        this.node.getChildByName('shadow').getComponent(UIOpacity).opacity = 255;   //回收前重置影子透明度
        this.node.getChildByName('signCtrl').active = false ; //關閉驚嚇圖示
        let _symName = this.node.name;  //取得符號的名稱
        if (_symName != 'SymC_11') {  //如果是貓才執行...
            this.node.getChildByName('posCtrl').getChildByName('Sprite_blur').active = false ; //關閉模糊狀態貼圖
            this.node.getChildByName('posCtrl').setPosition(0,0,-30);  //重置主體Sprite位置
            this.node.getChildByName('posCtrl').setRotationFromEuler(0,0,0);  //重置主體Sprite旋轉角度
            this.node.getChildByName('posCtrl').getComponent(UIOpacity).opacity = 255;  //重置地鼠主體Sprite透明度
        }
        //else{ //如果是地鼠才執行...
        //     this.node.getChildByName('Fx_mouse_hit').active = false ; //關閉受擊噴水晶特效
        // }
        this._reelRun.getComponent(reelRun_TA).myPool.put(this.node); //將自身回收進物件池
    }

}


