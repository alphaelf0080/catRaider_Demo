import { _decorator, Component, Node, Enum, Camera, tween, UITransform, Vec2, math, Animation, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

//* 盤面尺寸調整 *//
@ccclass('reelSize_TA')
export class reelSize_TA extends Component {

    @property({ type: Camera, tooltip: '拍攝盤面的攝影機'})  
    public reelCamera: Camera = null;

    // @property({ type: Camera, tooltip: '盤面攝影機父物件'})  
    // public CameraParent: Node = null;

    @property({ type: Node, tooltip: '盤面Root節點'})  
    public reel: Node = null;

    @property({ type: Node, tooltip: '盤面底層格'})  
    public groundLayer: Node = null;

    /* 參數列表 */
    //盤面行列數，由下拉式選單轉換對應數值
    private CameraPos = {
        0: new Vec3(0,1860,1127),    1: new Vec3(0,2200,1324),    2: new Vec3(0,2570,1538),   3: new Vec3(0,2956,1761) 
        //前一版數值  0: new Vec3(0,1733,1054),    1: new Vec3(0,2091,1281),    2: new Vec3(0,2429,1480),   3: new Vec3(0,2801,1710) 
    }   //行列各5X5、6X6，7X7，8X8
    
    //攝影機拍攝範圍尺寸，由下拉式選單轉換對應數值
    private camOrthoHeight = {
        0: 960,   //5X5盤面尺寸
        1: 1152,  //6X6盤面尺寸
        2: 1344,  //7X7盤面尺寸
        3: 1536,  //8X8盤面尺寸
    }

    //攝影機拍攝位置校正
    private camPosY = {
        0: 0,   //5X5盤面
        1: 10,  //6X6盤面
        2: 20,  //7X7盤面
        3: 30,  //8X8盤面
    }

    //背景尺吋，由下拉式選單轉換對應數值，變動尺寸才能讓Layout控制正確居中
    private bgContentSize = {
        0: 1080,  //5X5盤面尺寸
        1: 1296,  //6X6盤面尺寸
        2: 1512,  //7X7盤面尺寸
        3: 1728,  //8X8盤面尺寸
    }

    ChangeReelSize(rSize: number) {
        /* 原底層格崩落 */
        console.log('場景等級 '+ rSize +'，轉換拍攝範圍距離 '+this.CameraPos[rSize]);  //打印盤面選單轉換成要輸入的數值
        this.reel.getComponent(Animation).play('bigQuake'); //播放震動動畫
        for (let i = 0; i < rSize; i++) {
            this.groundLayer.children[i].active = true;
            this.groundLayer.children[i].getComponent(Animation).play('ground_collapse_'+i.toString());  //播放地板崩塌動畫
            console.log('播放底層格崩塌動畫，區域：'+ i);
        }

        /* 淡入擴張尺寸後底層格 */
        this.scheduleOnce(function() {
            let _uiTransform = this.groundLayer.getComponent(UITransform);
            tween(_uiTransform).to(0.3, { width: this.bgContentSize[rSize] }, { easing: 'circOut' }).start(); //調整底層格寬度，參照當前盤面選單
            tween(_uiTransform).to(0.3, { height: this.bgContentSize[rSize] }, { easing: 'circOut' }).start(); //調整底層格高度，參照當前盤面選單
            for (let i = 0; i < rSize; i++) {
                this.groundLayer.children[i].getComponent(Animation).play('ground_reset_'+i.toString());  //重置擴張前尺寸的地板旋轉縮放透明數值
            }
            for (let i = 0; i <= rSize; i++) {
                this.groundLayer.children[i].active = true;  //開啟擴張範圍內的底層
            }

            let _reelOpacity = this.reel.getComponent(UIOpacity);
            _reelOpacity.opacity = 0;
            tween(_reelOpacity).to(0.7, { opacity: 255}, { easing: 'circOut' }).start();  //整體盤面淡入顯示

            /* 調整Camera拍攝範圍 */
            tween(this.reelCamera.node.parent).to(0.7, { position: this.CameraPos[rSize] }, { easing: 'circOut' })  //緩動拍攝範圍，盤面由小變大
            .call(() => {
                this.reelCamera.node.parent.setPosition(this.CameraPos[rSize]); //設置攝影機拍攝的尺寸範圍 
                // console.log('設置盤面攝影機尺寸 '+ this.reelCamera.orthoHeight);
                this.reel.getComponent(Animation).stop(); //停止震動動畫
                this.reel.setPosition(0,0,0); //強制將軸面歸回原座標
           }).start();
        }, 1);  //等待地板崩塌表演完
    }

    /* 重置底層格&攝影範圍尺寸 */
    ResetReelSize() {
        /* 原盤面漸淡消失 */
        let _reelOpacity = this.reel.getComponent(UIOpacity);
        _reelOpacity.opacity = 255;
        tween(_reelOpacity).to(0.5, { opacity: 0}).start();  //整體盤面淡出隱藏

        tween(this.reelCamera.node.parent).to(0.5, { position: new Vec3(0,4130,2477) }, { easing: 'circOut' })  //緩動拍攝範圍，盤面由大變小
        .call(() => {
            this.reelCamera.node.parent.setPosition(new Vec3(0,4130,2477)); //緩動結束，攝影機回原座標定位 
            console.log('設置盤面攝影機位置 '+ this.reelCamera.node.parent.position);
        }).start();

        /* 復原崩落的底層格 */
        this.scheduleOnce(function() {
            for (let i = 1; i < 4; i++) {
                this.groundLayer.children[i].active = false;  //隱藏基本範圍之外的底層格
            }
            tween(_reelOpacity).to(0.7, { opacity: 255}, { easing: 'circOut' }).start();  //整體盤面淡入顯示
            this.groundLayer.children[0].getComponent(Animation).play('ground_collapse_reverse');  //播放地板復原的動畫
            this.reel.getComponent(Animation).play('bigQuake'); //播放震動動畫
            let _uiTransform = this.groundLayer.getComponent(UITransform);
            tween(_uiTransform).to(0.3, { width: this.bgContentSize[0] }, { easing: 'circOut' }).start(); //調整底層格寬度至5X5盤面
            tween(_uiTransform).to(0.3, { height: this.bgContentSize[0] }, { easing: 'circOut' }).start(); //調整底層格高度至5X5盤面

            this.scheduleOnce(function() {
                tween(this.reelCamera.node.parent).to(0.5, { position: new Vec3(0,1860,1127) }, { easing: 'circOut' })  //緩動拍攝範圍，盤面由大變小
                .call(() => {
                    this.reelCamera.node.parent.setPosition(new Vec3(0,1860,1127)); //設置攝影機拍攝範圍拉至5X5尺寸 
                    console.log('設置盤面攝影機位置 '+ this.reelCamera.node.parent.position);
                    this.reel.getComponent(Animation).stop(); //停止震動動畫
                    this.reel.setPosition(0,0,0); //強制將軸面歸回原座標
                }).start();
            }, 0.2);  //等待地板復原表演接近完成
        }, 0.5);  //等待整體盤面淡出隱藏時間
    }

    /* 開啟搶分模式地板 */
    show_grabFloor(rSize: number){
        console.error(`執行show_grabFloor()，開啟搶分模式地板，場景等級 ${rSize}`);
        for (let i = 0; i <= rSize; i++) {
            this.groundLayer.children[i].active = true;
            this.groundLayer.children[i].getComponent(Animation).play('ground_show_grabFloor_'+i.toString());  //播放啟動搶分模式地板
            console.log('播放啟動搶分模式地板動畫，區域：'+ i);
        }
    }

    /* 播放搶分模式地板特效 */
    run_grabFloorFx(rSize: number){
        console.error(`執行show_grabFloor()，開啟搶分模式地板，場景等級 ${rSize}`);
        for (let i = 0; i <= rSize; i++) {
            this.groundLayer.children[i].getComponent(Animation).play('ground_grabFloor_0_lv'+i.toString());  //播放啟動搶分模式地板閃爍效果
            console.log('播放啟動搶分模式地板動畫，區域：'+ i);
        }
    }
}


