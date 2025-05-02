//
//
// 事件表演模組
//
//
//

import { _decorator,ProgressBar, Component, Node, Vec3, math, Enum, Prefab, tween, Animation, UITransform, UIOpacity, Vec2, Button, EventHandler, input, Input, EventKeyboard, KeyCode, Sprite, find, Quat, Label, Scheduler, ParticleSystem, color, instantiate, Line, Layout, GradientRange, tweenProgress, Tween,Layers } from 'cc';
import { } from './reelOperate';
import {putSymToPoolB,getSymFromPool,modifySymLevelPic,getSymFromPoolB} from './symOperate';

import {assetData} from '../inputData/asset_data';




//能量條數值歸零
export async function energyNumReset(object:any,_energyNum:number,timeout:number){ //object from reelRunTA 

    let reelRunTA:any = object.reelRunTA

    return new Promise(resolve => { 
        setTimeout(() => {

            reelRunTA.energyNum = 0; //能量條數值歸零
            _energyNum = reelRunTA.energyNum; //更新到引用數值

            resolve('')
    
        },timeout*1000)
    })
};







    /* 炸彈符號表演 -耗時秒數視觸發的符號而定 */
export async function bombSym(object:any, reelSize:number,posX: number,posY:number, parentNode: Node,timeout:number){ //object from reelRunTA 

        let reelRunTA:any = object.reelRunTA
        let posArray:any = assetData.posArray
        let selPosArray:any =new Vec3(posArray[posY][posX][0],posArray[posY][posX][1],posArray[posY][posX][2])
        let mainCanvas:any = find('Canvas')!
  
        let _bombFoolFx = instantiate(reelRunTA.symbolResourceTA.fxBomb[0]); //生成爆炸範圍特效
        _bombFoolFx.parent = reelRunTA.floorFxLayer; //指定父物件至地板特效層
        _bombFoolFx.position = selPosArray; //指定生成座標

        let _bombSymFx:Node = null;

        _bombSymFx = instantiate(reelRunTA.symbolResourceTA.fxBomb[1]);  //生成爆炸特效
        _bombSymFx.parent = parentNode;  //指定與符號同一父物件
        _bombSymFx.position = selPosArray; //指定生成座標
        _bombSymFx.active = true;
        let _Ary = bombArea(reelSize,posX,posY)[0] //reelRunTA.bombArea([[posX][posY]]);  //呼叫計算爆炸範圍涵式，並獲取回傳的座標ID陣列
            
        let _Area:[] = bombArea(reelSize,posX,posY)[1]

        for(let i = 0; i < _Area.length; i++){
            if(mainCanvas.floorGridList.get(i) != null){

                mainCanvas.floorGridList.get(i).getChildByName('posCtrl').active = false;
                floorShadowSeting(object,reelSize,i); //調整角色左方地板的影子位置
            };
        }

};


/* 計算爆炸範圍，獲取以角色為原點的九宮格座標ID陣列 */
export const bombArea = (reelSize:number,posX:number,posY:number) => {

        let bombAreaArrayString:Array<string> = [];
        let bombAreaArray: any= [];
        let bombAreaPosList:any = []

        let l = (posX)=> { if(posX-1<0) return 0; else return posX-1; } //獲得左方ID
        let t = (posY)=> { if(posY+1>reelSize-1) return reelSize-1; else return posY+1; } //獲得上方ID
        let b = (posY)=> { if(posY-1<0) return 0; else return posY-1; } //獲得下方ID
        let r = (posX)=> { if(posX+1>reelSize-1) return reelSize-1; else return posX+1; } //獲得右方ID

       
        bombAreaArrayString.push(JSON.stringify([l(posX),b(posY)])); //左上方座標ID組合
        bombAreaArrayString.push(JSON.stringify([l(posX),posY])); //左中座標ID組合
        bombAreaArrayString.push(JSON.stringify([l(posX),t(posY)])); //左下方座標ID組合
        bombAreaArrayString.push(JSON.stringify([posX,b(posY)])); //上方
        bombAreaArrayString.push(JSON.stringify([posX,posY])); //中心點 
        
 
        bombAreaArrayString.push(JSON.stringify([posX,t(posY)])); //下方
        bombAreaArrayString.push(JSON.stringify([r(posX),b(posY)])); //右上
        bombAreaArrayString.push(JSON.stringify([r(posX),posY])); //右中
        bombAreaArrayString.push(JSON.stringify([r(posX),t(posY)])); //右下
 
        const uniqueArray =new Set(bombAreaArrayString) 
      
        uniqueArray.forEach((value) => {
            bombAreaArray.push(JSON.parse(value))
            bombAreaPosList.push(JSON.parse(value)[1]*reelSize+JSON.parse(value)[0])
        })
    

        let bombAreaData = [bombAreaArray,bombAreaPosList]
        return bombAreaData; //回傳組合完成的座標ID陣列
        
};



   /* 升級符號的連鎖特效 */
export const fxLevelupSym = async (object:any,reelSize:number,colorSymID: number, posX: number, posY: number , timeout:number)  => {//new Promise((resolve) =>  { 
    
    let reelRunTA:any = object.reelRunTA
    let mainCanvas:any = find('Canvas')!

    let posArray:any = assetData.posArray

    let startPos:any = new Vec3(posArray[posY][posX][0],posArray[posY][posX][1],posArray[posY][posX][2])
    

    let symLevelUpRef:any = assetData.symLevelUpRef

    let selSymTokensList = symLevelUpRef.filter(e => e.colorAwardID === colorSymID)[0].refTokens;   // 以物件ID過濾


            let reelRow:number = reelSize
            let reelColumn:number = reelSize
            let totalID_count:number = reelRow * reelColumn
            
            for( let i:number = 0 ; i < totalID_count ; i++){
                let c:number = Math.floor(i/reelRow)
                let r:number = i% reelColumn
                let mapPos:number = c * reelRow + r; //計算角色在地板上的位置

                let selSymNode:any =mainCanvas.symList.get(i)// symArray[r][c]
                let wildFxColorData:any = assetData.wildFxColor
                let selWildFxColor:any = wildFxColorData.filter(e => e.index === colorSymID)[0].color
                let selFxColor = color(selWildFxColor[0],selWildFxColor[1],selWildFxColor[2],selWildFxColor[3])
                if(selSymNode){
                    if(selSymTokensList.includes(selSymNode.token)){

              
                        let _LevelupLineFx:any =  await getSymFromPoolB(object,"Fx_levelUpLine",0.05)
       
                        _LevelupLineFx.parent = reelRunTA.symFxLayer

                        _LevelupLineFx.position = new Vec3(0,0,0); //指定生成座標至原點

                        let endPos:any = new Vec3(posArray[c][r][0],posArray[c][r][1],posArray[c][r][2])


                        let _FxLine = _LevelupLineFx.getComponent(Line);

                        _FxLine.positions[0] = new Vec3(startPos.x,startPos.y,10); //設置連鎖起點座標
                        _FxLine.positions[1] = new Vec3(startPos.x,startPos.y,10); //設置連鎖結束座標，動態的起始位置同起點
                        _FxLine.color.color = selFxColor//reelRunTA.FxColor[colorSymID]; //依連線的符號顏色調整連鎖特效顏色
                        _FxLine.onEnable(); //使用onEnable才能讓加入Line的座標點生效
                
                        tween(_FxLine.positions[1]).to(0.2, { x: endPos.x, y: endPos.y, z: -100 },  {   
                            onUpdate: () => {
                                _FxLine.onEnable(); //使用onEnable才能讓變更的Line座標點生效
                            }
                        })
                        
                        .call(() => {
                          
                        }).start();
                        let _LevelupEndFx:any =   await getSymFromPoolB(object,"Fx_levelUp_end",0.02)

                        _LevelupEndFx.parent = reelRunTA.symFxLayer
                        _LevelupEndFx.position = new Vec3(endPos.x,endPos.y,-100); //設置連鎖尾部特效的位置
                        _LevelupEndFx.getComponent(ParticleSystem).startColor.color = selFxColor //


                    };

                }


            
            }




};




/* 指定符號升級 */

export async function symLevelUp(object:any,reelSize:number, colorSymID: number,timeout:number){ 

    return new Promise(resolve => {
        let symLevelUpRef:any = assetData.symLevelUpRef

        let selSymTokensList = symLevelUpRef.filter(e => e.colorAwardID === colorSymID)[0].refTokens;   // 以物件ID過濾
        

            let mainCanvas:any = find('Canvas')!


            let reelRow:number = reelSize
            let reelColumn:number = reelSize
            let totalID_count:number = reelRow * reelColumn
            
            for( let i:number = 0 ; i < totalID_count ; i++){

                let selSymNode:any =mainCanvas.symList.get(i)// symArray[r][c]

      
                if(selSymNode){
                     if(selSymTokensList.includes(selSymNode.token)){
                        let nextSymLevel:number = selSymNode.symLevel+1

                        modifySymLevelPic(selSymNode,nextSymLevel,0.02)// = async (symNode:any,symPicID, timeout:number)

                    } 
          
            }
               
        }  
            resolve('')

    })

};





    /*能量條滿 */
export async function energySym(object:any, symNode:any,nextEventID: number,timeout:number){ 
    
    return new Promise(resolve => {

            
            let reelRunTA:any = object.reelRunTA

            reelRunTA.symFxLayer.addChild(symNode)  //改變圖層
           
            tween(symNode).to(0.3, { position: new Vec3(540,200,300), scale: new Vec3(1.5, 1.5, 1.5) }, { easing: 'circOut' }) //符號移到軸面中央
            
            .call(() => {
                reelRunTA.uiControllerTA.reelStage[1].active = true;
                reelRunTA.uiControllerTA.reelStage[1].getComponent(Animation).play('sym_ShowFx'); //特效淡入動畫(時長0.1秒
               
            })
            
            .delay(timeout)
            .start()


            resolve('')


    })

};

/*能量條滿 */
export async function energyBallDis(object:any,symNode:any,nextEventID: number,timeout:number){ 

    return new Promise(resolve => {

        let reelRunTA:any = object.reelRunTA
        
        tween(reelRunTA.uiControllerTA.reelStage[1]).to(0.5, { position: new Vec3(-300,430,600),scale: new Vec3(0.35,0.35,0.35)}, { easing: 'circOut' })  //表演符號移至能量條上
        .call(() => {
            reelRunTA.uiControllerTA.reelStage[1].active = false;
            reelRunTA.uiControllerTA.reelStage[1].setPosition(0,0,0);
            reelRunTA.uiControllerTA.reelStage[1].setScale(3,3,3);

            putSymToPoolB(object,symNode,0.2)
            
        }).start();
                

        resolve('')


    })

};

/* 能量收集處理 */
export const energyGatheringInt = async (object:any,_energyNumInt:number,timeout:number) => new Promise(resolve => {
    setTimeout(() => {
    let maxEnergyInt:number = assetData.energyBar.maxEnergyInt
    

    if (_energyNumInt >= maxEnergyInt) { //如果能量條數值累加後數值已滿
        if( object.chanceEventTimes < 3){

            object.chanceEventTimes++; //機會事件ID生成次數+1，以利計算下一次該生成的事件ID
            object.energyNumInt = assetData.energyBar.initialEnergyZero; //能量條數值歸0
            
        }
        
        if(object.currentChanceCardEventIndex < object.chanceCardEventCount-1){


        }

        if(object.currentChanceCardEventIndex >= object.chanceCardEventCount-1){

            object.currentChanceCardEventIndex = object.chanceCardEventCount-1; //回到第一個機會卡事件
        }


        runProgressInt(object,maxEnergyInt,0.1)
        


    }else{

        runProgressInt(object,_energyNumInt,0.1)
    }

        let chanceCountNumLabel = object.reelRunTA.chanceCountNum.getComponent(Label)
            chanceCountNumLabel.string = object.energyNumInt.toString()

    resolve('')
    },timeout*1000)
});



/* 機會卡觸發能量釋放 */
export const energyRelease = async (object:any,_energyNum:number,timeout:number) => new Promise(resolve => {

    if( object.chanceEventTimes > 0){
        object.chanceEventTimes - 1 //機會事件ID生成次數-1，以利計算下一次該生成的事件ID

    }

             
    resolve('')
    //},timeout*1000)
});


/* 機會卡觸發能量釋放 */
export const chanceEventFX = async (object:any,reelSize:number,effectID: number,swichList:any,mode:string,timeout:number) =>  {
    

        let reelRunTA:any = object.reelRunTA
        let posArray:any = assetData.posArray
        let mainCanvas:any = find('Canvas')!
        let chanceSwapPreSymTime:number = assetData.reelTimer.chanceSwapPreSymTime
        
        let chanceEffectsData:any = assetData.chanceEffects
        let chanceEventName:string = chanceEffectsData.filter(e => e.effect_ID === effectID)[0].name
        let reelGridEffectCoordOffset:Array<any> = assetData.reelGridEffectCoordOffset
        let chanceEventEffectOffset:Array<any> = reelGridEffectCoordOffset.filter(e => e.name === "chanceEventEffect")[0].offset
 
        for(let i = 0; i < swichList.length ; i++){

            let c:number = Math.floor(i/reelSize)
            let r:number = i% reelSize

    
            if(swichList[i] != null){

                let selPosArray:any = new Vec3(posArray[c][r][0]+chanceEventEffectOffset[0],posArray[c][r][1]+chanceEventEffectOffset[1],chanceEventEffectOffset[2])
                let _instFx:any =  await getSymFromPool(object,"Fx_reflash",0.01); //生成全符號置換事件特效
                let symNode:any = mainCanvas.symList.get(i)

                _instFx.parent = reelRunTA.symLayer.children[reelRunTA.ColumnsID[c]]
                _instFx.setSiblingIndex(reelSize);  //調整子物件排序至最後
                _instFx.setPosition(selPosArray); //設置特效位置


            }

        };
        await symExchangeEffect(object,swichList,mode,chanceSwapPreSymTime*swichList.length)


};

/* 舊符號轉換並消除 */
export const symExchangeEffect =  async (object:any,symList:any,mode:string,timeout:number)=> new Promise((resolve) =>  { 

    setTimeout(() => {
        let mainCanvas:any = find('Canvas')!

        for (let i = 0; i < symList.length; i++) {
            if(symList[i] != null){
                let symNode:any = mainCanvas.symList.get(i)
                let selNodeComponent:any = symNode.getComponent("symSetting_TA"); //取得符號的特殊屬性

                if(mode == "out"){
                    selNodeComponent._Animation.play('sym_Exchange_out'); //播放轉換放大並消失動畫
        
                }else if(mode == "in"){
                    
                    selNodeComponent.getComponent(UIOpacity).opacity = 255;
                   
                   
                    selNodeComponent._Animation.play('sym_Exchange_in'); //播放轉換放大並消失動畫
                    selNodeComponent._Animation.on(Animation.EventType.FINISHED, selNodeComponent.symIdle, selNodeComponent);   //探測動作是否播放完畢，若完成則呼叫待機涵式
        
                }
        
            }

        }
      

        resolve('') 
   },timeout*1000)
            
});



/*能量條增加 */
export async function runProgressInt(object:any,_energyNumInt:number,timeout:number){ 
    
    return new Promise(resolve => {
        let uiControllerTA:any = object.uiControllerTA

        let nextChanceCardEventIndex:number = 0
        let energyStepBarDuration:number = assetData.energyBar.energyStepBarDuration
        let initialEnergyZero:number = assetData.energyBar.initialEnergyZero
        let maxEnergyInt:number = assetData.energyBar.maxEnergyInt
        
        if(object.currentChanceCardEventIndex >= object.chanceCardEventCount-1){
            nextChanceCardEventIndex = object.chanceCardEventCount-1
        }else if(object.currentChanceCardEventIndex < object.chanceCardEventCount-1){
            nextChanceCardEventIndex = object.currentChanceCardEventIndex  +1
        }
   
        let chanceCardEventID:number = object.allChanceCardData[object.currentChanceCardEventIndex].eventIndex
        
        let nextChanceCardEventID:number = object.allChanceCardData[nextChanceCardEventIndex].eventIndex
     
        let _workBar = uiControllerTA.progressBar[chanceCardEventID]; //從陣列宣告取得對應事件ID的Bar條
        
        
        let _Progress = _workBar.getComponent(ProgressBar); //抓取作用Bar條的進度數值

            
        if (_energyNumInt == initialEnergyZero) {  //如果能量條是要縮減至0，則關閉作用Bar條的前端的發光特效
                _workBar.children[0].getChildByName('top').active = false;
                uiControllerTA.progressParent.children[2].children[0].getChildByName('top').active = false; //防呆，最上層的Bar條跟作用中的前端發光特效都關掉
            }
        if (_workBar.getSiblingIndex()!=2) { //判斷當前要加分的bar條是否在最上層
            _workBar.setSiblingIndex(2); //若不是最上層，則將對應當前事件的bar條移至子物件最上層，成為作用Bar條
            _Progress.progress = 0; //將作用Bar條的進度數值歸0
            _workBar.children[0].getChildByName('top').active = false; //關閉作用Bar條的前端的發光特效

            let _lastBar = uiControllerTA.progressParent.children[1]; //從子物件排序抓取前一個事件對應的能量條
            _lastBar.children[0].getChildByName('top').active = false; //關閉前一個事件能量條前端的發光特效
            let _lastProgress = _lastBar.getComponent(ProgressBar).progress; //抓取前一個事件對應能量條的進度數值
            if (_lastProgress <=1) {  //如果前一個事件的能量條不是集滿狀態就歸O
                _lastProgress = 0;
            }
        };
        let processBarDueFloat:number = _energyNumInt/maxEnergyInt
  
            tween(_Progress).to(energyStepBarDuration, { progress: processBarDueFloat },)            
            .call(() => {
                _Progress.progress = processBarDueFloat; //緩動完再輸入一次數值，確保跑完的數值精確
                if (_energyNumInt >= initialEnergyZero) {
              
                    _workBar.children[0].getChildByName('top').active = true; //如果進度條數值大於0.05則開啟當前作用能量條前端的發光特效
                }
                if( _energyNumInt >= maxEnergyInt){
                    ChanceFx_Add(object,chanceCardEventID,nextChanceCardEventID,0.1)
                    object.energyNum = assetData.energyBar.initialEnergy; //能量條數值歸0
                }
            }).start();               
            
        resolve('')

    })

};


/*能量條增加 */
export async function runProgress(object:any,_energyNum:number,timeout:number){ 
    
    return new Promise(resolve => {
        let uiControllerTA:any = object.uiControllerTA
        let reelRunTA:any = object.reelRunTA
        let currentChanceEventIndex:number = object.currentChanceCardEventIndex
        let nextChanceCardEventIndex:number = 0
        let energyStepBarDuration:number = assetData.energyBar.energyStepBarDuration
        if(currentChanceEventIndex >= object.chanceCardEventCount-1){
            nextChanceCardEventIndex = currentChanceEventIndex
        }else{
            nextChanceCardEventIndex = currentChanceEventIndex+1
        }
        
        let energyStep:number = assetData.energyBar.energyStep

        let chanceCardEventID:number = object.allChanceCardData[currentChanceEventIndex].eventIndex
        
        let nextChanceCardEventID:number = object.allChanceCardData[nextChanceCardEventIndex].eventIndex

        let _workBar = uiControllerTA.progressBar[chanceCardEventID]; //從陣列宣告取得對應事件ID的Bar條
        
        
        let _Progress = _workBar.getComponent(ProgressBar); //抓取作用Bar條的進度數值
        let _Test = _workBar.children[0].getChildByName('top');

            
        if (_energyNum == 0) {  //如果能量條是要縮減至0，則關閉作用Bar條的前端的發光特效
                _workBar.children[0].getChildByName('top').active = false;
                uiControllerTA.progressParent.children[2].children[0].getChildByName('top').active = false; //防呆，最上層的Bar條跟作用中的前端發光特效都關掉
            }
        if (_workBar.getSiblingIndex()!=2) { //判斷當前要加分的bar條是否在最上層
            _workBar.setSiblingIndex(2); //若不是最上層，則將對應當前事件的bar條移至子物件最上層，成為作用Bar條
            _Progress.progress = 0; //將作用Bar條的進度數值歸0
            _workBar.children[0].getChildByName('top').active = false; //關閉作用Bar條的前端的發光特效

            let _lastBar = uiControllerTA.progressParent.children[1]; //從子物件排序抓取前一個事件對應的能量條
            _lastBar.children[0].getChildByName('top').active = false; //關閉前一個事件能量條前端的發光特效
            let _lastProgress = _lastBar.getComponent(ProgressBar).progress; //抓取前一個事件對應能量條的進度數值
            if (_lastProgress <=1) {  //如果前一個事件的能量條不是集滿狀態就歸O
                _lastProgress = 0;
            }
        };
  
            tween(_Progress).to(energyStepBarDuration, { progress: _energyNum },)            
            .call(() => {
                _Progress.progress = _energyNum; //緩動完再輸入一次數值，確保跑完的數值精確
                if (_energyNum >= energyStep) {
                    _workBar.children[0].getChildByName('top').active = true; //如果進度條數值大於0.05則開啟當前作用能量條前端的發光特效
                }
                if (_Progress.progress >= 1) { //如果能量條數值已滿
                    ChanceFx_Add(object,chanceCardEventID,nextChanceCardEventID,1)          
                }
            }).start();      
                    
        resolve('')

    })

};

/*機會事件UI初始化 */
export async function energyBarInitial(object:any, chanceCardEventIndex: number,timeout:number){ 

    return new Promise(resolve => {

        setTimeout(() => {
            if(object.allChanceCardData.length != 0){
            let chanceCardEventID:number = object.allChanceCardData[chanceCardEventIndex].eventIndex
     
            randomChanceCardEvent(object,chanceCardEventID,1) //=  async (object:any,eventID: number,timeout:number)=> { 
            restProgress(object,1)
            }
       
            resolve('')

        },timeout*1000)

    })

};

/* 啟動序列1的事件狀態特效後移除，並依序遞補位置 ChanceFx_Reduce*/ 
export async function releaseChanceEvent(object:any,timeout:number){ 
    return new Promise(resolve => {
       
        setTimeout(() => {
        if(object.chanceEventTimes >0){

            let uiControllerTA:any = object.uiControllerTA
            object.chanceEventTimes --

            if (uiControllerTA.chanceFx_Array[0] != null) { //如果第一個位置有內容就啟動事件狀態特效並於等待後移除
                uiControllerTA.chanceFx_Array[0].getComponent(Animation).play('fx_chanceStandby_effective');  //播放事件啟動狀態特效
                let _symNum = uiControllerTA.chanceFx_Array[0].name.split('_')[2];  //取得符號的名稱，從'_'分割，保留第2部分
                uiControllerTA.progressBar[parseInt(_symNum)].getComponent(Animation).play('fx_progressBar_add'); //播放能量條發光特效，表示對應的機會事件執行中
                uiControllerTA.progressBar[parseInt(_symNum)].getComponent(Animation).play('fx_progressBar_add_off');; //播放關閉能量條發光特效
    
                uiControllerTA.chanceFx_Array[0].destroy(); //移除第一個預備狀態特效
                uiControllerTA.chanceFx_Array[0] = null; //清空陣列1的位置
                if (uiControllerTA.chanceFx_Array[1] != null) {  //如果第二個位置有內容就移至第一個位置
                    const _chanceFx1 = uiControllerTA.chanceFx_Array[1];
                    tween(_chanceFx1).delay(0.1).to(0.2, { position: uiControllerTA.ChanceFx_Pos[0]}, { easing: 'cubicOut' }) //delay(0.2)等待機會卡開牌特效表演一會
                    .call(() => {
                        _chanceFx1.setPosition(uiControllerTA.ChanceFx_Pos[0]); //為求位置精準，再設置一次座標
                        uiControllerTA.chanceFx_Array[0] = _chanceFx1; //將原第二個預備狀態特效存入陣列第一個位置
                        uiControllerTA.chanceFx_Array[1] = null; //清空陣列2的位置
                    }).start();
                    if (uiControllerTA.chanceFx_Array[2] != null) {  //如果第三個位置有內容就移至第二個位置
                        const _chanceFx2 = uiControllerTA.chanceFx_Array[2];
                        tween(_chanceFx2).delay(0.1).to(0.2, { position: uiControllerTA.ChanceFx_Pos[1]}, { easing: 'cubicOut' }) //delay(0.2)等待機會卡開牌特效表演一會
                        .call(() => {
                            _chanceFx2.setPosition(uiControllerTA.ChanceFx_Pos[1]); //為求位置精準，再設置一次座標
                            uiControllerTA.chanceFx_Array[1] = _chanceFx2; //將原第二個預備狀態特效存入陣列第一個位置
                            uiControllerTA.chanceFx_Array[2] = null; //清空陣列2的位置
                        }).start();
                    }
                }
  
            } 

            resolve('')
        };


        

        },timeout*1000)

    })

};


export const floorShadowSeting = (object:any,reelSize:number,mapPos:number) => {
   
    let mainCanvas:any = find('Canvas')!
    let posY:number = Math.floor(mapPos/reelSize) //計算角色在地板上的位置

    let _posY = Math.max(0,posY-1);  //橫軸數-1
    if (mainCanvas.floorGridList.get(mapPos).getChildByName('posCtrl').active) {  //檢查如果角色左邊的地板不是空的或關閉狀態才執行


        mainCanvas.floorGridList.get(mapPos).children[0].children[0].getComponent(UITransform).width = 300; //調整影子Sprite的中心偏移  
        mainCanvas.floorGridList.get(mapPos).children[0].children[0].getComponent(UITransform).anchorX= 0.5; //調整影子Sprite的中心偏移
    

    }
};


//延遲時間
export async function eventDelayTime(timeout:number){
    return new Promise(resolve => { 
        setTimeout(() => {
           // console.log('timeout : ',timeout)
        
        
            resolve('')

        },timeout*1000)

    })

};

export const symShock =  async (symNode:any,timeout:number)=> new Promise((resolve) =>  { 
    setTimeout(() => {
        let selSymSettingComp = symNode.getComponent("symSetting_TA");

        
        let _Anispeed = (25-(Math.random()*5))*0.1; //亂數產生一個2~2.5的數值(25-(0~5)x0.1)
        let _AnispeedFix = _Anispeed.toFixed(2); //保留小數點後二位數，同時會被轉為字串
        let _AnispeedFlot = parseFloat(_AnispeedFix); //把字串轉為浮點數
        let _setTime = Math.random()*2; //亂數產生一個0~2的數值
        let _setTimeFix = _setTime.toFixed(2); //保留小數點後二位數，同時會被轉為字串
        let _setTimeFlot = parseFloat(_setTimeFix); //把字串轉為浮點數
        selSymSettingComp._Animation.getState('sym_mouse_shock').setTime(_setTimeFlot);  //差異化每個動畫起始時間點
        selSymSettingComp._Animation.play('sym_mouse_shock');   //播放震動動
        selSymSettingComp._Animation.getState('sym_mouse_shock').speed = _AnispeedFlot;  //差異化每個動畫播放速度    
        


    resolve('') 
    },timeout*1000)
            
});
       



export const selFloorShake =  async (floorNode:any,timeout:number)=> new Promise((resolve) =>  { 
    setTimeout(() => {

        let _Anispeed = (13-(Math.random()*5))*0.1; //亂數產生一個0.8~1.3的數值
        let _AnispeedFix = _Anispeed.toFixed(2); //保留小數點後二位數，同時會被轉為字串
        let _AnispeedFlot = parseFloat(_AnispeedFix); //把字串轉為浮點數
        floorNode.getComponent(Animation).play('floor_shock'); //啟動地板聽牌動畫
        floorNode.getComponent(Animation).getState('floor_shock').speed = _AnispeedFlot;  //差異化每個動畫播放速度
 

        resolve('') 
    },timeout*1000)
            
});


/* 倍率加乘符號噴金幣表演-耗時2秒*/

export const multiplySymAward =  async (object:any,floorSymNode:any,floorCoinID: number,timeout:number)=> new Promise((resolve) =>  { 

        let uiController_TA:any = object.uiControllerTA
        let floorSymbolData:any = assetData.floorSymbolData //獲取符號資料
        let floorSymbolScore:number = floorSymbolData.filter(e => e.floor_symID === floorCoinID)[0].score //獲取符號分數
        uiController_TA.reelStage[2].active = true;
        uiController_TA.reelStage[2].getChildByName('posCtrl').children[floorCoinID-1].active = true; //開啟對應的加乘倍率中獎貼圖
        uiController_TA.reelStage[2].getChildByName('radial_Ray').getComponent(Sprite).color = uiController_TA.FxfloorConiColor[floorCoinID-1]; //放射狀掃光特效-設定對應不同等級金幣的顏色
        uiController_TA.reelStage[2].getComponent(Animation).play('floorSym_stage_win'); //畫面中大符號出現+噴金幣特效(時長1.33秒)
        let _label = uiController_TA.reelStage[2].getChildByName('score').children[0].getComponent(Label); //抓取到跑分的Label
        uiController_TA.runScore(_label, 1.2, floorSymbolScore); //呼叫跑分涵式，表演金幣跑分
       
 
        resolve('') 
            
});


export const multiplySymAwardClose =  async (object:any,floorCoinID: number,timeout:number)=> new Promise((resolve) =>  { 
    setTimeout(() => {
        let uiController_TA:any = object.uiControllerTA

        uiController_TA.reelStage[2].getComponent(Animation).play('floorSym_stage_fadeOut'); //淡出效果動畫(時長0.17秒)
        uiController_TA.reelStage[2].active = false; //關閉畫面中大符號
        uiController_TA.reelStage[2].getChildByName('posCtrl').children[floorCoinID-1].active = false; //關閉對應的加乘倍率中獎貼圖
 
        resolve('') 
    },timeout*1000)
            
});


//開啟Bonus Game 轉場頁面
export const bonusGameTransitionIn =  async (object:any,freeDropCount: number,timeout:number)=> { 
    return new Promise((resolve) =>  { 
    let uiController_TA:any = object.uiControllerTA
    setTimeout(() => {
        uiController_TA.freeGameGet.active = true; //開啟FG轉場頁面
        uiController_TA.freeGameGet.getComponent(Animation).play('freeGame_Get_show'); //播放FG轉場頁面啟動動畫
        let _UIOpacity = uiController_TA.freeGameGet.getComponent(UIOpacity);

        
        _UIOpacity.opacity = 255;

        let _TotalTimes = uiController_TA.freeGameTimes.getChildByName('Times_num').getChildByName('Label_Total_num').getComponent(Label); //取得總次數label
        _TotalTimes.string = freeDropCount.toString(); //設定總次數
        uiController_TA.freeGameTimes.active = true; //開啟FG計數介面

        tween(_UIOpacity).delay(2).to(0.2, { opacity: 0 })
        .call(() => {
            _UIOpacity.opacity = 0; //復原lable透明度
            uiController_TA.freeGameTimes.getComponent(Animation).play('freeGame_Times_totalScale');  //播放FG總次數提示動畫
            uiController_TA.reelRunTA.freeGameMode = true;  //標記FreeGame執行中狀態
            uiController_TA.reelRunTA.bonusNum = 0;  //重置Bonus數量
            uiController_TA.hide_BonusIcon();  //關閉所有Bonus圖示
        }).start();  //讓UI漸淡消失
        
        freeGameTimes_minus(object,freeDropCount ,1)
    resolve('') 
    },timeout*1000)
    
    })
};

// bonus game icon initial, set all bonus icon be hiden.
export const bonusStateInitial =  async (object:any,timeout:number)=> { 

    let uiController_TA:any = object.uiControllerTA
    object.bonusTotalScore = 0; //重置總得分
    return new Promise((resolve) =>  { 
        

            uiController_TA.bonusUI.children.forEach(element => {
                setTimeout(() => {       
                    element.active = false;
                    element.getChildByName('Particle_glow').active = false; //關閉Bonus圖示的發光粒子特效
                },timeout*1000)
            });     

    resolve('') 
        
        
    })
};




export const randomChanceCardEvent =  async (object:any,eventID: number,timeout:number)=> { 
    return new Promise((resolve) =>  { 
    let uiController_TA:any = object.uiControllerTA
    let reelRunTA:any = object.reelRunTA
    setTimeout(() => {

        let _eventID = eventID; //防呆，為避免輸入進來的值是null，再宣告一個值作中繼
        if (_eventID == null) {
            _eventID = 0 ; //如果獲得的值是null，就以0取代
        }
        object.chanceEventID = _eventID; //將新機會事件ID先登錄上盤面表演腳本
        let _posY = uiController_TA.chanceSlot.getPosition().y; //取得Slot現在座標
        let _startSymID = uiController_TA.slot_nowPosY[Math.abs(_posY)]; //用現在的座標來判斷機會卡ID
        uiController_TA.chanceSlot.setPosition(0,uiController_TA.slot_startPosY[_startSymID],0); //用當前機會卡ID來轉換設置slot的起始位置
        tween(uiController_TA.chanceSlot)
        .by(0.5,{position: new Vec3(0,-200,0)},{easing:'backIn'}) //slot起始運轉，下沉再啟動
        .to(1,{position: new Vec3(0,uiController_TA.slot_endPosY[_eventID],0)},{easing:'elasticOut'}) //slot結束運轉，超過終點再回彈
        .union()
        .call(()=>{
            uiController_TA.chanceSlot.setPosition(0,uiController_TA.slot_endPosY[_eventID],0); //為求精確，結束時再設置一次座標
        })

        
        .start();

        resolve('') 
    },timeout*1000)
    })
};



export const restProgress =  async (object:any,timeout:number)=> { 
    return new Promise((resolve) =>  { 
    let uiController_TA:any = object.uiControllerTA
    setTimeout(() => {
        for (let i = 0; i < uiController_TA.progressParent.children.length; i++) {
            uiController_TA.progressParent.children[i].getComponent(ProgressBar).progress = 0; //將3組對應機會事件的能量條都歸0
            uiController_TA.progressParent.children[i].children[0].getChildByName('top').active = false; //關閉所有Bar條的前端的發光特效
        }


        resolve('') 
    },timeout*1000)
    })
};





export const ChanceFx_Add =  async (object:any,eventID: number,nextEventID: number,timeout:number)=> {  
    return new Promise((resolve) =>  { 
    let uiController_TA:any = object.uiControllerTA
    let chanceEffects:any = assetData.chanceEffects; //獲取機會事件特效資料
    let selEventName:any = chanceEffects.filter(e => e.effect_ID === eventID)[0].name; //選擇對應的機會事件特效
    console.log('ChanceFx_Add', eventID,nextEventID)


        let _ChanceFx = instantiate(uiController_TA.chanceFx[eventID]); //生成機會事件預備狀態特效

        _ChanceFx.setParent(uiController_TA.chanceFx_Node); //置於特效座標群組節點下
        _ChanceFx.setPosition(316,19,0);  //特效設置與機會卡同座標
        let _chanceIconFx = uiController_TA.chanceSlot.getParent().getChildByName('fx_chance_Icon_win'); //抓取機會事件卡開牌特效
        _chanceIconFx.active = true; //開啟機會卡開牌特效，啟動後自動播放動畫
        _chanceIconFx.getChildByName('Sprite_spark').getComponent(Sprite).color = uiController_TA.ChanceFx_Color[eventID]; //配合事件種類調整開牌特效顏色
        _chanceIconFx.getComponent(Animation).play('fx_chance_Icon_win'); //播放開牌特效動畫

        for (let i = 0; i < uiController_TA.chanceFx_Array.length; i++) { //循環陣列內的3個定位點，選擇空位作為移動的終點
            if (uiController_TA.chanceFx_Array[i] == null) {  //依序判斷3個位置是否有空位
                tween(_ChanceFx).delay(0.2).to(0.5, { position: uiController_TA.ChanceFx_Pos[i]}, { easing: 'cubicOut' }) //移動至3個預備特效定位點，delay(0.2)等待機會卡開牌特效表演一會
                .call(() => {
                    _ChanceFx.setPosition(uiController_TA.ChanceFx_Pos[i]); //為求位置精準，再設置一次座標
                    uiController_TA.chanceFx_Array[i] = _ChanceFx; //將完成移動的預備特效存入陣列
                    _ChanceFx.getComponent(Animation).play('fx_chanceStandby_idle');  //預備特效啟動待機動畫
                    _chanceIconFx.active = true; //關閉機會事件卡開牌特效
                    randomChanceCardEvent(object,nextEventID,1) //=  async (object:any,eventID: number,timeout:number)=> { 

                }).start();
                break //成功生成一個即退出循環
            }else if (uiController_TA.chanceFx_Array[2] != null) {
                _ChanceFx.destroy(); //防呆，如果三個位置都有預備特效則刪除當下第4個特效
            }       
        }
        if(object.currentChanceCardEventIndex >= object.chanceCardEventCount-1){
            object.currentChanceCardEventIndex = object.chanceCardEventCount-1

        }else{
            object.currentChanceCardEventIndex ++


        }

        resolve('') 
    })
};




/* bonus符號表演 -耗時1.3秒 */

export const bonusSym =  async (object:any,bonusNum: number,timeout:number)=> { 
    let uiController_TA:any = object.uiControllerTA

    return new Promise((resolve) =>  { 
        uiController_TA.reelStage[0].active = true;
        uiController_TA.reelStage[0].getComponent(Animation).play('sym_ShowFx'); //特效淡入動畫(時長0.1秒)
    setTimeout(() => {
        tween(uiController_TA.reelStage[0]).to(0.3, { position: new Vec3(uiController_TA.bonusIcon_PosX[bonusNum],682,0),scale: new Vec3(0.5,0.5,0.5)}, { easing: 'circOut' })  //表演符號移至UI上
            .call(() => {
                uiController_TA.reelStage[0].active = false;
                uiController_TA.reelStage[0].setPosition(0,132,0);
                uiController_TA.reelStage[0].setScale(3,3,3);
                uiController_TA.bonusUI.children[bonusNum-1].active = true; //開啟對應的Bonus圖示
                if (object.reelRunTA.bonusNum == 3) { //如果Bonus圖示已滿
                    show_freeGameReday(object,0.5)

                }
            }).start(); 
        resolve('') 
    },timeout*1000)
    })
};



/* 啟動Bonus圖示集滿效果 */

export const show_freeGameReday =  async (object:any,timeout:number)=> { 
    let uiController_TA:any = object.uiControllerTA

    return new Promise((resolve) =>  { 
      


    setTimeout(() => {
            for (let i = 0; i < uiController_TA.bonusUI.children.length; i++) {
                uiController_TA.bonusUI.children[i].getComponent(Animation).play('bonusIcon_scale_Loop'); //播放Bonus圖示集滿效果
            }
        resolve('') 
    },timeout*1000)
    })
};




/* FG計數介面的計次變動 */
export const freeGameTimes_minus =  async (object:any,freeGameLeftover: number,timeout:number)=> { 
    let uiController_TA:any = object.uiControllerTA
                    //object.freeDropCount --

    return new Promise((resolve) =>  { 
        
    setTimeout(() => {
        let _labelTimes = uiController_TA.freeGameTimes.getChildByName('Times_num').getChildByName('Label_Times_num').getComponent(Label); //取得計次label
        _labelTimes.string = freeGameLeftover.toString();
        uiController_TA.freeGameTimes.getComponent(Animation).play('freeGame_Times_useScale');  //播放FG總次數提示動畫
        resolve('') 
    },timeout*1000)
    })
};
    


export const totalWinRunning =  async (object:any,totalScore: number,timeout:number)=> { 
    let uiController_TA:any = object.uiControllerTA

    return new Promise((resolve) =>  { 
        setTimeout(() => {

            uiController_TA.totalWin.active = true; //開啟TotalWin結算頁面
            uiController_TA.totalWin.getComponent(Animation).play('total_win_show'); //播放結算頁面啟動動畫
            let _UIOpacity = uiController_TA.totalWin.getComponent(UIOpacity);
            _UIOpacity.opacity = 255;
            let _scoreLabel = uiController_TA.totalWin.children[0].getChildByName('Label_score').getComponent(Label); //取得跑分label
            let _Score = {score: 0 }  //設置起始分數，宣告一個內含score:參數的項目
            _scoreLabel.string = _Score.toString(); //設定跑分label初始值
            tween(_Score).to(2, { score: totalScore },{  //運行跑分
                onUpdate: () => {
                    _scoreLabel.string = _Score.score.toFixed(2).toString(); //更新分數(限制小數點2位數)
                }
            }).call(() => {
                _scoreLabel.string = totalScore.toFixed(2).toString(); //輸入跑分終點數值
            }).start();
            
            tween(_UIOpacity).delay(3).to(0.2, { opacity: 0 })  //延遲3秒，等待跑分動畫結束停頓一會再啟動漸淡消失
            .call(() => {
       
                uiController_TA.freeGameTimes.active = false; //關閉FG計數介面
                _UIOpacity.opacity = 0; //復原lable透明度
            })
            .start();  //讓UI漸淡消失    uiController_TA.reelRunTA.bonusTotalScore = 0; //重置BonusGame累加分數

            resolve('') 
        },timeout*1000)
    })
};      





    //UI得分欄-顯示總贏得分數，2秒後復原回跑馬燈
    export const show_WinTotalScore =  async (object:any,totalScore: number)=> { 
    let uiController_TA:any = object.uiControllerTA
                    //object.freeDropCount --

        return new Promise((resolve) =>  { 

            uiController_TA.winTotalScoreInfo.getChildByName('score').getChildByName('label').getComponent(Label).string = totalScore.toFixed(2); //共贏分設置
            uiController_TA.marquee.getComponent(UIOpacity).opacity = 0; //隱藏跑馬燈
            uiController_TA.winTotalScoreInfo.active = true;//顯示共贏得
            uiController_TA.winTotalScoreInfo.getComponent(Animation).play('totalscoreShow_onlyLabel');

            resolve('') 
        })
};
    




/* 符號轉換表演 */
export const symbolSwitch =  async (object:any,freeGameLeftover: number,timeout:number)=> { 
    let uiController_TA:any = object.uiControllerTA

    return new Promise((resolve) =>  { 
        
    setTimeout(() => {
        let _labelTimes = uiController_TA.freeGameTimes.getChildByName('Times_num').getChildByName('Label_Times_num').getComponent(Label); //取得計次label
        _labelTimes.string = freeGameLeftover.toString();
        uiController_TA.freeGameTimes.getComponent(Animation).play('freeGame_Times_useScale');  //播放FG總次數提示動畫
        resolve('') 
    },timeout*1000)
    })
};
    




    /* 顯示地板連線特效 */
export const showLinkFloorFx =  async (object:any,reelSize:number,colorID:number,symPos:any)=> { 
    let reelRunTA:any = object.reelRunTA
    let mainCanvas:any = find('Canvas')!
    let wildFxColorData:any = assetData.wildFxColor
    let selWildFxColor:any = wildFxColorData.filter(e => e.index === colorID)[0].color
    let selFxColor = color(selWildFxColor[0],selWildFxColor[1],selWildFxColor[2],selWildFxColor[3])
   
        for (let i = 0; i < symPos.length; i++) {
            let posX:number = symPos[i][0];
            let posY:number = symPos[i][1];
            let mapPos:number = posY * reelSize + posX;

                let _fx = mainCanvas.floorGridList.get(mapPos) .getChildByName('particle_stepLink_shine'); //獲取Wild的連線特效節點

                _fx.getComponent(ParticleSystem).startColor.color = selFxColor //依連線的符號顏色調整特效顏色

                _fx.active = true; //開啟符號上的連線特效

        }

};
    


/* 關閉地板連線特效 */
export const hideLinkFloorFx =  async (object:any,reelSize:number,catID:number,symPos:any)=> { 

    let mainCanvas:any = find('Canvas')!


    for (let i = 0; i < symPos.length; i++) {
        let posX:number = symPos[i][0];
        let posY:number = symPos[i][1];
        let mapPos:number = posY * reelSize + posX; //計算角色在地板上的位置

        if (mainCanvas.floorGridList.get(mapPos)  != null) { //防呆，確認符號未被消除才執行
            let floorGridNode:any = mainCanvas.floorGridList.get(mapPos) ; //將角色位置的地板關閉

            let _fx = floorGridNode.getChildByName('particle_stepLink_shine'); //獲取Wild的連線特效節點
                _fx.active = false; //開啟符號上的連線特效


        } 
    }

};





//開啟 搶分模式 轉場頁面
export const grabMode_TransitionIn =  async (object:any,reelLevelIndex:number,timeout:number)=> { 
    return new Promise((resolve) =>  { 
    let reelRunTA:any = object.reelRunTA
    setTimeout(() => {
    
        object.grabMode = true; //標註搶分模式為啟動狀態
        object.getReadyGrab = false; //關閉預備進入搶分模式狀態
         grabGameGet_UI(object,1)
        reelRunTA.symbolResourceTA.fxGrabGame[0].active = true; //開啟前景光束特效
        reelRunTA.MG_background.color = color(99,81,173); //場景背景圖顏色調暗


        for (let i = 0; i <= reelLevelIndex; i++) {
            reelRunTA.reelSizeTA.groundLayer.children[i].getComponent(Animation).play('ground_grabFloor_0_lv'+i.toString());  //播放啟動搶分模式地板閃爍效果
       }

        resolve('') 
    },timeout*1000)
    
    })
};

export const grabGameGet_UI =  async (object:any,timeout:number)=> { 
    return new Promise((resolve) =>  { 
    let reelRunTA:any = object.reelRunTA
    let uiController_TA:any = object.uiControllerTA
    setTimeout(() => {
    
        uiController_TA.grabGameGet.active = true; //開啟FG轉場頁面
        uiController_TA.grabGameGet.getComponent(Animation).play('freeGame_Get'); //播放FG轉場頁面啟動動畫

        uiController_TA.grabGameGet.active = false; //關閉搶分模式轉場頁面

        resolve('') 
    },timeout*1000)
    
    })
};


