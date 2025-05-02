import { _decorator, Component, Node, ProgressBar, tween, Label, UIOpacity, Button, Animation, Vec3, Sprite, color, find, Prefab, instantiate, sp, Layout } from 'cc';
import { reelRun_TA} from './reelRun_TA';
import { demoFlow_TA } from './demoFlow_TA';
const { ccclass, property } = _decorator;

//* UI表演功能 *//
@ccclass('uiController_TA')
export class uiController_TA extends Component {
    
    /* 主介面 */
    @property({type: Node, tooltip:'整組能量條+機會事件的UI群組節點', group: { name: 'mainUI', id: '1' }})
    energyBar: Node = null;
    @property({type: [Node], tooltip:'載入對應3種機會事件的能量條', group: { name: 'mainUI', id: '1' }})
    progressBar: Node[] = [];
    @property({type: [Prefab], tooltip:'3種機會事件的預備狀態特效', group: { name: 'mainUI', id: '1' }})
    chanceFx: Prefab[] = [];
    @property({type: [Node], tooltip:'在盤面中心點表演符號', group: { name: 'mainUI', id: '1' }})
    reelStage: Node[] = [];
    @property({type: Node, tooltip:'boun圖示之父物件', group: { name: 'mainUI', id: '1' }})
    bonusUI: Node = null;
    @property({type: Node, tooltip:'機會卡slot', group: { name: 'mainUI', id: '1' }})
    chanceSlot: Node = null;
    @property({type: Node, tooltip:'Spin主按鈕組', group: { name: 'mainUI', id: '1' }})
    controlBtns: Node = null;
    @property({type: Node, tooltip:'購買免費遊戲按鈕', group: { name: 'mainUI', id: '1' }})
    buyFreeGame_btn: Node = null;

    /* 上層UI頁面 */
    @property({ type: Node, tooltip: '免費遊戲轉場', group: { name: 'forwardUI', id: '2' }})
    freeGameGet: Node = null;
    @property({ type: Node, tooltip: '免費遊戲計數', group: { name: 'forwardUI', id: '2'}})
    freeGameTimes: Node = null;
    @property({ type: Node, tooltip: 'bigWin頁面', group: { name: 'forwardUI', id: '2' }})
    bigWin: Node = null;
    @property({ type: Node, tooltip: 'totalWin頁面', group: { name: 'forwardUI', id: '2' }})
    totalWin: Node = null;
    @property({ type: Node, tooltip: '搶分模式轉場', group: { name: 'forwardUI', id: '2' }})
    grabGameGet: Node = null;

    
    /* 分數相關 */
    @property({ type: Node, tooltip: "贏得分數資訊", group: { name: 'scoreUI', id: '3' }})
    public winScoreInfo: Node = null;
    @property({ type: Node, tooltip: "共贏得分數資訊", group: { name: 'scoreUI', id: '3' }})
    public winTotalScoreInfo: Node = null;
    @property({ type: Node, tooltip: "跑馬燈", group: { name: 'scoreUI', id: '3' } })
    private marquee: Node = null;
    @property({ type: Node, tooltip: "贏得分數欄位底框", group: { name: 'scoreUI', id: '3' }})
    private winScoreBg: Node = null;
    @property({ type: Node, tooltip: "贏得分數噴金幣特效", group: { name: 'scoreUI', id: '3' }})
    private spawnCoin: Node = null;

    /* 運行中再加載的節點 */
    private progressParent: Node = null; //能量條的父物件
    private chanceFx_Node: Node = null; //機會事件的預備狀態特效的位置
    private demoFlowTA: demoFlow_TA = null; //獲取demoFlow_TA腳本
    private reelRunTA: reelRun_TA = null; //獲取reelRun_TA腳本
    private chanceFx_Array: Node[] = [null, null, null];  //存放機會事件的預備狀態特效的陣列

    /* 時間參數 */
    private runScoreTime: number = 6;//跑分時間(最多)

    /* 參數列表 */
    private bigWinMultiple = [100, 250, 500, 800]; //切換bigWin分數倍率的門檻
    private bigWin_AniName = ['bigwin', 'mega', 'super']; //bigWinSpine動態名稱

    //UI上bonus圖示的座標X軸，配合3個不同bonus圖示切換
    private bonusIcon_PosX = {
        1: -310,  2: -104,  3: 100 }

    //加成倍率中獎跑分-放射狀掃光特效的顏色(對應不同等級金幣顏色)
    private FxfloorConiColor = {
        0: color(204,180,180,255),  1: color(204,180,180,255),  2: color(204,180,180,255),  3: color(213,161,137,255),  4: color(213,161,137,255),
        5: color(213,161,137,255),  6: color(197,213,224,255),  7: color(197,213,224,255),  8: color(197,213,224,255),  9: color(253,219,110,255),} 

    //機會事件預備狀態特效的3個定位點座標
    private ChanceFx_Pos = {
        0: new Vec3(-375,165,0),    1: new Vec3(-250,165,0),    2: new Vec3(-125,165,0),  3: new Vec3(316,19,0)}  //3:是特效移動的起始位置

    //機會事件卡開牌特效顏色，0:綠-全符號重置  1:紅-二色對調  2:藍-隨機Wild
    private ChanceFx_Color = {
        0: color(50,255,0,255),    1: color(255,30,0,255),    2: color(0,60,255,255)
    }

    //機會卡Slot起始位置
    private slot_startPosY = {
        0: 0, 1: -128, 2: -256
    }

    //機會卡Slot結果位置
    private slot_endPosY = {
        0: -1152, 1: -1280, 2: -1408
    }

    //查詢機會卡Slot現在位置對應的事件ID
    private slot_nowPosY = {
        1152: 0, 1280: 1, 1408: 2
    }

    //查詢金幣倍率符號的加成倍率
    private multiplySym_idToNum ={
        0:0, 1:2, 2:5, 3:10, 4:15, 5:25, 6:50, 7:100, 8:500, 9:1000, 10:10000
    }
        
    start(){
        this.progressParent = this.energyBar.getChildByName('progressBar');  //獲取能量條的父物件
        this.chanceFx_Node = this.energyBar.getChildByName('chanceFx_node');  //獲取機會事件預備狀態特效的座標父物件
        this.demoFlowTA = find('Canvas/TADemo')!.getComponent(demoFlow_TA);
        this.reelRunTA = find('Canvas/TADemo/reelRun_TA')!.getComponent(reelRun_TA);
        
        /* 初始化UI */
        this.controlBtns.active = true; //顯示Spin主按鈕組
        this.buyFreeGame_btn.active = true; //顯示購買免費遊戲按鈕
        this.freeGameTimes.active = false; //關閉免費遊戲計數介面
        this.winTotalScoreInfo.active = false; //隱藏共贏得分數
        this.bigWin.active = false; //隱藏大獎頁面物件
        this.marquee.active = true; //開啟跑馬燈
    }

    /* 運行機會事件slot，轉出一個機會事件卡 */
    randomChanceEventID(eventID: number){ //(eventID:最終要產生的結果ID)
        let _eventID = eventID; //防呆，為避免輸入進來的值是null，再宣告一個值作中繼
        if (_eventID == null) {
            _eventID = 0 ; //如果獲得的值是null，就以0取代
        }
        this.reelRunTA.chanceEventID = _eventID; //將新機會事件ID先登錄上盤面表演腳本
        let _posY = this.chanceSlot.getPosition().y; //取得Slot現在座標
        let _startSymID = this.slot_nowPosY[Math.abs(_posY)]; //用現在的座標來判斷機會卡ID
        this.chanceSlot.setPosition(0,this.slot_startPosY[_startSymID],0); //用當前機會卡ID來轉換設置slot的起始位置
        tween(this.chanceSlot)
        .by(0.5,{position: new Vec3(0,-200,0)},{easing:'backIn'}) //slot起始運轉，下沉再啟動
        .to(1,{position: new Vec3(0,this.slot_endPosY[_eventID],0)},{easing:'elasticOut'}) //slot結束運轉，超過終點再回彈
        .union()
        .call(()=>{
            this.chanceSlot.setPosition(0,this.slot_endPosY[_eventID],0); //為求精確，結束時再設置一次座標
        })
        .start();
    }

    /* 能量條累加 -耗時0.2秒 */
    runProgress(nextEventID: number, energyNum: number) { //(eventID:下一次機會事件ID, energyNum:累加至目標數值)
        if (nextEventID == null) {
            console.error('!!!!!!!!__輸入的下一次機會事件ID為 '+nextEventID +'__!!!!!!!!');
        }
        console.warn(`執行能量條累加功能，當前機會事件ID ${this.reelRunTA.chanceEventID}，累加至 `+ energyNum+'，下一次機會事件ID '+nextEventID);
        let _workBar = this.progressBar[this.reelRunTA.chanceEventID]; //從陣列宣告取得對應事件ID的Bar條
        let _Progress = _workBar.getComponent(ProgressBar); //抓取作用Bar條的進度數值
        let _Test = _workBar.children[0].getChildByName('top');
        if (energyNum == 0) {  //如果能量條是要縮減至0，則關閉作用Bar條的前端的發光特效
            // console.error(`${_workBar.name}及${this.progressParent.children[2].name} 關閉能量條前端特效，進度值 ${energyNum}`);
            _workBar.children[0].getChildByName('top').active = false;
            this.progressParent.children[2].children[0].getChildByName('top').active = false; //防呆，最上層的Bar條跟作用中的前端發光特效都關掉
        }
        if (_workBar.getSiblingIndex()!=2) { //判斷當前要加分的bar條是否在最上層
            _workBar.setSiblingIndex(2); //若不是最上層，則將對應當前事件的bar條移至子物件最上層，成為作用Bar條
            _Progress.progress = 0; //將作用Bar條的進度數值歸0
            // console.error(`${_workBar.name} 關閉能量條前端特效，進度值 ${_Progress.progress}`);
            _workBar.children[0].getChildByName('top').active = false; //關閉作用Bar條的前端的發光特效

            let _lastBar = this.progressParent.children[1]; //從子物件排序抓取前一個事件對應的能量條
            // console.error(`${_lastBar.name} 關閉前一個能量條前端特效，進度值 ${_lastBar.getComponent(ProgressBar).progress}`);
            _lastBar.children[0].getChildByName('top').active = false; //關閉前一個事件能量條前端的發光特效
            let _lastProgress = _lastBar.getComponent(ProgressBar).progress; //抓取前一個事件對應能量條的進度數值
            if (_lastProgress !=1) {  //如果前一個事件的能量條不是集滿狀態就歸O
                _lastProgress = 0;
            }
        }
        let _duration = 0.2 ;  //到達目標數值需要時間
        tween(_Progress).to(_duration, { progress: energyNum },)            
        .call(() => {
            _Progress.progress = energyNum; //緩動完再輸入一次數值，確保跑完的數值精確
            if (energyNum >= 0.05) {
                // console.error(`${_workBar.name} "開啟"能量條前端特效，進度值 ${energyNum}`);
                _workBar.children[0].getChildByName('top').active = true; //如果進度條數值大於0.05則開啟當前作用能量條前端的發光特效
            }
            if (_Progress.progress == 1) { //如果能量條數值已滿
                this.ChanceFx_Add(this.reelRunTA.chanceEventID,nextEventID); //生成預備狀態特效(當前事件ID,下一次機會事件ID)
                this.reelRunTA.chanceEventID = nextEventID; //將即將變更的新機會事件ID預先登錄上盤面表演腳本，避免時間差，下一次運行又累加到前一回能量條
                // console.error(`獲取第${this.demoFlowTA.gameRound}局，下一次(第${this.reelRunTA.chanceEventTimes}次)機會事件ID${nextEventID}`);
            }
        }).start();
    }

    /* 能量條歸零(3組) */
    restProgress(){
        console.warn('restProgress() 所有能量條歸零');
        for (let i = 0; i < this.progressParent.children.length; i++) {
            this.progressParent.children[i].getComponent(ProgressBar).progress = 0; //將3組對應機會事件的能量條都歸0
            // console.log(`關閉所有能量條前端特效`);
            this.progressParent.children[i].children[0].getChildByName('top').active = false; //關閉所有Bar條的前端的發光特效
        }
    }

    /* 生成機會事件預備狀態特效 */
    ChanceFx_Add(eventID: number, nextEventID: number){ //(eventID:當前事件ID, nextEventID:下一次機會事件ID)
        console.warn('ChanceFx_Add() 生成機會事件預備狀態特效，ID '+ eventID);
        let _ChanceFx = instantiate(this.chanceFx[eventID]); //生成機會事件預備狀態特效
        _ChanceFx.setParent(this.chanceFx_Node); //置於特效座標群組節點下
        _ChanceFx.setPosition(316,19,0);  //特效設置與機會卡同座標
        let _chanceIconFx = this.chanceSlot.getParent().getChildByName('fx_chance_Icon_win'); //抓取機會事件卡開牌特效
        _chanceIconFx.active = true; //開啟機會卡開牌特效，啟動後自動播放動畫
        _chanceIconFx.getChildByName('Sprite_spark').getComponent(Sprite).color = this.ChanceFx_Color[eventID]; //配合事件種類調整開牌特效顏色
        _chanceIconFx.getComponent(Animation).play('fx_chance_Icon_win'); //播放開牌特效動畫

        for (let i = 0; i < this.chanceFx_Array.length; i++) { //循環陣列內的3個定位點，選擇空位作為移動的終點
            if (this.chanceFx_Array[i] == null) {  //依序判斷3個位置是否有空位
                tween(_ChanceFx).delay(0.2).to(0.5, { position: this.ChanceFx_Pos[i]}, { easing: 'cubicOut' }) //移動至3個預備特效定位點，delay(0.2)等待機會卡開牌特效表演一會
                .call(() => {
                    _ChanceFx.setPosition(this.ChanceFx_Pos[i]); //為求位置精準，再設置一次座標
                    this.chanceFx_Array[i] = _ChanceFx; //將完成移動的預備特效存入陣列
                    _ChanceFx.getComponent(Animation).play('fx_chanceStandby_idle');  //預備特效啟動待機動畫
                    _chanceIconFx.active = true; //關閉機會事件卡開牌特效
                    this.randomChanceEventID(nextEventID);  //呼叫生成新機會事件ID
                }).start();
                break //成功生成一個即退出循環
            }else if (this.chanceFx_Array[2] != null) {
                _ChanceFx.destroy(); //防呆，如果三個位置都有預備特效則刪除當下第4個特效
            }       
        }
    }

    /* 啟動序列1的事件狀態特效後移除，並依序遞補位置 */
    ChanceFx_Reduce(){
        console.warn('ChanceFx_Reduce() 啟動第一個事件狀態特效後移除，並依序遞補位置');
        if (this.chanceFx_Array[0] != null) { //如果第一個位置有內容就啟動事件狀態特效並於等待後移除
            this.chanceFx_Array[0].getComponent(Animation).play('fx_chanceStandby_effective');  //播放事件啟動狀態特效
            let _symNum = this.chanceFx_Array[0].name.split('_')[2];  //取得符號的名稱，從'_'分割，保留第2部分
            this.progressBar[parseInt(_symNum)].getComponent(Animation).play('fx_progressBar_add'); //播放能量條發光特效，表示對應的機會事件執行中
            this.scheduleOnce(()=>{
                this.progressBar[parseInt(_symNum)].getComponent(Animation).play('fx_progressBar_add_off');; //播放關閉能量條發光特效
                this.progressBar[parseInt(_symNum)].getComponent(ProgressBar).progress = 0 ; //關閉已執行過事件的能量條，進度值歸0
                this.chanceFx_Array[0].destroy(); //移除第一個預備狀態特效
                this.chanceFx_Array[0] = null; //清空陣列1的位置
                if (this.chanceFx_Array[1] != null) {  //如果第二個位置有內容就移至第一個位置
                    const _chanceFx1 = this.chanceFx_Array[1];
                    tween(_chanceFx1).delay(0.1).to(0.2, { position: this.ChanceFx_Pos[0]}, { easing: 'cubicOut' }) //delay(0.2)等待機會卡開牌特效表演一會
                    .call(() => {
                        _chanceFx1.setPosition(this.ChanceFx_Pos[0]); //為求位置精準，再設置一次座標
                        this.chanceFx_Array[0] = _chanceFx1; //將原第二個預備狀態特效存入陣列第一個位置
                        this.chanceFx_Array[1] = null; //清空陣列2的位置
                    }).start();
                    if (this.chanceFx_Array[2] != null) {  //如果第三個位置有內容就移至第二個位置
                        const _chanceFx2 = this.chanceFx_Array[2];
                        tween(_chanceFx2).delay(0.1).to(0.2, { position: this.ChanceFx_Pos[1]}, { easing: 'cubicOut' }) //delay(0.2)等待機會卡開牌特效表演一會
                        .call(() => {
                            _chanceFx2.setPosition(this.ChanceFx_Pos[1]); //為求位置精準，再設置一次座標
                            this.chanceFx_Array[1] = _chanceFx2; //將原第二個預備狀態特效存入陣列第一個位置
                            this.chanceFx_Array[2] = null; //清空陣列2的位置
                        }).start();
                    }
                }
            },2)
            
        }       
    }

    /* 移除所有機會事件預備狀態特效 */
    ChanceFx_ClearAll(){
        console.warn('ChanceFx_ClearAll() 移除所有機會事件預備狀態特效');
        for (let i = 0; i < this.chanceFx_Array.length; i++) {
            if (this.chanceFx_Array[i] != null) {
                this.chanceFx_Array[i].destroy();  //循環移除3個座標的事件特效
                this.chanceFx_Array[i] = null;  //清空陣列內登錄的資料
            }
        }
    }

    /* 能量符號表演 & 呼叫能量條加滿 - 耗時1.3秒 + 跑能量條0.2*/
    energySym(nextEventID: number){ //(nextEventID:下一次機會事件ID)
        console.warn('執行加能量符號表演&呼叫能量條加滿功能，輸入的下一次機會事件ID'+nextEventID);
        this.reelStage[1].active = true;
        this.reelStage[1].getComponent(Animation).play('sym_ShowFx'); //特效淡入動畫(時長0.1秒)
        this.scheduleOnce(()=>{
            tween(this.reelStage[1]).to(0.3, { position: new Vec3(-400,608,0),scale: new Vec3(0.35,0.35,0.35)}, { easing: 'circOut' })  //表演符號移至能量條上
            .call(() => {
                this.reelStage[1].active = false;
                this.reelStage[1].setPosition(0,132,0);
                this.reelStage[1].setScale(2.8,2.8,2.8);
                this.runProgress(nextEventID, 1); //呼叫能量條加滿涵式
            }).start();
        },1) //等待符號在畫面中央稍作表演
    }

    /* bonus符號表演 -耗時1.3秒 */
    bonusSym(bonusNum: number){
        // console.warn('執行Bonus符號表演功能');
        this.reelStage[0].active = true;
        this.reelStage[0].getComponent(Animation).play('sym_ShowFx'); //特效淡入動畫(時長0.1秒)
        this.scheduleOnce(()=>{
            // console.log('bonus符號移動終點座標'+new Vec3(this.bonusIcon_PosX[bonusNum],682,0));
            tween(this.reelStage[0]).to(0.3, { position: new Vec3(this.bonusIcon_PosX[bonusNum],682,0),scale: new Vec3(0.5,0.5,0.5)}, { easing: 'circOut' })  //表演符號移至UI上
            .call(() => {
                this.reelStage[0].active = false;
                this.reelStage[0].setPosition(0,132,0);
                this.reelStage[0].setScale(3,3,3);
                this.bonusUI.children[bonusNum-1].active = true; //開啟對應的Bonus圖示
                if (this.reelRunTA.bonusNum == 3) { //如果Bonus圖示已滿
                    this.show_freeGameReday(); //呼叫Bonus符號數量加滿表演涵式
                }
                
            }).start();
        },1) //等待符號在畫面中央稍作表演
    }

    /* 倍率加乘符號噴金幣表演-耗時2秒*/
    multiplySym(floorCoinID: number){ //(倍率金幣ID, 得分)
        console.warn('執行加乘符號表演功能，啟動加乘倍率的ID'+floorCoinID);
        this.reelStage[2].active = true;
        this.reelStage[2].getChildByName('posCtrl').children[floorCoinID-1].active = true; //開啟對應的加乘倍率中獎貼圖
        this.reelStage[2].getChildByName('radial_Ray').getComponent(Sprite).color = this.FxfloorConiColor[floorCoinID-1]; //放射狀掃光特效-設定對應不同等級金幣的顏色
        this.reelStage[2].getComponent(Animation).play('floorSym_stage_win'); //畫面中大符號出現+噴金幣特效(時長1.33秒)
        let _score = this.multiplySym_idToNum[floorCoinID] * this.demoFlowTA.betScore; //計算金幣獎金 = 倍率倍數 * 下注金額
        let _label = this.reelStage[2].getChildByName('score').children[0].getComponent(Label); //抓取到跑分的Label
        this.runScore(_label, 1.2, _score); //呼叫跑分涵式，表演金幣跑分
        setTimeout(()=>{
            this.reelStage[2].getComponent(Animation).play('floorSym_stage_fadeOut'); //淡出效果動畫(時長0.17秒)
            // this.reelRunTA.winTotalScore = this.reelRunTA.winTotalScore + _score; //金幣獎金加入總得分
            setTimeout(()=>{
                this.reelStage[2].active = false; //關閉畫面中大符號
                this.reelStage[2].getChildByName('posCtrl').children[floorCoinID-1].active = false; //關閉對應的加乘倍率中獎貼圖
            },500) //等待淡出表演時間
        },2000) //等待符號在畫面中央稍作表演
    }

    /* 運行跑分 */
    runScore(scoreLabel: Label, duration: number, endScore: number){  //scoreLabel:跑分的Label，duration:跑分過程需時，endScore:跑分結果分數
        let _startScore = 0; //起始分數
        let _runScore = {score: _startScore }  //設置起始分數
        scoreLabel.node.getComponent(UIOpacity).opacity = 255;
        tween(_runScore).to(duration, { score: endScore },{
            easing: "backIn",
            onUpdate: () => {
                scoreLabel.string = _runScore.score.toFixed(2).toString();//更新分數(限制小數點2位數)
                // console.warn('更新分數'+_runScore.score.toFixed(2).toString());
            }
        }).call(() => {
            scoreLabel.string = endScore.toString();//更新分數
            this.reelRunTA.winTotalScore = this.reelRunTA.winTotalScore + endScore; //金幣獎金加入總得分
            this.reelRunTA.bonusTotalScore = this.reelRunTA.bonusTotalScore + endScore; //金幣獎金加入bonusGame總得分
            this.show_WinTotalScore(this.reelRunTA.winTotalScore); //UI得分欄顯示總得分
        }).start();
    }

    /* 關閉所有Bonus圖示 */
    hide_BonusIcon(){
        this.bonusUI.children.forEach(element => {
            element.active = false;
            element.getChildByName('Particle_glow').active = false; //關閉Bonus圖示的發光粒子特效
        });
        // for (let child of this.bonusUI.children) {  //對子物件依序執行
        //     child.active = false;
        // }
    }

    /* 啟動Bonus圖示集滿效果 */
    show_freeGameReday(){
        for (let i = 0; i < this.bonusUI.children.length; i++) {
            this.bonusUI.children[i].getComponent(Animation).play('bonusIcon_scale_Loop'); //播放Bonus圖示集滿效果
        }
    }

    /* 啟動BonusGame(FG)轉場頁面 */
    async freeGameGet_UI(FG_TotalTimes: number):Promise<void>{
        return new Promise((resolve) => {
            this.freeGameGet.active = true; //開啟FG轉場頁面
            this.freeGameGet.getComponent(Animation).play('freeGame_Get_show'); //播放FG轉場頁面啟動動畫
            let _UIOpacity = this.freeGameGet.getComponent(UIOpacity);
            _UIOpacity.opacity = 255;
            this.controlBtns.active = false; //關閉Spin主按鈕組
            this.buyFreeGame_btn.active = false; //關閉購買BonusGame按鈕
            let _TotalTimes = this.freeGameTimes.getChildByName('Times_num').getChildByName('Label_Total_num').getComponent(Label); //取得總次數label
            _TotalTimes.string = FG_TotalTimes.toString(); //設定總次數
            this.freeGameTimes.active = true; //開啟FG計數介面

            tween(_UIOpacity).delay(2).to(0.2, { opacity: 0 })
            .call(() => {
                _UIOpacity.opacity = 0; //復原lable透明度
                this.freeGameTimes.getComponent(Animation).play('freeGame_Times_totalScale');  //播放FG總次數提示動畫
                this.reelRunTA.freeGameMode = true;  //標記FreeGame執行中狀態
                this.reelRunTA.bonusNum = 0;  //重置Bonus數量
                this.hide_BonusIcon();  //關閉所有Bonus圖示
                resolve();   //通知原呼叫涵式
            }).start();  //讓UI漸淡消失
        });
    }

    /* 啟動搶分模式轉場頁面 */
    async grabGameGet_UI():Promise<void>{
        return new Promise((resolve) => {
            this.grabGameGet.active = true; //開啟FG轉場頁面
            this.grabGameGet.getComponent(Animation).play('freeGame_Get'); //播放FG轉場頁面啟動動畫

            setTimeout(() => {
                this.grabGameGet.active = false; //關閉搶分模式轉場頁面
                resolve();   //通知原呼叫涵式
            }, 2000);
        });
    }

    /* 啟動TotalWin跑分頁面 */
    async totalWinRunning(totalScore: number):Promise<void>{
        console.warn('執行TotalWin結算頁面功能，輸入的總得分 '+totalScore);
        return new Promise((resolve) => {
            this.totalWin.active = true; //開啟TotalWin結算頁面
            this.totalWin.getComponent(Animation).play('total_win_show'); //播放結算頁面啟動動畫
            let _UIOpacity = this.totalWin.getComponent(UIOpacity);
            _UIOpacity.opacity = 255;
            let _scoreLabel = this.totalWin.children[0].getChildByName('Label_score').getComponent(Label); //取得跑分label
            let _Score = {score: 0 }  //設置起始分數，宣告一個內含score:參數的項目
            _scoreLabel.string = _Score.toString(); //設定跑分label初始值
            tween(_Score).to(2, { score: totalScore },{  //運行跑分
                onUpdate: () => {
                    _scoreLabel.string = _Score.score.toFixed(2).toString(); //更新分數(限制小數點2位數)
                    // console.log('TotalWin跑分'+_Score.score.score.toFixed(2).toString());
                }
            }).call(() => {
                _scoreLabel.string = totalScore.toFixed(2).toString(); //輸入跑分終點數值
            }).start();
            
            tween(_UIOpacity).delay(3).to(0.2, { opacity: 0 })  //延遲3秒，等待跑分動畫結束停頓一會再啟動漸淡消失
            .call(() => {
                this.controlBtns.active = true; //重啟Spin主按鈕組
                this.buyFreeGame_btn.active = true; //重啟購買BonusGame按鈕
                this.freeGameTimes.active = false; //關閉FG計數介面
                _UIOpacity.opacity = 0; //復原lable透明度
                this.reelRunTA.freeGameMode = false;  //標記FreeGame狀態結束
                this.reelRunTA.bonusTotalScore = 0; //重置BonusGame累加分數
                resolve();   //通知原呼叫涵式
            }).start();  //讓UI漸淡消失
        });
    }

    /* FG計數介面的計次變動 */
    freeGameTimes_minus(freeGameLeftover: number){
        setTimeout(() => {
            console.error(`執行freeGameTimes_minus()，freeGameLeftover輸入數值`+ freeGameLeftover);
            let _labelTimes = this.freeGameTimes.getChildByName('Times_num').getChildByName('Label_Times_num').getComponent(Label); //取得計次label
            // console.error(`freeGameTimes_minus()，freeGameLeftover計算後數值`+ _freeGameLeftover); 
            _labelTimes.string = freeGameLeftover.toString();
            this.freeGameTimes.getComponent(Animation).play('freeGame_Times_useScale');  //播放FG總次數提示動畫
        }, 200); //延遲一點，讓符號掉落先啟動
    }

    /* 執行大獎跑跑分(滑鼠點擊後直接跳結果) */
    async bigWinRunning(betScore: number, winS: number):Promise<void>{  //(下注金額，該局總得分)
        console.warn(`執行bigWinRunning() 下注金額：${betScore}，輸入分數值：`+ winS);
        return new Promise((resolve) => {
            // const ws = this.demoInfoTA.symData[this.gameRound].ws;//共贏分
            // console.warn(`執行bigWinRunning() 抓取第${this.gameRound}回合分數值：`+ ws);
            const runningScoreLabel = this.bigWin.getChildByName("label").getComponent(Label);  //抓取跑分label
            runningScoreLabel.string = "0";//清空跑分
            this.bigWin.active = true;//顯示跑分物件
            this.bigWin.getComponent(Button).interactable = true;//啟用按鈕
            this.bigWin.getComponent(Animation).play("bigWinReset");
            let AniNameID = 0;  //作為bigWin的動畫名稱ID
            const bigWinSpine = this.bigWin.getChildByName("spine").getComponent(sp.Skeleton);
            bigWinSpine.setAnimation(0, this.bigWin_AniName[AniNameID] + '_in', false);//進場
            bigWinSpine.setCompleteListener(() => {
                bigWinSpine.setAnimation(0, this.bigWin_AniName[AniNameID] + '_loop', true);//循環播放
                bigWinSpine.setCompleteListener(null);//結束監聽
            })
            //等待跑分結束(回傳)
            const runBigWinScore = { score: 0 };//設置起始分
            tween(runBigWinScore).to(this.runScoreTime, { score: winS }, {
                onUpdate: () => {
                    runningScoreLabel.string = runBigWinScore.score.toFixed(2);//更新分數至label，並限制小數點2位數
                    if (AniNameID < 3 && runBigWinScore.score > betScore * this.bigWinMultiple[AniNameID]) {  //(動畫ID<3 && 跑分>下注金額倍數)，才進行下一個動畫
                        AniNameID++;//判斷下個階段
                        console.warn('BigWin階段ID：'+ AniNameID);
                        bigWinSpine.setAnimation(0, this.bigWin_AniName[AniNameID] + '_in', false);//進場
                        bigWinSpine.setCompleteListener(() => {
                            bigWinSpine.setAnimation(0, this.bigWin_AniName[AniNameID] + '_loop', true);//循環播放
                            bigWinSpine.setCompleteListener(null); //結束監聽
                        })
                    }
                }
            }).call(() => {
                runningScoreLabel.string = winS.toFixed(2); //顯示最終精準的分數值
                resolve();   //通知原呼叫涵式
            }).start();
        });
    }

    //執行bigWin跑分結束
    async bigWinOver(winS: number):Promise<void>{
        console.log('執行bigWinOver() 跑分結束，輸入分數值：'+winS);
        return new Promise((resolve) => {
            // console.warn(`執行bigWinRunning() 抓取第${this.gameRound}回合分數值：`+ ws);
            this.bigWin.getComponent(Button).interactable = false; //禁用bigWin按鈕反應
            const runningScoreLabel = this.bigWin.getChildByName("label").getComponent(Label); //抓取跑分label
            runningScoreLabel.string = winS.toFixed(2);  //設置最終獲得分數
            this.bigWin.getComponent(Animation).play("bigWinOver");
            setTimeout(async() => {
                this.reelRunTA.bigWinState = false; //標示bigWin執行結束
                this.bigWin.active = false;//隱藏跑分物件
                console.log('呼叫showWinTotalScore() bigWin結束，顯示共贏得分數(小字)');
                this.show_WinTotalScore(winS);//顯示得分框欄位的共贏得分數
                resolve();   //通知原呼叫涵式
            },2000) //等待"bigWinOver"動畫播完
        });
    }

    //UI得分欄-顯示總贏得分數，2秒後復原回跑馬燈
    show_WinTotalScore(score: number) {
        console.log('執行show_WinTotalScore() 顯示得分框共贏得分數：'+score);
        this.winTotalScoreInfo.getChildByName('score').getChildByName('label').getComponent(Label).string = score.toFixed(2); //共贏分設置
        this.marquee.getComponent(UIOpacity).opacity = 0; //隱藏跑馬燈
        this.winTotalScoreInfo.active = true;//顯示共贏得
        this.winTotalScoreInfo.getComponent(Animation).play('totalscoreShow_onlyLabel');

        // setTimeout(() => {
        //     this.winTotalScoreInfo.active = false;//關閉總贏得分數
        //     let _marqueeUIOpacity = this.marquee.getComponent(UIOpacity); //抓取跑馬燈的UIOpacity組件
        //     _marqueeUIOpacity.opacity = 0
        //     tween(_marqueeUIOpacity).to(0.3, { opacity: 255 }).start();  //顯示跑馬燈
        // },2000)

    }

    //隱藏共贏得分數(得分框欄位)，並復原跑馬燈
    hide_WinTotalScore(){
        this.winTotalScoreInfo.active = false;//關閉共贏得分數
        let _marqueeUIOpacity = this.marquee.getComponent(UIOpacity); //抓取跑馬燈的UIOpacity組件
        _marqueeUIOpacity.opacity = 0
        tween(_marqueeUIOpacity).to(0.3, { opacity: 255 }).start();  //顯示跑馬燈
    }

    //共贏得分數(得分框欄位)歸零&得分框回歸基本款
    reset_WinTotalScore() {
        this.winTotalScoreInfo.getChildByName('score').getChildByName('label').getComponent(Label).string = 0.00.toFixed(2); //共贏得分數歸零
        this.reelRunTA.winTotalScore = 0; //累加分數歸零
        this.winScoreBg.children[0].active = true; //開啟基本款得分框
        this.winScoreBg.children[1].active = false;
        this.winScoreBg.children[2].active = false;
        setTimeout(()=>{
            this.spawnCoin.active = false; //關閉噴金幣特效
        },1000);
    }

    //一局結束後 - 顯示大字總贏得分數
    show_LargeWinScore(score: number) {
        console.error('執行 showWinScore()顯示贏得分數 '+score);
        this.winScoreInfo.getChildByName('score').getChildByName('label').getComponent(Label).string = score.toFixed(2);//贏分設置
        this.winScoreInfo.active = true; //顯示贏得分數

        /* 如果贏分超過10倍賠率，開啟噴金幣特效 */
        if (score > this.demoFlowTA.betScore*10) {
            this.spawnCoin.active = true; //開啟噴金幣特效
            this.marquee.getComponent(UIOpacity).opacity = 0; //隱藏跑馬燈
            this.winTotalScoreInfo.active = true;//顯示共贏得
            this.winTotalScoreInfo.getChildByName('score').getChildByName('label').getComponent(Label).string = score.toFixed(2); //顯示共贏得分數
            this.winTotalScoreInfo.getComponent(Animation).play('totalscoreShow');  //播放總贏得分數出現動畫
        }
        // if (scoreBg > 0) {
        //     if (!this.winScoreBg.children[scoreBg].active) {  //如果要開啟的得分框現在非啟動中才執行，為了作到有變換得分框材播動畫
        //         for (let child of this.winScoreBg.children) {  //先關閉所有得分框
        //             child.active = false;
        //         }
        //         this.winScoreBg.children[scoreBg].active = true; //開啟升級版得分框
        //         this.winScoreBg.children[scoreBg].getComponent(Animation).play('winScoreBg'); //播放換得分框動畫
        //     }
        // }
        
        setTimeout(()=>{
            this.winScoreInfo.active = false; //隱藏贏得分數
        },1500)

        setTimeout(() => {
            this.spawnCoin.active = false; //關閉噴金幣特效
            this.winTotalScoreInfo.active = false;//關閉贏得欄總贏得分數
            let _marqueeUIOpacity = this.marquee.getComponent(UIOpacity); //抓取跑馬燈的UIOpacity組件
            _marqueeUIOpacity.opacity = 0
            tween(_marqueeUIOpacity).to(0.3, { opacity: 255 }).start();  //顯示跑馬燈
        },2500)
    }
}
