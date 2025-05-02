import { _decorator,EventTarget,Label,Component,Node, find,Vec2, Button, EventHandler ,Sprite,color, EditBox} from 'cc';
import { demoInfo_TA } from './demoInfo_TA';
import { reelRun_TA } from './reelRun_TA';
import { demoInfo_bonus_TA } from './demoInfo_bonus_TA';

import { symResource_TA } from './symResource_TA';
import {} from '../../../../inputData/dataStructure';
import {convertLineAwardData,requestJsonData,convertSymCordData_initial,loadAllResourceData} from '../../../../inputData/dataOperate';
import {assetData} from '../../../../inputData/asset_data';

import { uiController_TA } from './uiController_TA';

import {restoreFloorGrid,dropSymbolY,changeReelSize,clearSymbolPreStep,clearReelFloorPreStep,startGameReelRun,drop_symbolsB,adjustReelSize,buildFloorGridPreStep,buildReelSymPreStep,getReelRunSymArray,clearFloorSymData} from '../../../../reelOp/reelOperate';
//import {dropSymbolInternal,floorShadowSeting,checkFloorSym,showLinkSym,} from '../../../../reelOp/symOperate';
import {show_WinTotalScore,energyBarInitial,bonusStateInitial} from '../../../../reelOp/eventPerformance';

import { resourcesCtrl ,} from '../../../../script/resourcesCtrl'



const { ccclass, property } = _decorator;



@ccclass('demoFlow_TA')
export class demoFlow_TA extends Component {


        
    public symbolPool = new Map; //建立一個在緩存區的數據庫 new Map([[pre.name,new NodePool()]]);
    
    public instancePool =new Map; ; //創建物件池
    
    public gameRound: number = 0;//紀錄遊戲目前demo第幾局(第0局開始)
    
    public gameSeed: number = null//0;//紀錄遊戲目前產生資浪局數亂數)

    public gameRoundCount:number = null //模擬資料中總局數
    public stepRound: number = 0;//紀錄目前demo第幾回合(第0回合開始)

    //public gameFootageFromJson:boolean = false

    private eventNameID = {  //每局結算完需執行的事件
        'sceneLevelUp': 0,
    };

    public gameInitialSimData:any = null// gameInitialData.data

    public gameSimData:any = null //gameSimData.data //全部模擬資料


    public gameSimDataKey:string = null

    public fixTestData:boolean = true

    public assetData:any  = assetData//null //assetData.reelTimer

    public reelTimer:any  = assetData.reelTimer
    public dt_preColumn_symIn:number = assetData.reelTimer.dt_preColumn_symIn
    public dt_preColumn_symClean:number = assetData.reelTimer.dt_preColumn_symClean
    public dt_preSymbol:number = assetData.reelTimer.dt_preSymbol
    
    public selSimDataBuffer:any = null // 亂數選定局數資料
    public secFloorSymbolData:any = null  //檢查第二層符號地板用資料 舊版
    public secSymbolExposedData:any = null //檢查第二層符號是否已被揭露用資料 新版
    public divAllRoundData:any = null // 全部局數與回數資料
    public selSimDataJsonID:any = null // 全部局數與回數資料


    public allChanceCardData:any = null // 全部機會卡資料
    public chanceCardEventCount:number = 0 // 機會卡事件數量
    public currentChanceCardEventIndex:number = 0 // 目前選取的機會卡事件索引
    public energyNum: number = assetData.energyBar.initialEnergy;  //能量霸百分比數值

    public energyNumInt: number = assetData.energyBar.initialEnergyZero //能量霸百分比數值
   //public energyBarProgressInt: number = 0 //能量條數值
    
    public chanceEventID: number = assetData.energyBar.initialEnergyZero;  //當前的機會事件ID
    public chanceEventTimes: number = 0; //該局生成機會事件ID的累加次數




    public rowAndColumn:any = assetData.rowAndColumn // 全部局數與回數資料
    public gridLevel:any =  assetData.gridLevel // 全部局數與回數資料
    public symLayerSize:any = assetData.symLayerSize // 全部局數與回數資料
    public symbolData:any = assetData.symbolData // 全部局數與回數資料
    public reelData:any = assetData.reelData // 全部局數與回數資料
    public UI:any = assetData.UI // 全部局數與回數資料
    public chaTimer:any = assetData.chaTimer // 全部局數與回數資料

    public autoRunCount:number = 0 // 全部局數與回數資料
    
    public isInitialRound:boolean = null // is initial Round

    public autoRunMaxCount:number =100

    public isAutoRun:boolean =false

    public freeGameMaxCount:number = 5 // 免費遊戲最大次數
    //public freeDropCount:number = 0 // 免費遊戲剩餘次數

    public bonusGameRatHolePos:Array<Vec2> = null // 紀錄各級分數球位置
    public bonusTotalScore:number = 0
    public winTotalScore:number = 0 // 紀錄本局獲得分數
    /* 腳本連結 */
    @property({ type: reelRun_TA, tooltip: "軸面功能腳本" })
    public reelRunTA: reelRun_TA = null;


    @property({ type: demoInfo_TA, tooltip: "demo內容腳本" })
    public demoInfoTA: demoInfo_TA = null;

    @property({ type: symResource_TA, tooltip: "素材庫腳本" })
    private symResourcTA: symResource_TA = null;


    @property({ type: uiController_TA, tooltip: "UI控制腳本" })
    private uiControllerTA: uiController_TA = null;

    @property({ type: demoInfo_bonus_TA, tooltip: "BG demo內容腳本" })
    public demoInfoBonusTA: demoInfo_bonus_TA = null;




    public eventTarget = new EventTarget();

    public grabGameGet: Node = null;
    public grabMode: boolean = false;  //搶分模式執行狀態
    public getReadyGrab: boolean = false;  //預備進入搶分模式狀態，地板格已全數消除


    public isFeatureSymCounted:boolean = true //是否已計算特效符號數量

    //public

    onLoad(){
        let mainCanvas:any = find('Canvas')!
        let gameCtrl:any = mainCanvas.parent.getChildByName('gameCtrl')!

        const loadResourcesToMap = async (object:any,timeout:number) => {
            await loadAllResourceData(this,2)

            console.log('loadResourcesToMap______A00000')   
  
        };

        loadResourcesToMap(this,1)

        console.log('mapOnload_____________33333',this.symbolPool)

        console.log('gameCtrl_____________A33333',gameCtrl,gameCtrl.getComponent('resourcesCtrl').gameID_Input)

        //this.eventTarget.on('foo', (arg1, arg2, arg3) => {
        //console.log('eventTarget_1',arg1, arg2, arg3);  // print 1, 2, 3
        //按鈕觸發設置
        const thisScriptName = this.name.split('<')[1].split('>')[0];  //取得自身腳本的名稱，從'<'分割，保留第2部分，再從'>'分割，保留第1部分 //'demoFlow_TA'
        //spin按鈕，設置呼叫的涵式
        const spinBtnEventHandler = new EventHandler();  //新增一個按鈕ClickEvents
        spinBtnEventHandler.target = this.node;          //指定要執行的節點
        spinBtnEventHandler.component = thisScriptName;  //執行的腳本名稱
        spinBtnEventHandler.handler = 'clickSpin';       //執行的Funtion名稱
        this.symResourcTA.btnSpin.getComponent(Button).clickEvents.push(spinBtnEventHandler);  //指定按鈕節點，push()內填入前面宣告的名稱

        const autoBtnEventHandler = new EventHandler();  //新增一個按鈕ClickEvents
        autoBtnEventHandler.target = this.node;          //指定要執行的節點
        autoBtnEventHandler.component = thisScriptName;  //執行的腳本名稱
        autoBtnEventHandler.handler = 'autoRunSwitch';       //執行的Funtion名稱
        this.symResourcTA.btnAuto.getComponent(Button).clickEvents.push(autoBtnEventHandler);  //指定按鈕節點，push()內填入前面宣告的名稱

   
        const bonusTestBtnHandler = new EventHandler();  //新增一個按鈕ClickEvents
        bonusTestBtnHandler.target = this.node;          //指定要執行的節點
        bonusTestBtnHandler.component = thisScriptName;  //執行的腳本名稱
        bonusTestBtnHandler.handler = 'runBonusTest';       //執行的Funtion名稱
        gameCtrl.getComponent('resourcesCtrl').bonusGame.clickEvents.push(bonusTestBtnHandler);  //指定按鈕節點，push()內填入前面宣告的名稱




        const zombieTestBtnHandler = new EventHandler();  //新增一個按鈕ClickEvents
        zombieTestBtnHandler.target = this.node;          //指定要執行的節點
        zombieTestBtnHandler.component = thisScriptName;  //執行的腳本名稱
        zombieTestBtnHandler.handler = 'runZombieTest';       //執行的Funtion名稱
        gameCtrl.getComponent('resourcesCtrl').ZombieGame.clickEvents.push(zombieTestBtnHandler);  //指定按鈕節點，push()內填入前面宣告的名稱
            

        const IDInput_editboxEventHandler = new EventHandler();
        IDInput_editboxEventHandler.component = thisScriptName;  //執行的腳本名稱
        let IDInputBox:EditBox = gameCtrl.getComponent('resourcesCtrl').gameID_Input.getComponent(EditBox)
        let PLACEHOLDER_LABEL:any = IDInputBox.node.getChildByName('PLACEHOLDER_LABEL')
        PLACEHOLDER_LABEL.active = false
        let TEXT_LABEL:any = IDInputBox.node.getChildByName('TEXT_LABEL')
        TEXT_LABEL.active = true
        //IDInputBox.enable
        console.log('mapOnload_____________55555',IDInputBox,IDInputBox.node.children,PLACEHOLDER_LABEL,TEXT_LABEL)
        IDInputBox.string = "0"
        IDInputBox.maxLength = 12
        /*
        this.eventTarget.on('foo', (arg1, arg2, arg3) => {
        console.log('eventTarget________________1',arg1, arg2, arg3);  // print 1, 2, 3
        });
        */

    };
    

    start() {
    
        this.isAutoRun = false

        async function runRequestJsonData(object:any,timeout:number){



            return new Promise(resolve => {
                setTimeout(() => {

                    let jsonData:any = requestJsonData(this,'','initData',true,0);

                    resolve(jsonData)

                },timeout*1000)


            })
        
                
        }
        async function initialGameSimReel(object:any){

             
            let getJsonData:any =  await runRequestJsonData(object,0.2)
               // console.log(`wait___________________44444`,getJsonData)
            
                object.gameInitialSimData = getJsonData.data
               // console.log(`wait___________________55555`,object,object.gameInitialSimData)
                object.isInitialRound = true  //是否為初始盤面
                //createiInitialGrid(object,object.gameRound)


                
          
                await buildFloorGridPreStep(object,0,object.gameRound)
                
                let getConvertInitialSymData:any = await convertSymCordData_initial(object.gameInitialSimData,object.gameRound,object.stepRound,0.1)
                await buildReelSymPreStep(object,0,getConvertInitialSymData,object.gameRound, object.stepRound, false)

                await drop_symbolsB(object,0 ,'reelIn', object.gameRound,"初始盤面",0.1)  //object  reelRun_TA.ts
                await dropSymbolY(object ,5, 1 ); //啟動縱軸符號掉入盤內 


        };


        initialGameSimReel(this)
        //console.log(`wait:___________________6`,this)

        
    };

    /* 開始spin轉動 */
    clickSpin() {
        
        //requestJsonData(this,'/cocos/catRaider/play_1000.json','selPlayData',true,602);s

        this.isInitialRound = false  //是否為初始盤面


        this.currentChanceCardEventIndex = 0 // 目前選取的機會卡事件索引
        this.energyNum = assetData.energyBar.initialEnergy;  //能量霸百分比數值
        this.chanceEventID = 0; //當前的機會事件ID
        this.chanceEventTimes = 0; //該局生成機會事件ID的累加次數
        //this.freeDropCount = 0
        this.reelRunTA.bonusNum = 0
        this.bonusTotalScore = 0
        this.winTotalScore = 0 
        this.energyNumInt = assetData.energyBar.initialEnergyZero

                    //let levelMsgLabel = object.uiControllerTA.levelMessage.getComponent(Label)

        let chanceCountNumLabel = this.reelRunTA.chanceCountNum.getComponent(Label)
            chanceCountNumLabel.string = this.energyNumInt.toString()
        bonusStateInitial(this, 0.5)  // bonus icon initial state
        show_WinTotalScore(this,0) //=  async (object:any,totalScore: number,timeout:number)

        //adjustReelSize(this,0,0,0.02)            //調整符號尺寸
        
        
  


        async function runRequestJsonData(object:any,timeout:number){     //取得單局模擬資料



            return new Promise(resolve => {
                setTimeout(() => {

                    let mainCanvas:any = find('Canvas')!

                    let gameCtrl:any = mainCanvas.parent.getChildByName('gameCtrl')!

                    let IDInputBox:EditBox = gameCtrl.getComponent('resourcesCtrl').gameID_Input.getComponent(EditBox)
                   
                    let jsonData:any = null      
                    let inputGameID:string = IDInputBox.string//parseInt(IDInputBox.string)
                    console.log('inputGameID___________A00000',inputGameID)
                        if(inputGameID == "0"){
                            jsonData = requestJsonData(this,'/cocos/catRaider/play_V04_10000.json','selPlayData',false,940);  //602 test 15

                        }else{
                            jsonData = requestJsonData(this,'/cocos/catRaider/play_V04_10000.json','selPlayData',true,inputGameID);  //602 test 15
                            
                            requestJsonData(this,'/cocos/catRaider/play_V04_10000.json','convertData',true,inputGameID);  //602 test 15

                        }
                    //play_V2_5000_1.json
                    // 630 
                    //play_V03_1000
                    //685917B55E7
                    //play_new_1000.jsons
                   // play_maxwin_v3.json
                    //新版 5 第一關測試
                    //新版 8 81 WILD測試s
                    //新版14 chance card swap
                    //新版18 炸彈

                    //新版19 過關

                    //新版13 chance card wild

                    //新版42 chance card wild swap

                    //新版14 96 bonus
                    //新版63 揭露金幣

                    //74 能量球 過關 金幣 搶分 機會
                    //77 升級
                    //85 能量球 過關 搶分 WILD 機會卡
                    //603 427 
                    //427 多種特殊符號表演 bonus 
                    //bug 639



                
                    resolve(jsonData)


                },timeout*1000)


            })
        
                
        };


        async function getConvertLineAwardData(object:any,timeout:number){     //取得單局模擬資料



            return new Promise(resolve => {
                setTimeout(() => {
                    //let data:any = 
                    
                    let allLineAwardData:any = convertLineAwardData(object)//取得遊戲各局資料

                
                    resolve(allLineAwardData)
     

                },timeout*1000)


            })
        
                
        };




        async function runSpin(object:any){
          
            console.log('click_Spin_________B00000',object.gameRound,object.stepRound,object.reelRunTA.sceneLevel )
            if( object.reelRunTA.sceneLevel != 0){
                await clearSymbolPreStep(object,3)

                await clearFloorSymData(object,3,0.2)   //清除地板（第二層）符號
                await clearReelFloorPreStep(object,3)
                await restoreFloorGrid(object,8,0.5)
                await drop_symbolsB(object, 0,'reelClean', object.gameRound,"4",0.2)  //符號調出盤面







                //await clearFloorSym(object,0.2)   //清除地板（第二層）符號
                object.reelRunTA.reelSizeTA.ResetReelSize(); //呼叫重置盤面尺寸涵式(復原底層格)

            };



                let getJsonData:any =  await runRequestJsonData(object,0.2)
                
                    object.gameSeed = getJsonData[0]

                    object.selSimDataJsonID = getJsonData[4]
                    console.log(`click_Spin____________00`,getJsonData,"selSimDataJsonID",object.selSimDataJsonID,"gameSimData",object.gameSimData,object.gameSeed)
                
                    object.gameRound = 0
                    object.stepRound = 0
                    object.gameRoundCount = 0
                    object.reelRunTA.sceneLevel = 0

            

                    object.selSimDataBuffer = getJsonData[1] //模擬資料來源

    
                let gameSeedLabel = object.reelRunTA.gameSeed.getComponent(Label)

                    gameSeedLabel.string = (object.selSimDataJsonID).toString()

                let gameIDLabel = object.reelRunTA.gameIDNum.getComponent(Label)

                if(object.gameSeed.toString().length > 6){
                    gameIDLabel.string = "---"

                }else{
                    gameIDLabel.string = (object.gameSeed).toString()

                }



                    

                let allRoundData:any = await getConvertLineAwardData(object.selSimDataBuffer,0.2)



                    object.divAllRoundData  = allRoundData[0]
                    object.gameRoundCount = allRoundData[0].length
                    object.allChanceCardData = allRoundData[1]
                    object.chanceCardEventCount = object.allChanceCardData.length

                //console.log('allRoundData____________999999',allRoundData,object.divAllRoundData,object.gameRoundCount);

                await energyBarInitial(object,object.currentChanceCardEventIndex,0.1)
                

                await startGameReelRun(object,object.gameRound,object.stepRound,"initial",true,0.2)  //reelOperate.startGameReelRun 盤面初始化
            
        };


      

        runSpin(this)
        //console.log(`wait:___________________9`,this)
    };




        

    autoRunSwitch(){


        this.autoRunMaxCount = 100 //設定autorun次數
        this.autoRunCount = 0 //設定autorun次數
        let btnColorData:any = assetData.btnColor
        let autoRunRunColor:any = btnColorData.filter(e => e.name === "run")[0].color
        let autoRunInitialColor:any = btnColorData.filter(e => e.name === "initial")[0].color

        let selAutoRunRunColor = color(autoRunRunColor[0],autoRunRunColor[1],autoRunRunColor[2],autoRunRunColor[3])
        let selAutoRunInitialColor = color(autoRunInitialColor[0],autoRunInitialColor[1],autoRunInitialColor[2],autoRunInitialColor[3])

        let autoRunSprite = this.symResourcTA.btnAuto.node.getChildByName('sprite').getComponent(Sprite)

        let autoRunCountLabel = this.reelRunTA.autoRunCount.getComponent(Label)


 
        console.log('testRun______________A000000',this.autoRunCount,autoRunSprite)

        if(this.isAutoRun == true){
             this.isAutoRun = false   

            //autoRunSprite.color = selAutoRunRunColor
            autoRunCountLabel.string = (0).toString()
            //autoRunCountLabel.string = (this.autoRunMaxCount-this.autoRunCount).toString()



        }else if(this.isAutoRun == false){
            this.isAutoRun = true
            //autoRunSprite.color = selAutoRunInitialColor
            //autoRunCountLabel.string = (0).toString()
            autoRunCountLabel.string = (this.autoRunMaxCount-this.autoRunCount).toString()


        }



        console.log('auto spin__________0000',this.isAutoRun)
       
       // this.autoRun(this.autoRunCount)

    };

    autoRun(count:number){

        let autoRunCountLabel = this.reelRunTA.autoRunCount.getComponent(Label)

        this.isInitialRound = false  

        this.autoRunCount ++ 

        let autoRunSprite = this.symResourcTA.btnAuto.node.getChildByName('sprite').getComponent(Sprite)
            autoRunCountLabel.string = (this.autoRunMaxCount-this.autoRunCount).toString()

       // console.log('testRun______________A000000',this.autoRunCount,autoRunSprite)
      
        async function runRequestJsonData(object:any,timeout:number){     //取得單局模擬資料



            return new Promise(resolve => {
                setTimeout(() => {
          
                    let jsonData:any = requestJsonData(this,'/cocos/catRaider/play_V04_10000.json','selPlayData',false,0);  //602 test 15
                  


                    resolve(jsonData)


                },timeout*1000)


            })
        
                
        };


        async function getConvertLineAwardData(object:any,timeout:number){     //取得單局模擬資料



            return new Promise(resolve => {
                setTimeout(() => {
                    //let data:any = 
                    
                    let allLineAwardData:any = convertLineAwardData(object)//取得遊戲各局資料

                
                    resolve(allLineAwardData)
     

                },timeout*1000)


            })
        
                
        };




        async function runSpin(object:any){
          
            console.log('click_Spin_________B00000',object.gameRound,object.stepRound,object.reelRunTA.sceneLevel )
            if( object.reelRunTA.sceneLevel != 0){
                await clearSymbolPreStep(object,3)

                await clearFloorSymData(object,3,0.2)   //清除地板（第二層）符號
                await clearReelFloorPreStep(object,3)
                await restoreFloorGrid(object,8,0.5)
                await drop_symbolsB(object, 0,'reelClean', object.gameRound,"4",0.2)  //符號調出盤面







                //await clearFloorSym(object,0.2)   //清除地板（第二層）符號
                object.reelRunTA.reelSizeTA.ResetReelSize(); //呼叫重置盤面尺寸涵式(復原底層格)

            };



                let getJsonData:any =  await runRequestJsonData(object,0.2)
                
                    object.gameSeed = getJsonData[0]

                    object.selSimDataJsonID = getJsonData[4]
                    console.log(`click_Spin____________00`,getJsonData,"selSimDataJsonID",object.selSimDataJsonID,"gameSimData",object.gameSimData,object.gameSeed)
                
                    object.gameRound = 0
                    object.stepRound = 0
                    object.gameRoundCount = 0
                    object.reelRunTA.sceneLevel = 0

            

                    object.selSimDataBuffer = getJsonData[1] //模擬資料來源

                    let gameSeedLabel = object.reelRunTA.gameSeed.getComponent(Label)

                    gameSeedLabel.string = (object.selSimDataJsonID.toString())

                    let gameIDLabel = object.reelRunTA.gameIDNum.getComponent(Label)

                    gameIDLabel.string = (object.gameSeed).toString()


                let allRoundData:any = await getConvertLineAwardData(object.selSimDataBuffer,0.2)



                    object.divAllRoundData  = allRoundData[0]
                    object.gameRoundCount = allRoundData[0].length
                    object.allChanceCardData = allRoundData[1]
                    object.chanceCardEventCount = object.allChanceCardData.length

                //console.log('allRoundData____________999999',allRoundData,object.divAllRoundData,object.gameRoundCount);

                await energyBarInitial(object,object.currentChanceCardEventIndex,0.1)
                

                await startGameReelRun(object,object.gameRound,object.stepRound,"initial",true,0.2)  //reelOperate.startGameReelRun 盤面初始化
            
        };


      

        runSpin(this)



    };
    

    runBonusTest(){
        console.log('runBonusTest__________A0000')
         //requestJsonData(this,'/cocos/catRaider/play_1000.json','selPlayData',true,602);s

         this.isInitialRound = false  //是否為初始盤面


         this.currentChanceCardEventIndex = 0 // 目前選取的機會卡事件索引
         this.energyNum = assetData.energyBar.initialEnergy;  //能量霸百分比數值
         this.chanceEventID = 0; //當前的機會事件ID
         this.chanceEventTimes = 0; //該局生成機會事件ID的累加次數
         //this.freeDropCount = 0
         this.reelRunTA.bonusNum = 0
         this.bonusTotalScore = 0
         this.winTotalScore = 0 
         this.energyNumInt = assetData.energyBar.initialEnergyZero
 
                     //let levelMsgLabel = object.uiControllerTA.levelMessage.getComponent(Label)
 
         let chanceCountNumLabel = this.reelRunTA.chanceCountNum.getComponent(Label)
             chanceCountNumLabel.string = this.energyNumInt.toString()
         bonusStateInitial(this, 0.5)  // bonus icon initial state
         show_WinTotalScore(this,0) //=  async (object:any,totalScore: number,timeout:number)
 
         //adjustReelSize(this,0,0,0.02)            //調整符號尺寸
         
         
   
 
 
         async function runRequestJsonData(object:any,timeout:number){     //取得單局模擬資料
 
 
 
             return new Promise(resolve => {
                 setTimeout(() => {
                
                     let jsonData:any = requestJsonData(this,'/cocos/catRaider/play_V04_10000.json','selPlayData',true,940);  //602 test 15    
                     resolve(jsonData)
 
                 },timeout*1000)

             })
        
         };
 
 
         async function getConvertLineAwardData(object:any,timeout:number){     //取得單局模擬資料
 
          return new Promise(resolve => {
                 setTimeout(() => {
                     //let data:any = 
                     
                     let allLineAwardData:any = convertLineAwardData(object)//取得遊戲各局資料
 
                 
                     resolve(allLineAwardData)
      
 
                 },timeout*1000)
 
 
             })
         
                 
         };
 
 
 
 
         async function runSpin(object:any){
           
             console.log('click_Spin_________B00000',object.gameRound,object.stepRound,object.reelRunTA.sceneLevel )
             if( object.reelRunTA.sceneLevel != 0){
                 await clearSymbolPreStep(object,3)
 
                 await clearFloorSymData(object,3,0.2)   //清除地板（第二層）符號
                 await clearReelFloorPreStep(object,3)
                 await restoreFloorGrid(object,8,0.5)
                 await drop_symbolsB(object, 0,'reelClean', object.gameRound,"4",0.2)  //符號調出盤面
 
 
 
 
 
 
 
                 //await clearFloorSym(object,0.2)   //清除地板（第二層）符號
                 object.reelRunTA.reelSizeTA.ResetReelSize(); //呼叫重置盤面尺寸涵式(復原底層格)
 
             };
 
 
 
                 let getJsonData:any =  await runRequestJsonData(object,0.2)
                 
                     object.gameSeed = getJsonData[0]
 
                     object.selSimDataJsonID = getJsonData[4]
                     console.log(`click_Spin____________00`,getJsonData,"selSimDataJsonID",object.selSimDataJsonID,"gameSimData",object.gameSimData,object.gameSeed)
                 
                     object.gameRound = 0
                     object.stepRound = 0
                     object.gameRoundCount = 0
                     object.reelRunTA.sceneLevel = 0
 
             
 
                     object.selSimDataBuffer = getJsonData[1] //模擬資料來源
 
     
                 let gameSeedLabel = object.reelRunTA.gameSeed.getComponent(Label)
 
                     gameSeedLabel.string = (object.selSimDataJsonID).toString()
 
                 let gameIDLabel = object.reelRunTA.gameIDNum.getComponent(Label)
 
                     gameIDLabel.string = (object.gameSeed).toString()
 
 
                     
 
                 let allRoundData:any = await getConvertLineAwardData(object.selSimDataBuffer,0.2)
 
 
 
                     object.divAllRoundData  = allRoundData[0]
                     object.gameRoundCount = allRoundData[0].length
                     object.allChanceCardData = allRoundData[1]
                     object.chanceCardEventCount = object.allChanceCardData.length
 
                 //console.log('allRoundData____________999999',allRoundData,object.divAllRoundData,object.gameRoundCount);
 
                 await energyBarInitial(object,object.currentChanceCardEventIndex,0.1)
                 
 
                 await startGameReelRun(object,object.gameRound,object.stepRound,"initial",true,0.2)  //reelOperate.startGameReelRun 盤面初始化
             
         };
 
 
       
 
         runSpin(this)

    };


    runZombieTest(){
        console.log('runZombieTest__________A0000')

    };

    


};