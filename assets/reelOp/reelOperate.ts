import { _decorator, director,color,Component, Node,Vec3,instantiate, math, Enum, Prefab, tween, Animation, UITransform, UIOpacity, Vec2, Button, EventHandler, input, Input, EventKeyboard, KeyCode, Sprite, find, Quat, Label, Scheduler, game, NodePool } from 'cc';

import { getCatAward,chaDropEnding,chaDropStarting} from './chaOperate';
import { floorShadowSeting,eventDelayTime,show_WinTotalScore,bonusStateInitial} from './eventPerformance';
import {getSymFromPool,putSymToPoolB,symDropEnding,setMapListtNode,modifySymLevelPic,symDropStarting} from './symOperate';

import {convertSecFloorSymbolData,convertInitialSymData} from '../inputData/dataOperate';
import {assetData} from '../inputData/asset_data';

/* 新局-開始遊戲盤面掉落(自動判斷是否需清除盤面) 盤面初始化 */
export async function startGameReelRun(object:any,gameRound:number,stepRound:number, mode:string,isCreatFloorSym: boolean,timeout:number){

    return new Promise(resolve => {
        setTimeout(() => {

            let spinBtnClickRotateSpeed:number = assetData.UI.spinBtnClickRotateSpeed
            let divAllRoundData:any = object.divAllRoundData//find('Canvas/TADemo')!.getComponent(demoFlow_TA).divAllRoundData; //抓取遊戲模擬局數資料  
            let selRoundData : any = divAllRoundData.filter(e => e.roundCount === object.gameRound)[0];   // 以物件ID過濾 /
            let reelSize:number = selRoundData.currentReelSize
            let currentReelLevel:string = selRoundData.currentReelLevel
            let reelLevelSizeData:any = assetData.reelLevelSizeData
            let levelIndex:number = reelLevelSizeData.filter(e => e.token === currentReelLevel)[0].levelIndex; //選擇當前符號層尺寸
            let rowCount:number = reelLevelSizeData.filter(e => e.token === currentReelLevel)[0].rowCount; //選擇當前符號層尺寸
            object.reelRunTA.sceneLevel = levelIndex
            let roundCountLabel = object.reelRunTA.roundCount.getComponent(Label)
            let dt_preReel:number = assetData.reelTimer.dt_preReel//每一軸表演的延遲時間
                roundCountLabel.string = object.gameRound.toString()

    if(mode == "initial"){
        console.warn("start Game Reel Run with mode initial","gameRound",gameRound,selRoundData)
        runCreateReelSym() 

    }else if(mode == "done"){
        

        console.warn("start Game Reel Run with mode Done","gameRound",gameRound,selRoundData)

        getCatAward(object)

    }else if(mode == "levelUp"){
        console.warn("start Game Reel Run with mode levelUp","gameRound",gameRound,selRoundData)

        roundLevelUp()

    }else if(mode == "grabStart"){
        console.warn("start Game Reel Run with mode GRAB","gameRound",gameRound,selRoundData)

        grabMode()

    }
    else if(mode == "bonusStart"){
        console.warn("start Game Reel Run with mode bonus game____222","gameRound",gameRound,selRoundData)

        bonusGameStart()

    }else if(mode == "bonusFreeDrop"){
        console.warn("start Game Reel Run with mode bonus FreeDrop____222","gameRound",gameRound,selRoundData)

        bonusFreeDrop()

    };;
    
    async function roundLevelUp(){

        let getConvertInitialSymData:any = await convertInitialSymData(divAllRoundData,gameRound,stepRound,0.1) //  轉換當局資料


        await clearSymbolPreStep(object,levelIndex)

        await clearFloorSymData(object,levelIndex,0.2)   //清除地板（第二層）符號資料

        await clearReelFloorPreStep(object,levelIndex)
       
        await changeReelSize(object,levelIndex,0.2)       
       
        await adjustReelSize(object,levelIndex,gameRound,0.2)            //調整符號尺寸

        await waittingTransation(object,levelIndex,1)//等待地板動畫

        object.grabMode = false; //重置搶分模式為關閉

        object.reelRunTA.MG_background.color = color(255,255,255); //復原場景背景圖顏色
        object.reelRunTA.symbolResourceTA.fxGrabGame[0].active = false; //關閉搶分模式前景光束特效

        for (let i = 0; i < levelIndex; i++) {
            object.reelRunTA.reelSizeTA.groundLayer.children[i].getComponent(Animation).play('ground_reset_'+i.toString());  //重置擴張前尺寸的地板旋轉縮放透明數值
        }
        
        await buildFloorGridPreStep(object,levelIndex,object.gameRound)

        await buildFloorSymPreStep(object, gameRound) //生成地板（第二層）符號

        await buildReelSymPreStep(object,levelIndex,getConvertInitialSymData,gameRound, stepRound, false)



        object.reelRunTA.MainUI.getComponent(Animation).stop(); //停止UI震動動畫
        object.reelRunTA.MainUI.setPosition(0,0,0); //強制將UI歸回原座標
    

        await drop_symbolsB(object, levelIndex,'reelIn', gameRound,"4",0.1)  //object  reelRun_TA.ts
        await dropSymbolY(object ,reelSize, 0.1 ); //啟動縱軸符號掉入盤內  delayTime_preColumn
        await eventDelayTime(dt_preReel)
        await getCatAward(object)
    };

    async function grabMode(){

        let getConvertInitialSymData:any = await convertInitialSymData(divAllRoundData,gameRound,stepRound,0.1) //  轉換當局資料
       
        await clearSymbolPreStep(object,levelIndex)

        await clearFloorSymData(object,levelIndex,0.2)   //清除地板（第二層）符號資料

        await clearReelFloorPreStep(object,levelIndex)

        await buildReelSymPreStep(object,levelIndex,getConvertInitialSymData,gameRound, stepRound, false)

        await drop_symbolsB(object, levelIndex,'reelIn', gameRound,"4",0.1)  //object  reelRun_TA.ts
        await dropSymbolY(object ,reelSize, 0.1 ); //啟動縱軸符號掉入盤內  delayTime_preColumn
        await eventDelayTime(dt_preReel)

        await getCatAward(object)

    };

    async function bonusGameStart(){


        let getConvertInitialSymData:any = await convertInitialSymData(divAllRoundData,gameRound,stepRound,0.1) //  轉換當局資料

            console.log("bonusGameStart_________________A00000:","getConvertInitialSymData",getConvertInitialSymData)

            await clearSymbolPreStep(object,levelIndex)
    
            await clearFloorSymData(object,levelIndex,0.5)   //清除地板（第二層）符號資料
            console.log("bonusGameStart_________________:","clearFloorSymData",gameRound,divAllRoundData,selRoundData)

            await clearReelFloorPreStep(object,levelIndex)
            console.log("bonusGameStart_________________:","clearReelFloor")        

            await changeReelSize(object,levelIndex,0.5)
            console.log("bonusGameStart_________________:","changeReelSizeB",levelIndex)
           
           
            await adjustReelSize(object,levelIndex,gameRound,0.2)            //調整符號尺寸
            console.log("bonusGameStart_________________:","adjustReelSizeB",gameRound)
    
            
    
            await waittingTransation(object,levelIndex,1)//等待地板動畫
            console.log("bonusGameStart_________________:","waittingTransation",levelIndex)

            await buildFloorGridPreStep(object,levelIndex,object.gameRound)
    
            console.log("bonusGameStart_________________:","buildFloorGridB")
    
            await buildReelSymPreStep(object,levelIndex,getConvertInitialSymData,gameRound, stepRound, false)
    
            console.log("bonusGameStart_________________:","buildReelSymB")
    
    
            await buildFloorSymPreStep(object, gameRound) //生成地板（第二層）符號
    
    

    
            await drop_symbolsB(object, levelIndex,'reelIn', gameRound,"4",0.1)  //object  reelRun_TA.ts

            await dropSymbolY(object ,reelSize, 0.1 ); //啟動縱軸符號掉入盤內  delayTime_preColumn
            await eventDelayTime(dt_preReel)

            await getCatAward(object)

            console.log("bonusGameStart_________________:","drop_symbolsB",object.bonusGameRatHolePos)

    };

    async function bonusFreeDrop(){


        let getConvertInitialSymData:any = await convertInitialSymData(divAllRoundData,gameRound,stepRound,0.1) //  轉換當局資料

            console.log("Bonus game Free Drop_________________:","bonusFreeDrop",selRoundData,gameRound,stepRound)
        
        await clearSymbolPreStep(object,levelIndex)

        await clearFloorSymData(object,levelIndex,0.2)   //清除地板（第二層）符號資料
        await clearReelFloorPreStep(object,levelIndex)
        await buildFloorGridPreStep(object,levelIndex,object.gameRound)

        await buildReelSymPreStep(object,levelIndex,getConvertInitialSymData,gameRound, stepRound, false)

        await buildFloorSymPreStep(object, gameRound) //生成地板（第二層）符號


        await drop_symbolsB(object, levelIndex,'reelIn', gameRound,"4",0.1)  //object  reelRun_TA.ts

        await dropSymbolY(object ,reelSize, 0.1 ); //啟動縱軸符號掉入盤內  delayTime_preColumn
        await eventDelayTime(dt_preReel)

        await getCatAward(object)


    }
    async function runCreateReelSym(){

        await adjustReelSize(object,0,gameRound,0.02)            //調整符號尺寸


        await clearSymbolPreStep(object,0)
        await restoreFloorGrid(object,rowCount,0.5) //default 2

        await clearFloorSymData(object,0,0.2)   //清除地板（第二層）符號
        
        let getConvertInitialSymData:any = await convertInitialSymData(divAllRoundData,gameRound,stepRound,0.2) //  轉換當局資料

        await changeReelSize(object,0,0.2)
        console.warn("roundLevelUp_________________:","changeReelSizeB",levelIndex)
       
        await clearReelFloorPreStep(object,0)

        await waittingTransation(object,0,1)//等待地板動畫
        console.warn("roundLevelUp_________________:","waittingTransation",levelIndex)

        await buildFloorGridPreStep(object,0,object.gameRound)
        console.warn("buildFloorGridPreStep_________________:","")

        await buildReelSymPreStep(object,0,getConvertInitialSymData,gameRound, stepRound, false)
        console.warn("buildReelSymPreStep_________________:","")

        //await buildFloorSymB(object, gameRound ,0.1)  //生成地板（第二層）符號
        await buildFloorSymPreStep(object, gameRound)
        console.warn("buildFloorSymPreStep_________________:","")

        await drop_symbolsB(object,0, 'reelIn', gameRound,"4",0.1)  //object  reelRun_TA.ts
        console.warn("drop_symbolsB_________________:","")

        await dropSymbolY(object ,reelSize, 0.1 ); //啟動縱軸符號掉入盤內  delayTime_preColumn

        await eventDelayTime(dt_preReel)

        await getCatAward(object)


    };

    /* 按鈕狀態設置 */
    object.symResourcTA.btnStop.active = true;//顯示停止按鈕
    object.symResourcTA.btnSetting.interactable = false;//禁用設置按鈕
    object.symResourcTA.betAdd.interactable = false;//禁用下注加分按鈕
    object.symResourcTA.betLess.interactable = false;//禁用下注減分按鈕
    object.symResourcTA.btnSpin.getComponent(Animation).getState('btnSpinRotate').speed = spinBtnClickRotateSpeed;//加速旋轉
    object.symResourcTA.btnSpin.getChildByName('loopFx').active = true;//顯示旋轉狀態


        resolve('')
        },timeout*1000)

    })


};


/* 調整各符號層尺寸 */

export async function adjustReelSize(object:any ,levelIndex:number,gameRound:number ,timeout:number){
    let reelRunTA:any = object.reelRunTA
    let reelLevelSizeData:any = assetData.reelLevelSizeData
    let symLayerSize:any = reelLevelSizeData.filter(e => e.levelIndex === levelIndex)[0].reelSize; //選擇當前符號層尺寸
    
    return new Promise(resolve => {
        setTimeout(() => {
        

            reelRunTA.symLayer.getComponent(UITransform).setContentSize(symLayerSize,symLayerSize); //調整符號層尺寸
            reelRunTA.floorLayer.getComponent(UITransform).setContentSize(symLayerSize,symLayerSize); //調整地板層尺寸
            reelRunTA.floorSymLayer.getComponent(UITransform).setContentSize(symLayerSize,symLayerSize); //調整地板下符號層尺寸


            resolve('')
        },timeout*1000)

    })

        
};

/* 生成軸面地板格  個別生成*/
export const buildFloorGridPreStep = async(object:any,levelIndex:number,gameRound: number) => {  
    let reelRunTA:any = object.reelRunTA
    let posArray:any = assetData.posArray
    let mainCanvas:any = find('Canvas')!
    
     
    let reelLevelSizeData:any = assetData.reelLevelSizeData
    let reelRow:number = reelLevelSizeData.filter(e => e.levelIndex === levelIndex)[0].rowCount; //選擇當前符號層尺寸
    let reelColumn:number = reelLevelSizeData.filter(e => e.levelIndex === levelIndex)[0].columnCount; //選擇當前符號層尺寸

 
    let totalID_count:number = reelRow * reelColumn
    let dt_preGrid = assetData.reelTimer.dt_preGrid



    if( gameRound == 0){

        let currentGameData:any = object.gameInitialSimData; //抓取此局模擬資料ID 

    };

                

    for( let i:number = 0 ; i < totalID_count ; i++){
        let c:number = Math.floor(i/reelRow)
        let r:number = i% reelColumn

        let instancSym:any = await getSymFromPool(object,"FloorGrid",dt_preGrid)                 
        let selPosArray:any = new Vec3(posArray[c][r][0],posArray[c][r][1],posArray[c][r][2])
        instancSym.parent = reelRunTA.floorLayer;
        instancSym.setSiblingIndex(0);  //新生成的節點排在最後面顯示，越新越後面
        instancSym.children[0].getChildByName("floor").getComponent(Sprite).spriteFrame = reelRunTA.symbolResourceTA.floorTexture[levelIndex]; //依當下場景Level設置貼圖

        instancSym.setPosition(selPosArray);

        instancSym.children[0].children[0].getComponent(UITransform).width= 280; //復原上一輪回收前動到影子位置 
        instancSym.children[0].children[0].getComponent(UITransform).anchorX= 0.54; //復原上一輪回收前動到影子位置
        instancSym.active = true ; //防呆，避免上一輪回收前有地板在消除前關閉顯示

        await setMapListtNode(i,mainCanvas.floorGridList,instancSym,0.1)
    };
    


};


/* 生成盤面符號  個別生成*/

export const buildReelSymPreStep = async(object:any,levelIndex:number,simData:any,gameRound: number, step: number, isInitial: boolean) => {  

    let reelRunTA:any = object.reelRunTA
    let posArray:any = assetData.posArray
    let tokensData:any = assetData.tokens

    let mainCanvas:any = find('Canvas')!
    
    let getSymbolData:any = assetData.symbolData

    let reelLevelSizeData:any = assetData.reelLevelSizeData
    let reelRow:number = reelLevelSizeData.filter(e => e.levelIndex === levelIndex)[0].rowCount; //選擇當前符號層尺寸
    let reelColumn:number = reelLevelSizeData.filter(e => e.levelIndex === levelIndex)[0].columnCount; //選擇當前符號層尺寸


    var selSymBuildTokenList:any = simData[6]  //補牌資料

    let totalID_count:number = reelRow * reelColumn
    let setSymID:number = 0;
    let reelTokens:any = simData[4]
    let selTokensArray:any  = simData[5]
    let dt_preSymbol:number = assetData.reelTimer.dt_preSymbol


    for( let i:number = 0 ; i < totalID_count ; i++){
        let c:number = Math.floor(i/reelRow)
        let r:number = i% reelColumn

        setSymID = selSymBuildTokenList[i]


        if( setSymID != null ){ //防呆，如果不是空值才生成符

            let symName:string = assetData.symbolData.filter(e => e.symID === setSymID)[0].name

            let selSymbolData:any = getSymbolData.filter(e => e.symID === setSymID)[0];   // 以物件ID過濾
            
            let symbolDesc:string = selSymbolData.description
            let symbolPrefab:string = selSymbolData.symPrefabName
            let symbolType:string = selSymbolData.type
            let selSymToken:string = reelTokens[i]//selTokensArray[c][r] 

            let selSymLevel:number = tokensData.filter(e => e.token === selSymToken)[0].symLevel; //選擇當前符號層尺寸

            
            let instancSym:any = null
            let selPosArray:any = new Vec3(posArray[c][r][0],posArray[c][r][1],posArray[c][r][2])

                instancSym = await getSymFromPool(object,symName,dt_preSymbol)


            instancSym.token = selSymToken; //設定符號Token
            instancSym.symLevel = selSymLevel; //設定符號Token

            instancSym.parent = reelRunTA.symLayer.children[reelRunTA.ColumnsID[c]]; //依座標位置決定父物件，以控制顯示排序      

            if(selSymToken != null){


                await setMapListtNode(i,mainCanvas.symList,instancSym,0.1)

            }
                


            if (symbolType == 'mainSymbol' ) {  //判斷符號種類決定父物件及是否依Level調整貼圖


                let selMainSymLevel:number = Number(selSymToken.charAt(1))
                
               
                await modifySymLevelPic(instancSym,selMainSymLevel,0.1)// = async (symNode:any,symPicID, timeout:number)
            }else if(symbolType == 'character'){  //角色符號

                if (symbolDesc == 'red_cat') {reelRunTA.cat[0] = [c,r]; }   //另存放一份以備後續控制用角色  console.warn('角色1 位置索引 '+object.cat[0]);
                else if(symbolDesc == "yellow_cat"){reelRunTA.cat[1] = [c,r];}  //console.warn('角色2 位置索引 '+object.cat[1]);
                else if(symbolDesc == "green_cat"){reelRunTA.cat[2] = [c,r];}  //console.warn('角色3 位置索引 '+object.cat[2]);
                else if(symbolDesc == "blue_cat"){reelRunTA.cat[3] = [c,r];}  //console.warn('角色3 位置索引 '+object.cat[3]);
                else {console.log('unknow character')}  //console.warn('角色4 位置索引  '+object.cat[3]);}

            };   

            if (isInitial == true) {  //判斷生成符號要置於盤面還是預備位置


                instancSym.setPosition(selPosArray); 

                await setMapListtNode(i,mainCanvas.symList,instancSym,0.1)

            }else{
                instancSym.setPosition(selPosArray.x,selPosArray.y + 1000,1100); 

                await setMapListtNode(i,mainCanvas.tempSymList,instancSym,0.1)

                let symNode:any = mainCanvas.tempSymList.get(i)

            };       
          
        };



        
    };

}




export const buildFloorSymPreStep = async (object:any, gameRound: number) => { 
    let reelRunTA:any = object.reelRunTA
    let posArray:any = assetData.posArray
    let divAllRoundData:any = object.divAllRoundData; //抓取遊戲模擬局數資料
    let floorSymbolData:any = assetData.floorSymbolData

    let allSecFloorSymData:any = await convertSecFloorSymbolData(object,divAllRoundData,gameRound) // 轉換第二層符號資料
    let dt_preFloor:number = assetData.reelTimer.dt_preFloor
    let mainCanvas:any = find('Canvas')!
    
    for(let i = 0; i < allSecFloorSymData.length; i++) {  //_floorSym[0]每局只有第1回合會生成地板下符號
        let _floorSymID = allSecFloorSymData[i].floorSymID
        let _symPosID =  allSecFloorSymData[i].symPos
        let _token = allSecFloorSymData[i].token
        let floorSymName:string = floorSymbolData.filter(e => e.floor_symID === _floorSymID)[0].name
        let _winSymScore = allSecFloorSymData[i].score
        let selPosArray:any = new Vec3(posArray[_symPosID[0][0]][_symPosID[0][1]][0],posArray[_symPosID[0][0]][_symPosID[0][1]][1],posArray[_symPosID[0][0]][_symPosID[0][1]][2])


        let instancSym:any = await getSymFromPool(object,floorSymName,dt_preFloor)

        if(_token == "HO"){
            object.bonusGameRatHolePos = _symPosID[0]  //定義bonusGameRatHolePos
        }
       
        instancSym.parent = reelRunTA.floorSymLayer;  //存放於地板下符號層
       
        instancSym.setPosition(selPosArray); //設置符號座標

        if(instancSym.name =="SymF_11"){

            await setMapListtNode(  "HO",mainCanvas.charactersList,instancSym,0.1)


        }else{

            await setMapListtNode(i,mainCanvas.secSymList,instancSym,0.1)

        }
        instancSym.getComponent(Animation).play('floorSym_idle'); //播放符號待機動作

     };


}



export async function drop_symbolsB(object:any,levelIndex:number, mode: string , gameRound:number ,process :string,timeout:number){

    let dt_preColumn_symIn:number = assetData.reelTimer.dt_preColumn_symIn
    let dt_preColumn_symClean:number = assetData.reelTimer.dt_preColumn_symClean
    let delayTime_preColumn:number = assetData.reelTimer.delayTime_preColumn//每一軸表演的延遲時間
    let reelLevelSizeData:any = assetData.reelLevelSizeData

    let reelRow:number = reelLevelSizeData.filter(e => e.levelIndex === levelIndex)[0].rowCount; //選擇當前符號層尺寸
    let reelColumn:number = reelLevelSizeData.filter(e => e.levelIndex === levelIndex)[0].columnCount; //選擇當前符號層尺寸
    let mainCanvas:any = find('Canvas')!

    let haveNode:number = 0            //檢測單一縱軸是否全是空值，0全是空值，1以上有符號

    let totalID_count:number = reelRow * reelColumn 
            



        for(let i:number = 0 ; i < totalID_count ; i++){
                let c:number = Math.floor(i/reelRow)
                let r:number = i% reelColumn


                    if(mainCanvas.tempSymList.get(i) != null){  //檢測當下執行的grid是否全是空值(沒有符號) 

                        haveNode++;

                    };




                    if (r == 0){
                        if ( mode == 'reelIn' && haveNode!=0) {  //判斷：符號需落於盤面中&&該縱軸非全空值
                            delayTime_preColumn = delayTime_preColumn + dt_preColumn_symIn; //掉入盤面時每軸間隔時間差

                        }else if (mode == 'reelClean' || haveNode!=0){  //判斷：符號需調落於盤面下&&該縱軸非全空值s
                            delayTime_preColumn = delayTime_preColumn + dt_preColumn_symClean; //掉出盤下時每軸間隔時間差

                        }  //如果都不符合條件，代表該縱軸沒有符號，不需等待該軸表演，直接進入下一軸
                        
                

                            if ( mode == 'reelIn' ) {

                
                            }else if(mode == 'reelClean'){

                            }
                            else{

                            }   
                                    
                        haveNode = 0; //單縱軸空值檢測歸0

                    
                    };

        };

};






 
/*  符號掉落於盤中- 縱軸符號依序掉入盤面  */



export async function dropSymbolY(object:any ,reelSize:number,timeout:number){
            let reelRunTA:any = object.reelRunTA
    return new Promise(resolve => {
        setTimeout(() => {

            let dt_preSymbol:number =assetData.reelTimer.dt_preSymbol
            let deltaTime_preSymbol:number = 0 //每一軸表演的延遲時間 
            let symbolData:any = assetData.symbolData
            let isInitialRound:any = object.isInitialRound;
            let posArray:any = assetData.posArray

            let mainCanvas:any = find('Canvas')!


        for(let i = 0; i < reelSize*reelSize; i++){
            let c:number = Math.floor(i/reelSize)
            let r:number = i % reelSize
           
            let selSymNode = mainCanvas.tempSymList.get(i)
          
        
            if(selSymNode != null){

                let selPosArray:any = new Vec3(posArray[c][r][0],posArray[c][r][1],posArray[c][r][2])

                let mapPos:number = r * reelSize + c; //計算角色在地板上的位置
                let selSymName =  selSymNode.name

                let selSymbolData = symbolData.filter(e => e.name === selSymName)[0];   // 以物件ID過濾
                let selSymbolType = selSymbolData.type

                let t1 = tween()  //定義位移掉落緩動

                .to(0.5, { position: selPosArray }, { easing: 'circIn' })  //掉落到盤面25個定點位置

                .call(() => {
     
                    if (selSymbolType == 'character') {  //辨識符號類型決定呼叫掉落表演的涵式
                    

                        chaDropEnding(selSymNode,0.1)

                   
                        if(mainCanvas.floorGridList.get(i) != null){
                            mainCanvas.floorGridList.get(i) .getChildByName('posCtrl').active = false; //將角色位置的地板關閉
                            floorShadowSeting(object,reelSize,i); //調整角色左方地板的影子位置

                        }
                    
                    }else{

                        symDropEnding(selSymNode,0.1)
                        
                        if(mainCanvas.floorGridList.get(i) != null){
                            mainCanvas.floorGridList.get(i).getComponent(Animation).play('floor_Sink');  //播放地板下沉回彈動畫

                        };
                }
            })

            let t2 = tween()  //定義拉伸變形緩動 
                .to(0.5, { scale: new Vec3(0.7, 2, 1) }, { easing: 'quintIn' })  //垂直拉長縮放
                .call(() => {
               
                    selSymNode.setScale(1,1,1) //緩動結束時縮放值歸回
   
                    setMapListtNode(i,mainCanvas.symList,selSymNode,0.1)
     
                    setMapListtNode(i,mainCanvas.tempSymList,null,0.1)



                })

                deltaTime_preSymbol = deltaTime_preSymbol + dt_preSymbol; //每個symbol表演間隔0.03秒時間差，依序累加得出每個symbol各自要等待的時間
                reelRunTA.scheduleOnce(()=>{
                    if (selSymbolType == 'character') {  
                        chaDropStarting(selSymNode,0.1)

                    
                    }else{
           
                        symDropStarting(selSymNode,0.1)

                    }
                    tween(selSymNode).parallel(t1, t2).start();  //同時運行2個緩動，t1移動、t2縮放
                },deltaTime_preSymbol); //每個symbol各自要等待的時間  
      
      
            };
        
        if (i == reelSize *reelSize-1){// && ColumnsID == r) { //判斷若是最後一次掉落，呼叫Spin結果判斷 (橫軸最大值&&縱橫軸數字一樣5x5、8x8)              通知主流程啟動Spin結果判斷 
        

                if( isInitialRound != true){


                };

        };  

        

        }


        
        resolve('')

        },timeout*1000)

    })

        
};


/* 清除盤面符號 */


export const clearSymbolPreStep = async(object:any,levelIndex:number) => {  //清除盤面符號
    let mainCanvas:any = find('Canvas')!

    let dt_preSym_reelClean = assetData.reelTimer.dt_preSym_reelClean

    let rowAndColumn:any = assetData.rowAndColumn

    let reelRow:number = rowAndColumn[levelIndex]// 以最高等級盤面數量來清除
    let reelColumn:number = rowAndColumn[levelIndex]//object.rowAndColumn[object.sceneLevel] //from reelRun_TA.ts
    let totalID_count:number = reelRow * reelColumn


    for(let i:number = 0 ; i < totalID_count ; i++){

        if(mainCanvas.symList.get(i)){
            let selNode:any =  mainCanvas.symList.get(i)


            await setMapListtNode(i,mainCanvas.symList,null,0.1)
            await setMapListtNode(i,mainCanvas.tempSymList,null,0.1)


            await putSymToPoolB(object,selNode,dt_preSym_reelClean)

        } 
        
      


    };

  
}; 




/* 復原被消除的軸面地板格 */

export async function restoreFloorGrid(object:any,rowCount:number,timeout:number)  {

    return new Promise(resolve => { 
        let mainCanvas:any = find('Canvas')!

        setTimeout(() => {

            let totalID_count:number = rowCount * rowCount 
       
            for(let i:number = 0 ; i < totalID_count ; i++){

                if(mainCanvas.floorGridList.get(i)){
                    if (mainCanvas.floorGridList.get(i).active == false) {
                        mainCanvas.floorGridList.get(i).getComponent(Animation).play('floor_ShowUp');
                        mainCanvas.floorGridList.get(i).children[0].getComponent(UITransform).width= 280; //復原影子位尺寸
                        mainCanvas.floorGridList.get(i).children[0].children[0].getComponent(UITransform).anchorX= 0.54; //復原影子位置
                        mainCanvas.floorGridList.get(i).active = true;
                        mainCanvas.floorGridList.get(i).getChildByName('posCtrl').active = true;
                        mainCanvas.floorGridList.get(i).getChildByName('particle_stepLink_shine').active = false;

                        mainCanvas.floorGridList.get(i-1).children[0].getComponent(UITransform).width= 280; //復原地板左邊的地板影子也需復原尺寸
                        mainCanvas.floorGridList.get(i-1).children[0].children[0].getComponent(UITransform).anchorX= 0.54; //復原地板左邊的地板影子也需復原位置
                    
    
    
                    };
                }
            
            };  
            
            resolve('')

        },timeout*1000)

    })


};





/* 清空地板下符號*/

export async function clearFloorSymData(object:any,levelIndex:number,timeout:number)  {

            let mainCanvas:any = find('Canvas')!

            let reelRow:number =assetData.rowAndColumn[levelIndex]//object.rowAndColumn[object.sceneLevel] //from reelRun_TA.ts
            let reelColumn:number = assetData.rowAndColumn[levelIndex]//object.rowAndColumn[object.sceneLevel] //from reelRun_TA.ts
            let totalID_count:number = reelRow * reelColumn 
       
            for(let i:number = 0 ; i < totalID_count ; i++){
      
                await setMapListtNode(i,mainCanvas.floorSymList,null,0.1)

            };

            for( const key of mainCanvas.charactersList.keys()){
                let selNode:any = mainCanvas.charactersList.get(key)
                if(selNode){
        
                    await putSymToPoolB(object,selNode,0.2)
        
                    await setMapListtNode(key,mainCanvas.charactersList,null,0.1)
        
    
                }
 
            };


            for( const key of mainCanvas.secSymList.keys()){
                let selNode:any = mainCanvas.secSymList.get(key)
                if(selNode){
        
                    await putSymToPoolB(object,selNode,0.2)
        
                    await setMapListtNode(key,mainCanvas.secSymList,null,0.1)
        
        
                };

            };


};




/* 重置所有盤面上符號回到一級 */

export async function getReelRunSymArray(object:any,timeout:number) {

    return new Promise(resolve => { 
        let mainCanvas:any = find('Canvas')!
        let symArray = mainCanvas.symArray
        
        setTimeout(() => {

            resolve(symArray)
        },timeout*1000)

    })
};

/* 重置所有盤面上符號回到一級 */

export async function initialSymbolToL1(object:any,timeout:number)  {
    return new Promise(resolve => { 
        setTimeout(() => {

            for (let i = 0; i < object.symLevel.length; i++) {
                object.symLevel[i] = 1 ; //所有一般符號等級重置回1
            }
        
            resolve('')
        },timeout*1000)

    })
};


/* 清除地板 and 清除第二層符號 +await */
export const clearReelFloorPreStep = async(object:any,levelIndex:number) => {  


    let dt_preFloorClean = assetData.reelTimer.dt_preFloorClean

    let rowAndColumn:any = assetData.rowAndColumn
    let reelRow:number = rowAndColumn[levelIndex]
    let reelColumn:number = rowAndColumn[levelIndex]
    let totalID_count:number = reelRow * reelColumn
    let mainCanvas:any = find('Canvas')!
    let i:number = 0
    for(let i:number = 0 ; i < totalID_count ; i++){
                

        let selFloorNode:any = mainCanvas.floorGridList.get(i)

        if(selFloorNode){

            
            await putSymToPoolB(object,selFloorNode,dt_preFloorClean)
            await setMapListtNode(i,mainCanvas.floorGridList,null,0.1)

        }


    };
    for(let i:number = 0 ; i < mainCanvas.secSymList.size ; i++){
        let selNode:any = mainCanvas.secSymList.get(i)
        if(selNode){
            await putSymToPoolB(object,selNode,0.2)

            await setMapListtNode(i,mainCanvas.secSymList,null,0.1)


        }
    };
    for( const key of mainCanvas.charactersList.keys()){
        let selNode:any = mainCanvas.charactersList.get(key)
        if(selNode){

            await putSymToPoolB(object,selNode,0.2)

            await setMapListtNode(key,mainCanvas.charactersList,null,0.1)


        }
       

    }

};


/* 清除角色之外盤面符號，保留角色功能還未寫好 */



export async function changeReelSize(object:any,levelIndex:number,timeout:number) {  //object from reelSizeTA
    let reelRunTA:any = object.reelRunTA

    let reelSizeTA:any = reelRunTA.reelSizeTA

    return new Promise(resolve => { 
        setTimeout(() => {
  
    /* 原底層格崩落 */
           reelSizeTA.reel.getComponent(Animation).play('bigQuake'); //播放震動動畫
            for (let i = 0; i < levelIndex; i++) {

                reelSizeTA.groundLayer.children[i].active = true;
                reelSizeTA.groundLayer.children[i].getComponent(Animation).play('ground_collapse');  //播放地板崩塌動畫
            };
        resolve('')

        },timeout*1000)

    })
};


export async function waittingTransation (object:any,rowCount:number,timeout:number){ //轉場動畫 淡入擴張尺寸後底層格
    let reelRunTA:any = object.reelRunTA
    let reelSizeTA:any = reelRunTA.reelSizeTA

    return new Promise(resolve => {
        setTimeout(() => {

            let _uiTransform = reelSizeTA.groundLayer.getComponent(UITransform);
            tween(_uiTransform).to(0.3, { width: reelSizeTA.bgContentSize[rowCount] }, { easing: 'circOut' }).start(); //調整底層格寬度，參照當前盤面選單
            tween(_uiTransform).to(0.3, { height: reelSizeTA.bgContentSize[rowCount] }, { easing: 'circOut' }).start(); //調整底層格高度，參照當前盤面選單
            for (let i = 0; i < rowCount; i++) {
                reelSizeTA.groundLayer.children[i].getComponent(Animation).play('ground_reset');  //重置擴張前尺寸的地板旋轉縮放透明數值
            }
            for (let i = 0; i <= rowCount; i++) {
                reelSizeTA.groundLayer.children[i].active = true;  //開啟擴張範圍內的底層
            }

            let _reelOpacity = reelSizeTA.reel.getComponent(UIOpacity);
            _reelOpacity.opacity = 0;
            tween(_reelOpacity).to(0.7, { opacity: 255}, { easing: 'circOut' }).start();  //整體盤面淡入顯示

            /* 調整Camera拍攝範圍 */

            tween(reelSizeTA.reelCamera.node.parent).to(0.7, { position: reelSizeTA.CameraPos[rowCount] }, { easing: 'circOut' })  //緩動拍攝範圍，盤面由小變大
            .call(() => {
                reelSizeTA.reelCamera.node.parent.setPosition(reelSizeTA.CameraPos[rowCount]); //設置攝影機拍攝的尺寸範圍 
      
                reelSizeTA.reel.getComponent(Animation).stop(); //停止震動動畫
                reelSizeTA.reel.setPosition(0,0,0); //強制將軸面歸回原座標
            }).start();

            resolve('')
        },timeout*1000)
    })
};






//
/* 重啟spin按鈕 */
export const resetGameSpin = (object:any) => { // object from demoFlow_TA.ts
    object.symResourcTA.btnSpin.getComponent(Button).interactable = true;//啟用spin
    object.symResourcTA.btnSetting.interactable = true;//啟用設置按鈕
    object.symResourcTA.betAdd.interactable = true;//啟用下注加分按鈕
    object.symResourcTA.betLess.interactable = true;//啟用下注減分按鈕
};




export const initialReelData = async (object:any) => { 
    return new Promise(resolve => {


                object.isInitialRound = false  //是否為初始盤面
        
        
                object.currentChanceCardEventIndex = 0 // 目前選取的機會卡事件索引
                object.energyNum = assetData.energyBar.initialEnergy;  //能量霸百分比數值
                object.chanceEventID = 0; //當前的機會事件ID
                object.chanceEventTimes = 0; //該局生成機會事件ID的累加次數
                object.reelRunTA.bonusNum = 0
                object.bonusTotalScore = 0
                object.winTotalScore = 0 
                object.energyNumInt = assetData.energyBar.initialEnergyZero
        
                object.symResourcTA.btnSpin.getComponent(Button).interactable = true;//啟用spin
                object.symResourcTA.btnSetting.interactable = true;//啟用設置按鈕
                object.symResourcTA.betAdd.interactable = true;//啟用下注加分按鈕
                object.symResourcTA.betLess.interactable = true;//啟用下注減分按鈕

                let chanceCountNumLabel = object.reelRunTA.chanceCountNum.getComponent(Label)
                    chanceCountNumLabel.string = object.energyNumInt.toString()
                bonusStateInitial(object, 0.5)  // bonus icon initial state

        resolve('')
    })
};