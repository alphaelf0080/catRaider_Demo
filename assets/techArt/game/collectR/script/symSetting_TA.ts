import { _decorator, Component, Node, SpriteFrame, Sprite, Animation, find, UIOpacity, color, ParticleSystem } from 'cc';
import { symResource_TA } from './symResource_TA';
import { reelRun_TA } from './reelRun_TA';
import poolHandler from '../../../common/script/poolHandler';
const { ccclass, property } = _decorator;

//* 符號功能(除角色符號)，掛在符號上 *//
@ccclass('symSetting_TA')
export class symSetting_TA extends Component {

    @property({ type: [SpriteFrame], tooltip: "symbol圖" })
    public symLevelPicN: SpriteFrame[] = []!;

    @property({ type: [SpriteFrame], tooltip: "模糊版symbol圖" })
    public symLevelPicB: SpriteFrame[] = []!;

    private _reelRun: Node = null;
    
    private _Animation: Animation = null;

    private symbolResourceTA: symResource_TA = null;  //素材資源腳本

    //Wild符號切換對應連線符號的顏色
    private FxColor = {
        0: color(255,59,154,220),    1: color(255,173,0,200),    2: color(51,255,0,200),   3: color(0,102,255,200) }   //(子物件順序ID)值越小越後排

    start(){
        this._reelRun = find('Canvas/TADemo/reelRun_TA')!;  //找尋Canvas之下的reelRun_TA節點
        this.symbolResourceTA = find('Canvas/TADemo/symResource_TA').getComponent(symResource_TA);  //找尋symResource_TA節點下的素材資源腳本
        this._Animation = this.node.getComponent(Animation);
    }


    /* 符號升級表演 */
    LevelUp(symPicID: number){
        console.error(`升級符號，輸入貼圖ID:${symPicID}`);
        this._Animation.play('sym_LevelUp'); //播放符號升級特效
        this.setSymLevelPic(symPicID); //呼叫依Level置換貼圖涵式
        console.error(`呼叫setSymLevelPic，輸入貼圖ID:${symPicID}`);
    }
       
    /* 依照Level置換符號貼圖 */
    setSymLevelPic(symPicID: number) {
        if (symPicID>0 && symPicID<=8) { //防呆，貼圖索引只有1~8
            this.node.children[1].getChildByName('sym_Sprite').getComponent(Sprite).spriteFrame = this.symLevelPicN[symPicID-1]; //置換正常版貼圖，-1 輸入1時讀入索引0
            this.node.children[1].getChildByName('sym_Sprite').children[0].getComponent(Sprite).spriteFrame = this.symLevelPicN[symPicID-1]; //置換正常版貼圖，-1 輸入1時讀入索引0
            this.node.children[1].getChildByName('sym_Sprite_blur').getComponent(Sprite).spriteFrame = this.symLevelPicB[symPicID-1]; //置換模糊版貼圖，-1 輸入1時讀入索引0
        }else{
            console.error(`符號貼圖索引數值錯誤:${symPicID}，只接受1~8`);
        }
    }

    /* 開始落下 */
    dropStarting(){
        this.node.children[1].getChildByName('sym_Sprite').active = false; //關閉清楚版符號貼圖
        this.node.children[1].getChildByName('sym_Sprite_blur').active = true;  //開啟模糊版符號貼圖
    }

    /* 落下結束(到達盤面定位) */
    dropEnding(){
        this._Animation.play('sym_DropEnd'); //掉落結束時播放回彈動畫
        this.node.children[1].getChildByName('sym_Sprite').active = true; //開啟清楚版符號貼圖
        this.node.children[1].getChildByName('sym_Sprite_blur').active = false;  //關閉模糊版符號貼圖
        this._Animation.on(Animation.EventType.FINISHED, this.symIdle, this)  //動畫播完時呼叫要執行的事件(涵式)
    }

    /* 待機狀態 */
    symIdle(){
        let _Anispeed = (13-(Math.random()*6))*0.1; //亂數產生一個0.7~1.3的數值
        let _AnispeedFix = _Anispeed.toFixed(2); //保留小數點後二位數，同時會被轉為字串
        let _AnispeedFlot = parseFloat(_AnispeedFix); //把字串轉為浮點數
        // console.warn('符號待機播放速度'+_AnispeedFlot)
        this._Animation.play('sym_Idle'); //播放待機動畫
        this._Animation.getState('sym_Idle').speed = _AnispeedFlot;  //差異化每個動畫播放速度
    }
    
    /* 消除符號 */
    symRemove(){
        // console.log('symRemove() 刪除符號自身');
        this._Animation.play('sym_Remove'); //播放消除動畫
        let _symName = this.node.name;  //取得符號自身的名稱
        setTimeout(() => {
            if (_symName == 'SymS_3') {
                let _WildSprite = this.node.getChildByName('posCtrl').getChildByName('sym_Sprite').getComponent(Sprite); //獲取Wild符號的Sprite
                _WildSprite.spriteFrame = this.symbolResourceTA.WildTexture[4]; //重置Wild貼圖，回到預設顏色
            }
            this.symPool_Recovery(); //重置設定並回收進物件池
        },500)
    }

    /* 符號啟動並消除 */
    symLaunch(colorSymID: number){
        // console.log('符號啟動並消除');
        this._Animation.play('sym_Launch'); //播放消除動畫
        let _FxLaunch = this.node.getChildByName('posCtrl').getChildByName('Fx_Launch'); //獲取符號上的功能啟動特效
        _FxLaunch.active = true; //開啟符號功能啟動特效
        _FxLaunch.getComponent(ParticleSystem).startColor.color = this.FxColor[colorSymID]; //依連線的符號顏色調整特效顏色
        let _symName = this.node.name;  //取得符號自身的名稱
        setTimeout(() => {
            if (_symName == 'SymS_3') {
                let _WildSprite = this.node.getChildByName('posCtrl').getChildByName('sym_Sprite').getComponent(Sprite); //獲取Wild符號的Sprite
                _WildSprite.spriteFrame = this.symbolResourceTA.WildTexture[4]; //重置Wild貼圖，回到預設顏色
            }
            this.symPool_Recovery(); //重置設定並回收進物件池
        },1150)
    }

    /* 舊符號轉換並消除 */
    symExchange_Out(){
        console.log('reflash事件-舊符號消除 symExchange_Out() '+this.node.name);
        this._Animation.play('sym_Exchange_out'); //播放轉換放大並消失動畫
        setTimeout(() => {
            this.symPool_Recovery(); //重置設定並回收進物件池
            // console.warn(`發送 symExchange_Out() 已執行結束`);
        },330)
    }

    /* 新符號轉換出現 */
    symExchange_In(){
        this.scheduleOnce(()=>{
            console.log('reflash事件-新符號出現 symExchange_In() '+this.node.name);
            this.node.getComponent(UIOpacity).opacity = 255;
            this._Animation.play('sym_Exchange_in'); //播放發光轉換出現動畫
            this._Animation.on(Animation.EventType.FINISHED, this.symIdle, this);   //探測動作是否播放完畢，若完成則呼叫待機涵式
        },0.335)
    }

    /* 重置狀態並回收進物件池 */
    symPool_Recovery(){
        console.log('symPool_Recovery() 執行重置狀態並回收進物件池 '+ this.node.name);
        this.node.setScale(1,1,1);
        this.node.getComponent(UIOpacity).opacity = 255;  //回收前將自身透明度重置，避免再次取用時透明度異常
        let _FxLaunch = this.node.getChildByName('posCtrl').getChildByName('Fx_Launch'); //獲取符號上的功能啟動特效
        if (_FxLaunch != null) {
            _FxLaunch.active = false; //關閉符號作用啟動特效
        }
        this.node.getChildByName('posCtrl').setPosition(0,0,0); //確認符號貼圖歸0
        this.node.getChildByName('posCtrl').getChildByName('sym_Sprite').active = true ; //確認符號貼圖開啟
        this.node.getChildByName('posCtrl').getChildByName('sym_Sprite').children[0].getComponent(UIOpacity).opacity = 0 ; //確認符號加色效果關閉
        this.node.getChildByName('posCtrl').getChildByName('sym_Sprite_blur').active = false ; //關閉模糊狀態貼圖
        let _symName = this.node.name.split('_')[0];  //取得符號名稱的第一部分
        if (_symName == 'SymN') {  //如果是一般符號才執行...
            this.node.getChildByName('Particle_Link').active = false; //關閉符號上的連線特效
        }
        this._reelRun.getComponent(reelRun_TA).myPool.put(this.node); //將自身回收進物件池
    }

    /* 震動動態(地鼠吸入周邊符號前的震動) */
    symShock(){
        let _Anispeed = (25-(Math.random()*5))*0.1; //亂數產生一個2~2.5的數值(25-(0~5)x0.1)
        let _AnispeedFix = _Anispeed.toFixed(2); //保留小數點後二位數，同時會被轉為字串
        let _AnispeedFlot = parseFloat(_AnispeedFix); //把字串轉為浮點數
        console.warn('符號震動播放速度'+_AnispeedFlot)
        let _setTime = Math.random()*2; //亂數產生一個0~2的數值
        let _setTimeFix = _setTime.toFixed(2); //保留小數點後二位數，同時會被轉為字串
        let _setTimeFlot = parseFloat(_setTimeFix); //把字串轉為浮點數
        console.warn('符號震動動畫起始時間'+_setTimeFlot)
        this._Animation.getState('sym_mouse_shock').setTime(_setTimeFlot);  //差異化每個動畫起始時間點
        this._Animation.play('sym_mouse_shock');   //播放震動動
        this._Animation.getState('sym_mouse_shock').speed = _AnispeedFlot;  //差異化每個動畫播放速度    
    }

    /* 被地鼠吸入(地鼠生成的位置) */
    symSuck(){
        console.log('symSuck() 執行符號被地鼠吸入')
        this._Animation.play('sym_mouse_suckIn'); //播放被地鼠吸入動畫
        setTimeout(() => {
            // console.error('!!!!!symPool_Recovery() 呼叫次數!!!!!')
            this.symPool_Recovery(); //重置設定並回收進物件池
        },500)
    }
}


