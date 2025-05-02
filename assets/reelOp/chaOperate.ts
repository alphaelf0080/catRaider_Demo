//
//
/* 角色操作模組 */
//
//

import { _decorator, Component, Node,Vec3, math, Enum, Prefab, tween,Tween, Animation, UITransform, UIOpacity, Vec2, Button, EventHandler, input, Input, EventKeyboard, KeyCode, Sprite, find, Quat, Label, Scheduler } from 'cc';

import {dropSymbolInternal,symPool_Recovery,symLaunchB,symRemoveB,allMainSymUIOpacity,getSymFromPool,putSymToPoolB, showLinkSym,checkSymbolExposed,swapSymOperateB,setMapListtNode} from './symOperate';

import {assetData} from '../inputData/asset_data';
import {startGameReelRun ,initialReelData , dropSymbolY, drop_symbolsB,buildReelSymPreStep} from './reelOperate';
import {show_WinTotalScore ,bombSym ,floorShadowSeting,hideLinkFloorFx,eventDelayTime,energySym,fxLevelupSym,symShock,energyBallDis,bombArea,chanceEventFX,symLevelUp,totalWinRunning,releaseChanceEvent,bonusGameTransitionIn,bonusSym,freeGameTimes_minus,showLinkFloorFx,grabMode_TransitionIn,energyGatheringInt} from './eventPerformance';

import {convertInitialSymData,convertChanceSwapTokens} from '../inputData/dataOperate';




export async function getCatAward(object:any){   //run function from reelOperate //object from

 
    let divAllRoundData:any = object.divAllRoundData
    let selRoundData : any = divAllRoundData.filter(e => e.roundCount === object.gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始
    let reelRunTA:any = object.reelRunTA
    let roundCountLabel = object.reelRunTA.roundCount.getComponent(Label)
        roundCountLabel.string = object.gameRound.toString()


    let spinBtnRotateSpeed:number = assetData.UI.spinBtnRotateSpeed
    
    let currentReelLevel:string = selRoundData.currentReelLevel
    let reelLevelSizeData:any = assetData.reelLevelSizeData
    let levelIndex:number = reelLevelSizeData.filter(e => e.token === currentReelLevel)[0].levelIndex; 
    let symbolRecoveryTime:number = assetData.symbolPerformanceTime.symbolRecoveryTime

   
    let _lineAward = selRoundData.lineAward; //該局所有回合中獎連線資料
    let _ratAward:any = selRoundData.ratAward; //該局所有回合中獎連線資料
    let currentModeTag:string = selRoundData.currentModeTag
   
    let timeScale:number = assetData.chaTimer.catTimeScale
    let tokensData:any = assetData.tokens
    let symbolData:any = assetData.symbolData// assetData.reelTimer
    let stepDuration:any = assetData.chaTimer.stepDuration
    let energyBarCountedSym:any = assetData.energyBarCountedSym
    let maxEnergyInt:number = assetData.energyBar.maxEnergyInt

    let stepCountLabel = object.reelRunTA.stepCount.getComponent(Label)
        stepCountLabel.string = object.stepRound.toString() //更新回合數顯示
 
    let currentReelSize:number = selRoundData.currentReelSize
    let symDropDelayTime:number = assetData.reelTimer.symDropDelay
    let timeOffset :number = assetData.chaTimer.chaMoveTimeOffset
    let dt_preReel:number = assetData.reelTimer.dt_preReel
    let eventDelayTotelTime:number = 0
    let mainCanvas:any = find('Canvas')!

    if(selRoundData.freeDropsCount != null){
        await freeGameTimes_minus(object,selRoundData.freeDropsCount ,0.1)

    }

   
        object.symResourcTA.btnSpin.getComponent(Animation).getState('btnSpinRotate').speed = spinBtnRotateSpeed;//Spin Btn 旋轉速度回歸
        object.symResourcTA.btnSpin.getComponent(Button).interactable = false;//禁用spin按鈕
        object.symResourcTA.btnStop.active = false;//隱藏停止按鈕


    
    if (_lineAward.length > 0 && object.stepRound < _lineAward.length) {  //連線得分處理


        let _colorAward:any = _lineAward[object.stepRound]; //單一回合所有顏色連線資訊

        for (let i = 0; i <_colorAward.length; i++) {  //每一回合
            let _colorSym:any = _colorAward[i].colorSymID;  //取得單一回合的單一筆中獎顏色符號連線資訊   //get catID 
            let _symPos:any = _colorAward[i].symPos//取得行經格數
            let waitTotalTime:number = 0 
            let currentRoundSymPos:any = _colorAward[i].symPos

            if(i == 0){
                waitTotalTime = timeOffset * timeScale 
                
            }else{

                
                if(_symPos.length < 2){
                    waitTotalTime = (timeOffset) * timeScale 

                }else if(_symPos.length == 2){
                    waitTotalTime = (timeOffset )* timeScale 
                }else if( currentRoundSymPos.length >2 &&  currentRoundSymPos.length < 6){

                    waitTotalTime = (timeOffset+Math.log2(currentRoundSymPos.length)) * timeScale 

                }else{

                    waitTotalTime =(timeOffset+Math.log2(currentRoundSymPos.length))* timeScale 
                };
        
            };

            if( i == _colorAward.length -1 ){
       
           
                    symDropDelayTime += waitTotalTime  //最後一步等待時間
                    


            };
        
        
            let symPos:any = _colorAward[i].symPos;
       
            await eventDelayTime(0.2)

            await showLinkSym(object,currentReelSize,_colorSym, symPos)
            if(currentModeTag != "GRAB"){
                await showLinkFloorFx(object,currentReelSize,_colorSym,symPos) 

            }
            await eventDelayTime(0.5)
 
            let catPosC:number = symPos[0][0]
            let catPosR:number = symPos[0][1]
            let catMapPos:number = catPosR * currentReelSize + catPosC;

          
            for (let j = 1; j < symPos.length; j++) { //每一步的事件
               
                let _symPosID:any = symPos[j];  //依序取得要移動步數之座標索引

                let stepWaitTime:number = 0
                
                let selSymToken:string = _colorAward[i].tokens[j]
                let selPerformanceTime:number = tokensData.filter(e => e.token == selSymToken )[0].performanceTime
                let posX:any = _symPosID[0]
                let posY:any = _symPosID[1]
                let symMapPos:number = posY * currentReelSize + posX;

                let currentScore:number = parseFloat(_colorAward[i].catScore[j])

              
                if(j ==1 ){
                    stepWaitTime =  0.7 * timeScale + stepDuration

                }else if(j==2){

                    stepWaitTime =  0.6 * timeScale + stepDuration

                }else if(j>3 && j<7) {   
                    stepWaitTime = (Math.log2(j))*timeScale  - (Math.log2(j-1))*timeScale + stepDuration
                }else{
                    stepWaitTime = (Math.log2(0.95*j))*timeScale - (Math.log2(0.95*(j-1)))*timeScale  +stepDuration
                }

                let catNode:any =  mainCanvas.symList.get(catMapPos)
                
                let symNode:any = mainCanvas.symList.get(symMapPos)
               
                let catRunStepCount:number = j

                if (symNode) {  

                    let symName:string = symNode.name;  //取得符號的名稱，從'_'分割，保留第1部分
    
                    let selSymData:any  = symbolData.filter(e => e.name === symName)[0];   // 以物件ID過濾 /               
                    let selSymType:string  = selSymData.type
      
                    if(energyBarCountedSym.includes(selSymType) == true && object.energyNumInt <=maxEnergyInt ){
                        object.energyNumInt ++
                    }

                    
                    await processCatAwardEvent(object,catNode,catMapPos,symMapPos,currentReelSize,symNode,selSymType,posX,posY,currentScore,stepWaitTime,timeOffset)  //測試 *0.1
                   
                    await energyGatheringInt(object,object.energyNumInt,0.1)

                    if(selSymType == "mainSymbol"){  //main symbol


                        await eventDelayTime(selPerformanceTime)

                        symNode.getChildByName('Particle_Link').active = false; //關閉符號上的連線特效

                        await symRemoveB(object,symNode,0.1)
                        await symPool_Recovery(object,symNode,symbolRecoveryTime)

                        await setMapListtNode(symMapPos,mainCanvas.symList,null,0.1)
  
                        await catRunEndEffect(object,currentReelSize,selSymType,catMapPos,symMapPos,catNode,_colorSym,symPos,posX,posY,object.gameRound,catRunStepCount,currentScore,0.1)

                    }else if(symName == 'SymS_0'){ 

                         
                        symNode.getChildByName('Particle_Link').active = false; //關閉符號上的連線特效
                        await eventDelayTime(selPerformanceTime)

                        await bombSym(object,currentReelSize, posX,posY, symNode.parent,selPerformanceTime);  //執行炸彈符號表演

                        await symLaunchB(object,symNode,posX,posY,_colorSym,0.02)

                        await symPool_Recovery(object,symNode,symbolRecoveryTime)
                        await setMapListtNode(symMapPos,mainCanvas.symList,null,0.1)
                        await catRunEndEffect(object,currentReelSize,selSymType,catMapPos,symMapPos,catNode,_colorSym,symPos,posX,posY,object.gameRound,catRunStepCount,currentScore,0.1)

                    }else if(symName == 'SymS_3'){  //wild symbol

                        await symLaunchB(object,symNode,posX,posY,_colorSym,0.1)
                        await eventDelayTime(selPerformanceTime)

                        await symPool_Recovery(object,symNode,symbolRecoveryTime)

                        await setMapListtNode(symMapPos,mainCanvas.symList,null,0.1)

                        await eventDelayTime(0.01)

                        await catRunEndEffect(object,currentReelSize,selSymType,catMapPos,symMapPos,catNode,_colorSym,symPos,posX,posY,object.gameRound,catRunStepCount,currentScore,0.1)

                    }else if(symName == "SymS_1"){  //bonus symbol

                        await eventDelayTime(0.2)

                        let tempNode:any = mainCanvas.symList.get(symMapPos)
                        ;  //把符號存到暫存節點

                        tempNode.parent = reelRunTA.symLayer.children[7]; //調整符號的父物件，移到最前方避免被前排符號擋住表演 
                       
                        let targetPosX = reelRunTA.symLayerSize[levelIndex]*0.5;  //計算出目的地座標的X軸：由當下盤面尺寸除2

                        tween(tempNode).to(0.3, { position: new Vec3(targetPosX,-130,750), scale: new Vec3(1.3, 1.3, 1.3) }, { easing: 'circOut' }) //符號移到軸面中央
                        
                        await setMapListtNode(symMapPos,mainCanvas.symList,null,0.1)

                        
                        reelRunTA.bonusNum = Math.min(3,reelRunTA.bonusNum+1); //Bouns符號數量+1
                        await bonusSym(object,reelRunTA.bonusNum,0.5)
                        await symPool_Recovery(object,symNode,symbolRecoveryTime)
                        await catRunEndEffect(object,currentReelSize,selSymType,catMapPos,symMapPos,catNode,_colorSym,symPos,posX,posY,object.gameRound,catRunStepCount,currentScore,0.1)




                    }else if(symName == "SymS_2"){ //energy ball symbol

                        await energyGatheringInt(object,maxEnergyInt,0)                       
                        await energySym(object,symNode, object.currentChanceCardEventIndex,0.1) 
                        await eventDelayTime(1)

                        await setMapListtNode(symMapPos,mainCanvas.symList,null,0.1)

                        await energyBallDis(object,symNode,object.currentChanceCardEventIndex,0.1)
                        
                        await symPool_Recovery(object,symNode,symbolRecoveryTime)
    
                        await eventDelayTime(0.01)

                        await catRunEndEffect(object,currentReelSize,selSymType,catMapPos,symMapPos,catNode,_colorSym,symPos,posX,posY,object.gameRound,catRunStepCount,currentScore,0.1)
                        
                   
                    }else if(symName == "SymS_4"){  //upgrade symbol

                        await symLaunchB(object,symNode,posX,posY,_colorSym,0.2)

                        await fxLevelupSym(object,currentReelSize,_colorSym,posX,posY,selPerformanceTime)
                        
                        await symLevelUp(object,currentReelSize,_colorSym,selPerformanceTime)
                        await eventDelayTime(selPerformanceTime)

                        await symPool_Recovery(object,symNode,0.2)

                        await setMapListtNode(symMapPos,mainCanvas.symList,null,0.1)

                        await catRunEndEffect(object,currentReelSize,selSymType,catMapPos,symMapPos,catNode,_colorSym,symPos,posX,posY,object.gameRound,catRunStepCount,currentScore,0.1)

                    }else if(symName == "SymC_11"){
                       
                        await catRunEndEffect(object,currentReelSize,selSymType,catMapPos,symMapPos,catNode,_colorSym,symPos,posX,posY,object.gameRound,catRunStepCount,currentScore,0.1)

                        await ratKilled(object,catNode,currentReelSize,symPos,catRunStepCount,posX,posY,1)

                    }else{
            
                        await catRunEndEffect(object,currentReelSize,"selSymType",catMapPos,symMapPos,catNode,_colorSym,symPos,posX,posY,object.gameRound,catRunStepCount,currentScore,0.1)
                      
              
                    }


      

                }else if(symNode == null){
                    


                    await processCatAwardEvent(object,catNode,catMapPos,symMapPos,currentReelSize,symNode,"empty",posX,posY,currentScore,stepWaitTime,timeOffset*timeScale)  //測試 *0.1
                    await eventDelayTime(stepDuration)

                };

            };
            
            if( i == _colorAward.length -1 ){  //執行鼠洞事件

                let moveRoundIDX:number = _colorAward[i].moveRoundIDX;  //取得移動回合索引
                if(_ratAward.length > 0){
                    let flatRatAward:any = _ratAward.flat();  //扁平化ratAward
                    let selRatAwardData:any = flatRatAward.filter(e => e.moveRoundIDX == moveRoundIDX);   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始
                    let setRatHoleReveal:any = selRatAwardData.filter(e => e.eventTag == "RAT_HOLE_REVEAL")[0];  
                    let selRatMoveData:any = selRatAwardData.filter(e => e.eventTag == "RAT_MOVED")[0];  
                    let selRatKilledData:any = selRatAwardData.filter(e => e.eventTag == "RAT_KILLED")[0];  

                    try{
                        let selRatStartPos:any = selRatMoveData.ratMoves.start_pos
                        let selRatEndPos:any = selRatMoveData.ratMoves.end_pos
                        let ratStartPosX:number = selRatStartPos.c
                        let ratStartPosY:number = selRatStartPos.r
                        let ratEndPosX:number = selRatEndPos.c
                        let ratEndPosY:number = selRatEndPos.r
                        let ratStealTime:number = assetData.ratPerformanceTime.ratStealTime

                        let ratComingTime:number = assetData.ratPerformanceTime.ratComingTime
                        let clearTargetSymbolTime:number = assetData.ratPerformanceTime.clearTargetSymbolTime
                        let ratQuitTime:number = assetData.ratPerformanceTime.ratQuitTime
                        let ratMoveTargetTime:number = assetData.ratPerformanceTime.ratMoveTargetTime
                        let ratPerFormanceDelayTime:number = assetData.ratPerformanceTime.ratPerFormanceDelayTime
       
                        if(setRatHoleReveal){

                            await ratComeIn(object,currentReelSize,ratStartPosX,ratStartPosY,ratComingTime) //盜鼠入場

                            await ratSteal(object,currentReelSize,ratStartPosX,ratStartPosY,ratEndPosX,ratEndPosY,ratStealTime) //0.2
                            await eventDelayTime(ratComingTime)

                            await clearTargetSymbol(object,currentReelSize,ratStartPosX,ratStartPosY,ratEndPosX,ratEndPosY,clearTargetSymbolTime)

                            await ratQuit(object,currentReelSize,ratStartPosX,ratStartPosY,ratEndPosX,ratEndPosY,ratQuitTime)
                           

                            await ratMoveTarget(object,currentReelSize,ratStartPosX,ratStartPosY,ratEndPosX,ratEndPosY,ratMoveTargetTime) //0.2
    
                            await eventDelayTime(ratPerFormanceDelayTime)
    
                        }else if(setRatHoleReveal == null && selRatMoveData){
                            
                            await ratSteal(object,currentReelSize,ratStartPosX,ratStartPosY,ratEndPosX,ratEndPosY,ratStealTime)  //0.2
                            await eventDelayTime(ratComingTime)

                            await clearTargetSymbol(object,currentReelSize,ratStartPosX,ratStartPosY,ratEndPosX,ratEndPosY,clearTargetSymbolTime)

                            await ratQuit(object,currentReelSize,ratStartPosX,ratStartPosY,ratEndPosX,ratEndPosY,ratQuitTime)
                           

                            await ratMoveTarget(object,currentReelSize,ratStartPosX,ratStartPosY,ratEndPosX,ratEndPosY,ratMoveTargetTime)
    

                            await eventDelayTime(ratPerFormanceDelayTime)
                           



                        }else if(setRatHoleReveal == null && selRatMoveData == null && selRatKilledData){



                        };

                    }catch(e){  

                        if(selRatKilledData){
                            //object.stepRound ++
                            console.warn("ratAward__________33333","RAT_KILLED","gameRound",object.gameRound,"stepRound",object.stepRound,"moveRoundIDX",moveRoundIDX,_colorAward[i],"_ratAward",_ratAward,selRatAwardData)
    
                        }


                    }
                  
                };
               
    
            };


        };  //每一回合
        
   
        
        if(object.stepRound >=_lineAward.length ){
            object.stepRound = 0   
            object.gameRound ++
            let gameCase  = await defineGameCondition(object,divAllRoundData,object.gameRound,object.stepRound)

        }else{

            await dropSymbolInternal(object,currentReelSize,levelIndex,symDropDelayTime) //symDropDelayTime
            

            object.stepRound++;  //當下回合數+1
            const selRoundData : any = divAllRoundData.filter(e => e.roundCount === object.gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始

            const getConvertInitialSymData:any = await convertInitialSymData(divAllRoundData,object.gameRound,object.stepRound,0.2)

            await buildReelSymPreStep(object,levelIndex,getConvertInitialSymData,object.gameRound, object.stepRound, false)
    
            await drop_symbolsB(object,levelIndex, 'reelIn', object.gameRound,"4",0.2)  //object  reelRun_TA.ts
            
            await dropSymbolY(object ,currentReelSize, 0.2 ); //啟動縱軸符號掉入盤內  delayTime_preColumn
            
            await eventDelayTime(dt_preReel)
            
            await getCatAward(object)



        }
        
      
       
    }else if ( object.gameRound <= object.gameRoundCount && _lineAward.length >= 0 ){
        if( object.stepRound == _lineAward.length){ //判斷當局結束

            if(_lineAward.length > 0 ){
                object.gameRound ++

                if(object.gameRound == object.gameRoundCount){
                    await spinRoundEnd(object,1)  //reSpin
                }else{

                    object.stepRound = 0   

                    let gameCase  = await defineGameCondition(object,divAllRoundData,object.gameRound,object.stepRound)

                };
            }else if(_lineAward.length == 0){

                object.gameRound ++

                if(object.gameRound == object.gameRoundCount ){
                    await spinRoundEnd(object,1)  //reSpin

                }else{
                    let selRoundData:any = divAllRoundData.filter(e => e.roundCount === object.gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始
                    let initTag:string = selRoundData.initTag
                    let gameMajor:string = selRoundData.currentMajorTag
                    let gameMode:string = selRoundData.currentModeTag
                    let selNewRoundEvent:string = selRoundData.lineEvent
                    let currentReelLevel:string= selRoundData.currentReelLevel

                    if(initTag == "TRIGGER_NEXT_LEVEL" && selNewRoundEvent == "sceneLevelUp" ){
                        object.gameRound ++
                        object.stepRound = 0   
            

            
                        await startGameReelRun(object,object.gameRound,object.stepRound,"levelUp",true,1);
            
                    }
                    
                    if(initTag == "INIT"){
                        if(gameMode == "GRAB"){
            
                            await grabMode_TransitionIn(object,levelIndex,2)

                            await startGameReelRun(object,object.gameRound,object.stepRound,"grabStart",false,1);
            
                        }
            
                    }

                    
                    if(initTag == "CHANCE_CARD_REVEAL"){

                            let gameCase  = await defineGameCondition(object,divAllRoundData,object.gameRound,object.stepRound)

   
                    }
            
                    if(initTag == "TRIGGER_NEW_BONUS"){
            
                        
                        object.gameRound ++
                        object.stepRound = 0   

                        let selRoundData:any = divAllRoundData.filter(e => e.roundCount === object.gameRound )[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始

                        if(object.gameRound >= object.gameRoundCount && selRoundData.lineAward.length == 0 ){

                            await spinRoundEnd(object,1)  //reSpin


                        }else if(selRoundData.lineAward.length >=0){

                            let freeDropsCount:number = selRoundData.freeDropsCount

                            if(freeDropsCount == 5){
                                await bonusGameTransitionIn(object ,freeDropsCount,1)
                                await startGameReelRun(object,object.gameRound,object.stepRound,"bonusStart",true,1);
            
                            }else{
            
                                await startGameReelRun(object,object.gameRound,object.stepRound,"bonusFreeDrop",true,1);  
             
                            }

                        }else{
                            await startGameReelRun(object,object.gameRound,object.stepRound,"bonusLevelUp",true,1); //判斷為bonus 升級

                        };

                    };
            
                   
                }; 
            };
        
        };
        
    }
    
        
};


/* 角色移動結束處置 */ 
export async function catRunEndEffect(object:any ,reelSize:number,symType:string,catMapPos:number,symMapPos:number,catNode:any,catID:number,symPos:any,posX:number,posY:number,gameRound:number,catRunStepCount:number,scoreSum:number,timeout:number){    
    
            let reelRunTA:any = object.reelRunTA
            let mainCanvas:any = find('Canvas')!
        
    
           await checkSymbolExposed(object,reelSize,posX,posY,0.1)
            
            if (catRunStepCount == symPos.length-1 && catNode != null) { //判斷已走完所有步數
        
                let catNodeName:string = catNode.name
                let symbolData:any = assetData.symbolData
                let unFillSymbolType:any = assetData.unFillSymbolType
                let catNodeType:string = symbolData.filter(e => e.name == catNodeName)[0].type

                if(unFillSymbolType.includes(catNodeType)){
       

                    await setMapListtNode(catMapPos,mainCanvas.symList,null,0.05)

                    await setMapListtNode(symMapPos,mainCanvas.symList,catNode,0.1)

          

                    reelRunTA.cat[catID] = [posX,posY]; //並將新索引位置更新至角色索引

               
                        let _catLabel = catNode.getChildByName('score').children[0].getComponent(Label); //取得角色身上跑分的Label

                        let _UIOpacity = _catLabel.node.getComponent(UIOpacity);
                        tween(_UIOpacity).delay(0.5).to(0.5, { opacity: 0 }, { easing: 'circOut' }).start();  //讓角色的分數lable漸淡消失

                    catNode.getComponent(Animation).play('cat_EndScore'); //播放跑分結束Label縮放動畫

                    object.bonusTotalScore += scoreSum; //累計總分
                    object.winTotalScore += scoreSum; //累計獲勝分數
                    await hideLinkFloorFx(object,reelSize,catID,symPos) 

                    await show_WinTotalScore(object,object.winTotalScore) //=  async (object:any,totalScore: number,timeout:number)

                };
            };

};
        
/* Spin 當局結束，重新Spin */ //判定回合結束 spin結算


export async function spinRoundEnd(object:any ,timeout:number){
    let reelRunTA:any = object.reelRunTA
    return new Promise(resolve => {
        setTimeout(() => {
                if(object.winTotalScore > 5){

                    totalWinRunning(object,object.winTotalScore,0)


                }
                if(object.isAutoRun == false){

                    object.stepRound = 0; //回合數紀錄歸零


                   

                    console.warn('重啟Spin按鈕_______000'); 
                    initialReelData(object)


                }else if(object.isAutoRun == true && object.autoRunCount < object.autoRunMaxCount){

                    console.warn('AutoRun_______000'); 

                    initialReelData(object)
                    object.autoRun()


                }

 
                    



            resolve('')
        },timeout*1000)

    })

        
};
        



 


//--------------------------//
export async function processCatAwardEvent(object:any,catNode:any,catMapPos:number,symMapPos:number,reelSize:number,symNode:any,symType:string,posX:number,posY:number,score:number,walkingTime:number,timeout:number){  //obje
    let mainCanvas:any = find('Canvas')!

    let reelRunTA:any = object.reelRunTA
    let posArray:any = assetData.posArray

    if(catNode!= null){
        catNode.parent = reelRunTA.symLayer.children[object.reelRunTA.ColumnsID[posX]]; //依座標位置變換父物件，以控制顯示排序

    };

    let selPosArray:any = new Vec3(posArray[posY][posX][0],posArray[posY][posX][1],posArray[posY][posX][2])


    return new Promise(resolve => {
    setTimeout(() => {
       
                tween(catNode)
                .to(walkingTime, { position: selPosArray }, { easing: 'linear' })     //移動到新座標                 
                .call(() => {

                        let floorGridNode:any = mainCanvas.floorGridList.get(symMapPos) //將角色位置的地板關閉

                        if(floorGridNode){
                            let posCtrlNode:any = floorGridNode.getChildByName('posCtrl');

                            if(posCtrlNode.active ){
                                posCtrlNode.active = false


                                }    
    

                            floorShadowSeting(object,reelSize,symMapPos)
                        }

                    try{
                        let _catLabel = catNode.getChildByName('score').children[0].getComponent(Label); //取得角色身上跑分的Label

                        runCatScore(object,_catLabel,symNode,score,0.1)

                    }catch(e){console.error(e)}
                })
                .start();

            resolve('')

      },(timeout)*1000)

    })

};

 

/* 角色跑分，走一格呼叫一次 */
export async function runCatScore(object:any,catLabel: Label,symNode:any,endScore: number,timeout:number){  
    //console.log('runCatScore_________00000',catLabel,symNode, endScore,timeout)
    let reelRunTA:any = object.reelRunTA
    
    return new Promise(resolve => {
        //setTimeout(() => {
                let _UIOpacity = catLabel.node.getComponent(UIOpacity);
                    _UIOpacity.opacity = 255; //復原lable透明度

                let _startScore = parseFloat(catLabel.string); //將當前分數字串轉為數字
                let _catScore = {score: _startScore }  //設置起始分數
                // console.warn('角色起始分數'+_catScore);
                catLabel.node.active = true;  //顯示角色分數lable
                tween(_catScore).to(0.1, { score: endScore },{
                    onUpdate: () => {
                        catLabel.string = _catScore.score.toFixed(2).toString();//更新分數(限制小數點2位數)
                        // console.warn('角色更新分數'+_catScore.score.toFixed(2).toString());
                }
                }).call(() => {
                    //catLabel.string = endScore.toString();//更新分數
                }).start();



               
            resolve('')

        //},timeout*1000)

    })

};



export const defineGameCondition =  async (object:any,divAllRoundData:any,gameRound:number,stepRound:number)  =>  {

    let selCurrentRoundData:any = divAllRoundData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始
    let gridLevelIndex:any = assetData.gridLevelIndex


    let selPreRoundData : any = divAllRoundData.filter(e => e.roundCount === gameRound-1)[0] //上一局資料
    let selNewRoundEvent:string = selCurrentRoundData.lineEvent
    let gameRoundCount:number =  object.gameRoundCount
    let initTag:string = selCurrentRoundData.initTag
    let gameMajor:string = selCurrentRoundData.currentMajorTag
    let gameMode:string = selCurrentRoundData.currentModeTag
    let gameEvent:string = selCurrentRoundData.lineEvent
    let chanceCardName:string = selCurrentRoundData.chanceCardName
    let chanceEventFXTime:number = assetData.reelTimer.chanceEventFXTime
    let chanceCardSwapWaitTime:number = assetData.symbolPerformanceTime.chanceCardSwapWaitTime
    let releaseChanceCardTime:number = assetData.reelTimer.releaseChanceCardTime

    let reelLevel:number = selCurrentRoundData.currentReelLevel
    let reelLevelIndex:number = gridLevelIndex.filter(e => e.token === reelLevel )[0].index
    let resetReel:boolean = true
    let gameCase:number = 0   

    if(gameMajor == "MAIN"){    
        if(gameMode == "NORMAL"){
            if(gameEvent == "sceneLevelUp"){
                gameCase = 1
                gameRound ++
                let selRoundData:any = divAllRoundData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始

                let currentReelLevel:string= selRoundData.currentReelLevel
                let currentReelLevelIDX:number = gridLevelIndex.filter(e => e.token === currentReelLevel )[0].index
                object.reelRunTA.sceneLevel = currentReelLevelIDX
                object.gameRound = gameRound


                await startGameReelRun(object,gameRound,stepRound,"levelUp",true,1);

            }else if(gameEvent == "chanceCard"){
                gameCase = 2

                object.gameRound = gameRound
                let selRoundData:any = divAllRoundData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始
                let currentReelSize:number = selRoundData.currentReelSize


                await releaseChanceEvent(object,releaseChanceCardTime)

                let chanceCardData = await convertChanceSwapTokens(selPreRoundData,selRoundData)
                let effectID = chanceCardData[2]
                let swapTokenList = chanceCardData[3]

                await chanceEventFX(object,currentReelSize,effectID,swapTokenList,"out",chanceEventFXTime)

                await swapSymOperateB(object,currentReelSize,swapTokenList,effectID,chanceCardSwapWaitTime)
          
                await allMainSymUIOpacity(object,currentReelSize,swapTokenList)

                await getCatAward(object)


            }else if(initTag =="TRIGGER_NEW_BONUS"){
                gameCase = 3
                gameRound ++
                object.gameRound = gameRound

                object.stepRound = 0   
                let selRoundData:any = divAllRoundData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始

                let freeDropsCount:number = selRoundData.freeDropsCount

                if(freeDropsCount == 5){
                    await bonusGameTransitionIn(object ,freeDropsCount,1)
                    await startGameReelRun(object,gameRound,stepRound,"bonusStart",true,1);

                }else{

                    await startGameReelRun(object,gameRound,stepRound,"bonusFreeDrop",true,1);  
 
                }

            }else{




            };
            
        }else if(gameMode == "GRAB"){

            if(gameEvent == "sceneLevelUp"){
                gameCase = 4
                gameRound ++
                let selRoundData:any = divAllRoundData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始

                let currentReelLevel:string= selRoundData.currentReelLevel
                let currentReelLevelIDX:number = gridLevelIndex.filter(e => e.token === currentReelLevel )[0].index
                object.reelRunTA.sceneLevel = currentReelLevelIDX
                object.gameRound = gameRound


                await startGameReelRun(object,gameRound,stepRound,"levelUp",true,1);

            }else if(gameEvent == "chanceCard"){

                gameCase = 5
                object.gameRound = gameRound

                let selRoundData:any = divAllRoundData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始
                let currentReelSize:number = selRoundData.currentReelSize

                await releaseChanceEvent(object,releaseChanceCardTime)

                let chanceCardData = await convertChanceSwapTokens(selPreRoundData,selRoundData)
                let effectID = chanceCardData[2]
                let swapTokenList = chanceCardData[3]

                await chanceEventFX(object,currentReelSize,effectID,swapTokenList,"out",chanceEventFXTime)

                await swapSymOperateB(object,currentReelSize,swapTokenList,effectID,chanceCardSwapWaitTime)
          
                await allMainSymUIOpacity(object,currentReelSize,swapTokenList)

                await getCatAward(object)

            }else{

                gameCase = 6
                object.gameRound = gameRound
                let selRoundData:any = divAllRoundData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始

                await grabMode_TransitionIn(object,reelLevelIndex,2)

                if(initTag == "INIT"){
                    await startGameReelRun(object,gameRound,stepRound,"grabStart",true,1);

                }else{
                    await startGameReelRun(object,gameRound,stepRound,"levelUp",true,1);


                }


            };;
        };   

    }else if(gameMajor == "BONUS"){

        if(gameMode == "NORMAL"){
            if(gameEvent == "sceneLevelUp"){
                gameCase = 7
                gameRound ++
                let selRoundData:any = divAllRoundData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始

                let currentReelLevel:string= selRoundData.currentReelLevel
                let currentReelLevelIDX:number = gridLevelIndex.filter(e => e.token === currentReelLevel )[0].index
                object.reelRunTA.sceneLevel = currentReelLevelIDX
                object.gameRound = gameRound



                await startGameReelRun(object,gameRound,stepRound,"levelUp",true,1);

            }else if(gameEvent == "chanceCard"){

                gameCase = 8
                object.gameRound = gameRound
                let selRoundData:any = divAllRoundData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始
                let currentReelSize:number = selRoundData.currentReelSize
                await releaseChanceEvent(object,releaseChanceCardTime)

                let chanceCardData = await convertChanceSwapTokens(selPreRoundData,selRoundData)
                let effectID = chanceCardData[2]
                let swapTokenList = chanceCardData[3]

                await chanceEventFX(object,currentReelSize,effectID,swapTokenList,"out",chanceEventFXTime)

                await swapSymOperateB(object,currentReelSize,swapTokenList,effectID,chanceCardSwapWaitTime)
          
                await allMainSymUIOpacity(object,currentReelSize,swapTokenList)

                await getCatAward(object)

            }else if(initTag =="TRIGGER_NEW_BONUS"){

                gameCase = 9
                gameRound ++
                object.gameRound = gameRound

                object.stepRound = 0   
                let selRoundData:any = divAllRoundData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始
                
                if(selRoundData.freeDropsCount== 5){
                    await bonusGameTransitionIn(object,selRoundData.freeDropsCount ,1)
                    await startGameReelRun(object,gameRound,stepRound,"bonusStart",true,1);

                }else{

                    await startGameReelRun(object,gameRound,stepRound,"bonusFreeDrop",true,1);  
 
                }


            }else{
                gameCase = 10
                object.gameRound = gameRound
                await getCatAward(object)


            };;
        
        }else if(gameMode == "GRAP"){

            if(gameEvent == "sceneLevelUp"){
                gameCase = 11
                gameRound ++

                let selRoundData:any = divAllRoundData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始

                let currentReelLevel:string= selRoundData.currentReelLevel
                let currentReelLevelIDX:number = gridLevelIndex.filter(e => e.token === currentReelLevel )[0].index
                object.reelRunTA.sceneLevel = currentReelLevelIDX
                object.gameRound = gameRound

                await grabMode_TransitionIn(object,reelLevelIndex,2)


                await startGameReelRun(object,gameRound,stepRound,"levelUp",true,1);

            }else if(gameEvent == "chanceCard"){

                gameCase = 12
                object.gameRound = gameRound
                let selRoundData:any = divAllRoundData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾 //gameRound 0 為初始盤面 spin 由 1開始
                let currentReelSize:number = selRoundData.currentReelSize


                let chanceCardData = await convertChanceSwapTokens(selPreRoundData,selRoundData)
                let swapTokenCoord = chanceCardData[0]
                let effectID = chanceCardData[2]
                let swapTokenList = chanceCardData[3]

                await releaseChanceEvent(object,releaseChanceCardTime)

                await chanceEventFX(object,currentReelSize,effectID,swapTokenList,"out",chanceEventFXTime)

                await swapSymOperateB(object,currentReelSize,swapTokenList,effectID,chanceCardSwapWaitTime)
      
                await allMainSymUIOpacity(object,currentReelSize,swapTokenList)

                await getCatAward(object)


            }else{
                gameCase = 13
                object.gameRound = gameRound


                if(initTag == "INIT"){
                    await startGameReelRun(object,gameRound,stepRound,"grabStart",true,1);

                }else{
                    await startGameReelRun(object,gameRound,stepRound,"levelUp",true,1);


                }

            };;

        };    

    };

    return gameCase;
 };
 

//* 地鼠符號出現 *//
export const ratComeIn =  async (object:any,reelSize:number,posX:number,posY:number,timeout:number)  =>  {   //加入同回合移動標記ID

            let posArray:any = assetData.posArray
            let reelRunTA:any = object.reelRunTA
            let mainCanvas:any = find('Canvas')!
            let ratGetFromPoolTime:number = assetData.ratPerformanceTime.ratGetFromPoolTime
            let startMapPos:number = posY * reelSize + posX; //計算角色在地板上的位置
        
            let _ratSym:any =  await getSymFromPool(object,"SymC_11",ratGetFromPoolTime) //生成盤面上的地鼠符號


            let ratPos:any = new Vec3(posArray[posY][posX][0],posArray[posY][posX][1],posArray[posY][posX][2])

                _ratSym.parent = reelRunTA.symLayer.children[0]; //依座標位置變換父物件，以控制顯示排序

                _ratSym.setPosition(ratPos); //設置地鼠位置



            let ratHoleNode:any =  mainCanvas.charactersList.get("HO")

                ratHoleNode.active = false; //隱藏地板下符號的地洞，待清除盤面符號時再與其他符號一併刪除

                _ratSym.getComponent(Animation).play('mouse_comeIn'); //地鼠播放鑽出地面動畫

};
    


//* 運行地鼠符號行動 *//
export const ratSteal =  async (object:any,reelSize:number,posX_start:number,posY_start:number,posX_end:number,posY_end:number,timeout:number) =>  { 
    console.error(`運行地鼠吸收周邊符號 runMouseSuck()`);
    let reelRunTA:any = object.reelRunTA
    let symbolData:any = assetData.symbolData
    let posArray:any = assetData.posArray
    let mainCanvas:any = find('Canvas')!

    let symbolRecoveryTime:number = assetData.symbolPerformanceTime.symbolRecoveryTime

    let ratNode:any = reelRunTA.symLayer.children[0].getChildByName("SymC_11") //獲取地鼠符號節點
    let collectedNode:Array<Node> = []; //紀錄被吸收的符號節點
    setTimeout(() => {

        let bombAreaPosList = bombArea(reelSize,posX_start,posY_start)[1]

        ratNode.getComponent(Animation).play('mouse_suckIn'); //地鼠播吸收符號動畫
            
            
            // 地鼠周邊符號吸入表演 
        for (let i = 0; i < bombAreaPosList.length; i++) { 
            let bumpAreaMapPos:number = bombAreaPosList[i]

            
            let _sym:any =  mainCanvas.symList.get(bumpAreaMapPos)

            if(_sym){
                let _symType:string = symbolData.filter(e => e.name == _sym.name)[0].type; //取得符號的類型
                let selSymSettingComp = _sym.getComponent("symSetting_TA");

                if(_symType == 'mainSymbol'){

                    let ratStartPosCoord:any = new Vec3(posArray[posY_start][posX_start][0],posArray[posY_start][posX_start][1],posArray[posY_start][posX_start][2])

                    selSymSettingComp.symShock(); //播放符號上的震動動畫

                    _sym.getChildByName('Particle_Link').active = true; //開啟符號上的連線特效

                    collectedNode.push(_sym); //紀錄被吸收的符號節點

                    tween(_sym).delay(0.6).to(0.5, { position: new Vec3(ratStartPosCoord.x, ratStartPosCoord.y, 0), scale: new Vec3(0.5, 0.5, 0.5)},{easing:'cubicOut'})
                    .call(() => {

                        symPool_Recovery(object,_sym,symbolRecoveryTime)
                        setMapListtNode(bumpAreaMapPos,mainCanvas.symList,null,0.1)

                    }).start();
                    
            


                }
            };
            
        };
    return collectedNode

    },timeout*1000)
        
};
    
    

/* 地鼠移動至下個位置再行動 */
export const ratQuit =  async (object:any,reelSize:number,posX_start:number,posY_start:number,posX_end:number,posY_end:number,timeout:number) =>  { 
    
    setTimeout(() => {
        return new Promise(resolve => {  
            let mainCanvas:any = find('Canvas')!
            let startMapPos:number = posY_start * reelSize + posX_start; //計算角色在地板上的位置
        
            let reelRunTA:any = object.reelRunTA
            let ratNode:any = reelRunTA.symLayer.children[0].getChildByName("SymC_11") //獲取地鼠符號節點

            setMapListtNode("HO",mainCanvas.charactersList,null,0.1)



            ratNode.getComponent(Animation).play('mouse_goOut'); //地鼠播放鑽入地下動畫

            resolve(ratNode)
        })

    },timeout*1000)
  
};


/* 地鼠移動到目的地 */
export const clearTargetSymbol =  async (object:any,reelSize:number,posX_start:number,posY_start:number,posX_end:number,posY_end:number,timeout:number)  =>  {   //加入同回合移動標記ID
    let symbolData:any = assetData.symbolData
    let symbolRecoveryTime:number = assetData.symbolPerformanceTime.symbolRecoveryTime
    let mainCanvas:any = find('Canvas')!
    let startMapPos:number = posY_start * reelSize + posX_start; //計算角色在地板上的位置
    let endMapPos:number = posY_end * reelSize + posX_end; //計算角色在地板上的位置
    let ratMoveTargetSymNode:any  =  mainCanvas.symList.get(endMapPos)


   
        if (ratMoveTargetSymNode) {
            let _symType:string = symbolData.filter(e => e.name == ratMoveTargetSymNode.name)[0].type; //取得符號的類型

            if (_symType == 'mainSymbol') {  //如果地鼠的下個位置當前是一般符號，則播放被吸入動畫
 
                ratMoveTargetSymNode.getChildByName('Particle_Link').active = true; //開啟符號上的連線特效
                await symShock(ratMoveTargetSymNode,1)
                setMapListtNode(endMapPos,mainCanvas.symList,null,0.1)

                await symPool_Recovery(object,ratMoveTargetSymNode,symbolRecoveryTime)

            }
        }

}
        

//* 地鼠移動到目的地 *//
export const ratMoveTarget =  async (object:any,reelSize:number,posX_start:number,posY_start:number,posX_end:number,posY_end:number,timeout:number)  =>  {   //加入同回合移動標記ID
    let reelRunTA:any = object.reelRunTA
    let posArray:any = assetData.posArray
    let symbolData:any = assetData.symbolData

    let mainCanvas:any = find('Canvas')!

    let startMapPos:number = posY_start * reelSize + posX_start; //計算角色在地板上的位置
    let endMapPos:number = posY_end * reelSize + posX_end; //計算角色在地板上的位置

    setTimeout(() => {

        if(mainCanvas.floorGridList.get(endMapPos) .getChildByName('posCtrl').active == true){

            mainCanvas.floorGridList.get(endMapPos) .getChildByName('posCtrl').active = false; //將角色位置的地板關閉
        }

        let ratTargetPosCoord:any = new Vec3(posArray[posY_end][posX_end][0],posArray[posY_end][posX_end][1],posArray[posY_end][posX_end][2])

        let ratNode:any = reelRunTA.symLayer.children[0].getChildByName("SymC_11") //獲取地鼠符號節點

        ratNode.setSiblingIndex(0);  //地鼠排序設為最下層
        ratNode.setPosition(ratTargetPosCoord); //移動地鼠至新位置

        let selStartSymNode:any = mainCanvas.symList.get(startMapPos)
        let selStartSymType:string = null

        if(selStartSymNode){

            selStartSymType = symbolData.filter(e => e.name == selStartSymNode.name)[0].type; //取得符號的類型
            if(selStartSymType == "character"){
                setMapListtNode(endMapPos,mainCanvas.symList,ratNode,0.5)

            }else if (selStartSymType == "bonus_character"){
              

                if(startMapPos == endMapPos){


                }else{
                    setMapListtNode(startMapPos,mainCanvas.symList,null,0.2)

                    setMapListtNode(endMapPos,mainCanvas.symList,ratNode,0.5)

                }
            }
        }else{
            setMapListtNode(endMapPos,mainCanvas.symList,ratNode,0.5)

        }


        ratNode.getComponent(Animation).play('mouse_move_comeIn')  //地鼠播放鑽出地面動畫

        /* 地鼠待機 */
        ratNode.getComponent(Animation).on(Animation.EventType.FINISHED, (state) =>{  //地鼠鑽出地面動畫播完時執行以下內容
            ratNode.getComponent(Animation).play('mouse_idle');  //播放地鼠待機動畫
        }, reelRunTA)

        // 移動地鼠至新位置並登錄位置資訊 

    },timeout*1000)
};







//* 地鼠移動到目的地 *//
export const ratKilled =  async (object:any,catNode:any,reelSize:number,symPos:any,catRunStepCount:number,posX:number,posY:number,timeout:number)  =>  {   //加入同回合移動標記ID
    let reelRunTA:any = object.reelRunTA
    let posArray:any = assetData.posArray
    let ratNode:any = reelRunTA.symLayer.children[0].getChildByName("SymC_11") //獲取地鼠符號節點
    let ratPos:any = posY * reelSize + posX; //計算角色在地板上的位置
    let mainCanvas:any = find('Canvas')!

    console.log('instancFXSource_______A00000',ratPos)

    let _fallDirection = 'R'; //被擊中摔出的方向
        if (posX<2) {
            _fallDirection = 'R';  //判斷地鼠位置在縱軸前3列，應向右摔
        }else{
            _fallDirection = 'L';  //判斷地鼠位置在縱軸後5列，應向左摔
        };

    let _fxHit:any = await getSymFromPool(object,"Fx_mouse_hit",0.5)

        _fxHit.parent = reelRunTA.symLayer.children[0]; //依座標位置變換父物件，以控制顯示排序
    let _fxHitPosPos:any = new Vec3(posArray[posY][posX][0],posArray[posY][posX][1],posArray[posY][posX][2])


        _fxHit.setPosition(_fxHitPosPos); //設置擊中特效位置

        
        let ratComponent:any = ratNode.getComponent("catSetting_TA")

        ratComponent._Animation.play('mouse_hit_fall_'+_fallDirection); //利用輸入

        await setMapListtNode(ratPos,mainCanvas.symList,null,0.1)


        await putSymToPoolB(object,ratNode,1)
        if (catRunStepCount == symPos.length-1 && catNode != null) {
            await setMapListtNode(ratPos,mainCanvas.symList,catNode,0.1)
        }

    }


export const chaDropEnding =  async (symNode:any,timeout:number) => new Promise((resolve) =>  { 

        let selChaComponent:any = symNode.getComponent("catSetting_TA")
        
          
        selChaComponent._Animation.play('sym_DropEnd'); //掉落結束時播放回彈動畫
        selChaComponent.node.children[1].children[0].active = true; //開啟清楚版符號貼圖
        selChaComponent.node.children[1].children[1].active = false;  //關閉模糊版符號貼圖

        resolve('')     
})

/* 開始落下 */

export const chaDropStarting =  async (symNode:any,timeout:number) => new Promise((resolve) =>  { 
        let selChaComponent:any = symNode.getComponent("catSetting_TA")

        selChaComponent.node.children[1].children[0].active = false; //關閉清楚版符號貼圖
        selChaComponent.node.children[1].children[1].active = true;  //開啟模糊版符號貼圖

        resolve('')     
})



/* 分數加總 */

export const getScoreSum =  async (scoreList:any,currentIndex:number) => new Promise((resolve) =>  { 
        let scoreSum:number = 0;
        for(let i=0;i<scoreList.length;i++){
            scoreSum += scoreList[i];

        }
        resolve(scoreSum)     
})






