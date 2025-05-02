import { _decorator,NodePool,resources,instantiate, Component, Node,Vec3, math, Enum, Prefab, tween, Animation, UITransform, UIOpacity, Vec2, Button, EventHandler, input, Input, EventKeyboard, KeyCode, Sprite, find, Quat, Label, Scheduler,director,color } from 'cc';
import { symResource_TA } from './symResource_TA';
import { symSetting_TA } from './symSetting_TA';
import { catSetting_TA } from './catSetting_TA';
import { reelSize_TA } from './reelSize_TA';
import { demoInfo_TA } from './demoInfo_TA';
import { demoFlow_TA } from './demoFlow_TA';
import { uiController_TA } from './uiController_TA';
import { demoInfo_bonus_TA } from './demoInfo_bonus_TA';
import {loadAllResourceData} from '../../../../inputData/dataOperate';


//import {clearFloorSymData,adjustReelSize,reelSizeRestroe} from '../../../../reelOp/reelOperate';

//import {} from '../../../../reelOp/symOperate';

//import {callGameSimData,checkFloorSym,showLinkSym} from '../../../../reelOp/symOperate';

//import {requestJsonData} from '../../../../inputData/dataOperate';
import {assetData} from '../../../../inputData/asset_data';

//@ts-ignore。忽略單行報錯

//import assetData from '../../../../inputData/asset_data.json';

import poolHandler from '../../../common/script/poolHandlerB';
const { ccclass, property } = _decorator;



//盤面符號陣列 

/*
@ccclass('symbolArrayPos')
export class symbolArrayPos {
    public numberArray: number[][] = []; 

    //public posArray: Vec3[][] = reelDataInput(3)//reelData  由 ../assets/inputData/assets_structures.json 匯入盤面座標資料
    public posArray: Vec3[][] =  //8X8個盤面盤面符號座標       
        [[new Vec3(108,108,0),new Vec3(108,324,0),new Vec3(108,540,0),new Vec3(108,756,0),new Vec3(108,972,0),new Vec3(108,1188,0),new Vec3(108,1404,0),new Vec3(108,1620,0)],
        [new Vec3(324,108,0),new Vec3(324,324,0),new Vec3(324,540,0),new Vec3(324,756,0),new Vec3(324,972,0),new Vec3(324,1188,0),new Vec3(324,1404,0),new Vec3(324,1620,0)],
        [new Vec3(540,108,0),new Vec3(540,324,0),new Vec3(540,540,0),new Vec3(540,756,0),new Vec3(540,972,0),new Vec3(540,1188,0),new Vec3(540,1404,0),new Vec3(540,1620,0)],
        [new Vec3(756,108,0),new Vec3(756,324,0),new Vec3(756,540,0),new Vec3(756,756,0),new Vec3(756,972,0),new Vec3(756,1188,0),new Vec3(756,1404,0),new Vec3(756,1620,0)],
        [new Vec3(972,108,0),new Vec3(972,324,0),new Vec3(972,540,0),new Vec3(972,756,0),new Vec3(972,972,0),new Vec3(972,1188,0),new Vec3(972,1404,0),new Vec3(972,1620,0)], 
        [new Vec3(1188,108,0),new Vec3(1188,324,0),new Vec3(1188,540,0),new Vec3(1188,756,0),new Vec3(1188,972,0),new Vec3(1188,1188,0),new Vec3(1188,1404,0),new Vec3(1188,1620,0)], 
        [new Vec3(1404,108,0),new Vec3(1404,324,0),new Vec3(1404,540,0),new Vec3(1404,756,0),new Vec3(1404,972,0),new Vec3(1404,1188,0),new Vec3(1404,1404,0),new Vec3(1404,1620,0)],
        [new Vec3(1620,108,0),new Vec3(1620,324,0),new Vec3(1620,540,0),new Vec3(1620,756,0),new Vec3(1620,972,0),new Vec3(1620,1188,0),new Vec3(1620,1404,0),new Vec3(1620,1620,0)]]; 

    
}
*/

//@ts-ignore。忽略單行報錯



@ccclass('reelRun_TA')
export class reelRun_TA extends Component {
    //public myPool = new poolHandler(); //創建物件池d

   // public symbolPool = new poolHandler(); //創建物件池
    
    //public symbolPool = new Map; //建立一個在緩存區的數據庫 new Map([[pre.name,new NodePool()]]);
    //public instancePool =new Map; ; //創建物件池 instancePool
    private symArray: Node[][] =  [];  //存放盤面符號陣列

    private tempSymArray: Node[][] = [];  //暫存生成的符號陣列

    private floorSymArray: number[][] = [];  //存放地板下符號陣列

    private floorSymNode: Node[] = [null, null, null, null, null];  //存放地板下符號陣列，預先生成5空位

    private floorArray: Node[][] = [];  //存放地板格子陣列 

    private cat: number[][] =[[0,0],[0,0],[0,0],[0,0]];  //存放盤面上的貓座標索引，0紅、1黃、2綠、3藍
    private mouse: number[] = [null,null];  //存放盤面上地鼠的座標索引

    //public energyNum: number = 0;  //能量霸百分比數值


    //public chanceEventID: number = 0; //當前的機會事件ID

    //public chanceEventTimes: number = 0; //該局生成機會事件ID的累加次數


    @property({type: Node, tooltip:'UIRoot節點'})
    public MainUI: Node = null;
    
    //@property({type: Node, tooltip:'放置角色符號節點'})
    //public catLayer: Node = null;

    @property({type: Node, tooltip:'放置盤面符號節點'})
    public symLayer: Node = null;

    @property({type: Node, tooltip:'放置地板下符號節點'})
    public floorSymLayer: Node = null;

    @property({type: Node, tooltip:'設置地板格子節點'})
    public floorLayer: Node = null;


    @property({type: Node, tooltip:'放置地板上特效的節點'})
    public floorFxLayer: Node = null;

    @property({type: Node, tooltip:'放置符號的特效節點'})
    public symFxLayer: Node = null;

  



    @property({type: Node})
    chanceCountNum: Node = null;

    @property({type: Node})
    roundCount: Node = null;

    @property({type: Node})
    stepCount: Node = null;

    @property({type: Node})
    autoRunCount: Node = null;



    @property({type: Node})
    gameSeed: Node = null;

    @property({type: Node})
    gameIDNum: Node = null;



    @property({ type: Number, tooltip:'各色符號當前等級(索引0~3，等級1~8)'})
    public symLevel: number[] = [];
    public bonusNum: number = 0; //當前獲得bonus數量

    public symRedLevel:number = 0      //紅色符號等級
    public symYellowLevel:number = 0   //黃色符號等級
    public symGreenLevel:number = 0    //綠色符號等級
    public symBlueLevel:number = 0     //藍色符號等級



    public sceneLevel: number = 0;  //當下場景等級


    public assetData:any = assetData //null assetData

    public gridLevel:any = assetData.gridLevel

    public symbolData:any = assetData.symbolData

    public reelData:any = assetData.reelData

    public UI:any = assetData.UI

    public chaTimer:any = assetData.chaTimer

    public reelTimer:any =  assetData.reelTimer //null//assetData.reelTimer

    public gameInitialSimData:any = null// gameInitialData.data

    public divAllRoundData:any = null

    public dt_preColumn_symIn:any =  assetData.reelTimer.dt_preColumn_symIn//null
    public dt_preColumn_symClean:any = assetData.reelTimer.dt_preColumn_symClean//null
    public dt_preSymbol:any =  assetData.reelTimer.dt_preSymbol//null

    public MG_background: Sprite = null;  //MainGame背景


    //Wild符號切換對應連線符號的顏色
    private FxColor = {
    0: color(255,59,154,220),    1: color(255,173,0,200),    2: color(30,155,0,200),   3: color(0,102,255,200) }   //(子物件順序ID)值越小越後排


    //symbolArrayData: symbolArrayPos = new symbolArrayPos();

    /* 參數列表 */
    //盤面行列數，由場景等級對應參數 rowAndColumn
    public rowAndColumn:any =  assetData.rowAndColumn///null//assetData.rowAndColumn
    //全符號UITransform範圍尺寸，也作為生成符號座標及落出盤面座標的偏移參照，由下拉式選單轉換對應數值 
    public symLayerSize:any = assetData.symLayerSize
    //盤面行數轉換子物件排序，控制符號顯示排序用
    public ColumnsID:any = {
                                0: 7,
                                1: 6,   
                                2 : 5,   
                                3 : 4,   
                                4 : 3,   
                                5 : 2,  
                                6 : 1,   
                                7 : 0 
                            };

   
 

    /* 腳本連結 */
    @property({ type: demoInfo_TA, tooltip: "demo內容腳本" })
    private demoInfoTA: demoInfo_TA = null;

    @property({ type: uiController_TA, tooltip: "UI悾制腳本" })
    private uiControllerTA: uiController_TA = null;

    @property({ type: symResource_TA, tooltip: "symbol資源" })
    private symbolResourceTA: symResource_TA = null;

    @property({ type: reelSize_TA, tooltip: "盤面尺寸控制" })
    private reelSizeTA: reelSize_TA = null;

    @property({ type: demoInfo_bonus_TA, tooltip: "BG demo內容腳本" })
    public demoInfoBonusTA: demoInfo_bonus_TA = null;
     //@ts-ignore。忽略單行報錯
 
    
    private eventNameID = {  //每局結算完需執行的事件

        'sceneLevelUp': 0,
        
    }
    
    onLoad(){
        //在存放盤面符號陣列內生成8X8個空位
        /*
        for(let i = 0; i < 8; ++i){ 
            this.symArray[i] = [];  //存放盤面符號陣列
            this.tempSymArray[i] = [];  //暫存生成於預備位置的符號陣列
            this.floorSymArray[i] = [];  //存放地板下符號陣列
            this.floorArray[i] = [];  //存放地板格子陣列
            for(let j = 0; j < 8; ++j){
                this.symArray[i][j] = null;
                this.tempSymArray[i][j] = null;
                this.floorSymArray[i][j] = 0;
                this.floorArray[i][j] = null;
            }
        }
       */
        //console.log('mapOnload_____________00000',this.symbolResourceTA.symNode)        //requestJsonData(this,'','assetData',true,0);
        // 加载 Prefab
                    //this.symbolPool = new Map([[symName,new NodePool()]]);
           /*
        let symbolData = assetData.symbolData
        let floorSymbolData = assetData.floorSymbolData
        let floorGridData = assetData.floorGrid
        let fxResources = assetData.fxResources
        let resourcesLoadSymType:any = assetData.resourcesLoadSymType
        //載入主要符號資源 角色符號 特殊符號
        for(let i = 0; i < symbolData.length; ++i){
            let symName:string = symbolData[i].name;
            let symType:string = symbolData[i].type;
            //console.log('mapOnload_____________22222',i,symName) 
            if(resourcesLoadSymType.includes(symType)){
                let url:string =  symbolData[i].url + "/"+ symName

                resources.load(url, Prefab, (err, prefab) => {
                    //pool.put(instantiate(prefab));   
                    this.symbolPool.set(symName,prefab)

                });
            }
        };
     
        //載入地板下符號資源
        for(let i = 0; i < floorSymbolData.length; ++i){
            let symName:string = floorSymbolData[i].name;
            let url:string =  floorSymbolData[i].url + "/"+ symName
            //console.log('mapOnload_____________444444',i,url,symName) 

            resources.load(url, Prefab, (err, prefab) => {
                this.symbolPool.set(symName,prefab)

            });
        };

        //載入地板圖樣資源

        for(let i = 0; i < floorGridData.length; ++i){
            let symName:string = floorGridData[i].name;
            let url:string =  floorGridData[i].url + "/"+ symName
            //console.log('mapOnload_____________55555',i,url,symName) 

            resources.load(url, Prefab, (err, prefab) => {
                this.symbolPool.set(symName,prefab)

            });
        };


        //載入特效資源
        for(let i = 0; i < fxResources.length; ++i){
            let fxName:string = fxResources[i].name;
            let url:string =  fxResources[i].url + "/"+ fxName
            //console.log('mapOnload_66666',i,url,fxName) 

            resources.load(url, Prefab, (err, prefab) => {
                this.symbolPool.set(fxName,prefab)
            });

        }

        */


        
       


    }

    start(){
   

        this.MG_background = find('Canvas/slotGameUI/CatRaider_bg')!.getComponent(Sprite);  //抓取MainGame背景

        let _cameraRoot = find('Canvas_reel/cameraRoot');
        _cameraRoot.setRotationFromEuler(35,0,0); //用歐拉角設定節點旋轉值(起始角度)
        this.scheduleOnce(()=>{
            let  quat : Quat = new Quat();  //宣告一個四元數
            Quat.fromEuler(quat, 0, 0, 0);  //依據歐拉角計算成四元數(目標角度)
            tween(_cameraRoot).to(1.5, { rotation:quat }, { easing: 'cubicOut' }).start();

    
        },1)  //遊戲啟動後略為等待再執行

  
    };
    


};