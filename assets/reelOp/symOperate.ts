// symbol operate module 
// 
//
//
//
//




import { _decorator, NodePool,instantiate,Component,ParticleSystem, Node,Vec3, color, Enum, Prefab, tween, Animation, UITransform, UIOpacity, Vec2, Button, EventHandler, input, Input, EventKeyboard, KeyCode, Sprite, find, Quat, Label, Scheduler } from 'cc';

import {selFloorShake,multiplySymAward,multiplySymAwardClose,symExchangeEffect} from './eventPerformance';

import {assetData} from '../inputData/asset_data';



/* 符號顯示連線特效 */

export async function showLinkSym(object:any,reelSize:number,colorID:number,symPos:any){ //object from reelRunTA

    return new Promise(resolve => {
        let reelRunTA:any = object.reelRunTA
        let symbolData = assetData.symbolData
        let mainCanvas:any = find('Canvas')!
        let wildFxColorData:any = assetData.wildFxColor
        let selWildFxColor:any = wildFxColorData.filter(e => e.index === colorID)[0].color
        let selFxColor = color(selWildFxColor[0],selWildFxColor[1],selWildFxColor[2],selWildFxColor[3])

            
            for (let i = 0; i < symPos.length; i++) {

                let posX:number = symPos[i][0];
                let posY:number = symPos[i][1];
                let mapPos:number = posY * reelSize + posX; //計算symbol在地板上的位置

                if(mainCanvas.symList.get(mapPos) != null){

                    let symNode:any = mainCanvas.symList.get(mapPos)
                    let symName:string = symNode.name
                    let symType:string = symbolData.filter(e => e.name === symName)[0].type;

                    if (symType == 'mainSymbol') { //判斷是否為一般符號

                        mainCanvas.symList.get(mapPos).getChildByName('Particle_Link').active = true; //開啟符號上的連線特效
    
                    }else if(symName == 'SymS_3' ){  //如果是Wild符號就配合角色改變連線特效顏色及符號貼圖顏色
       
                        symNode.parent = reelRunTA.symLayer.children[reelRunTA.ColumnsID[symPos[i][1]]]; //依座標位置決定父物件，以控制顯示排序      

                        let _WildSprite = symNode.getChildByName('posCtrl').getChildByName('sym_Sprite').getComponent(Sprite); //獲取Wild符號的Sprite
                        _WildSprite.spriteFrame = reelRunTA.symbolResourceTA.WildTexture[colorID]; //Wild置換對應連線顏色的貼圖
                        let _fx = symNode.getChildByName('Particle_Link'); //獲取Wild的連線特效節點

                        _fx.getComponent(ParticleSystem).startColor.color = selFxColor//reelRunTA.FxColor[catID]; //依連線的符號顏色調整特效顏色
                        _fx.children[0].getComponent(ParticleSystem).startColor.color = selFxColor//reelRunTA.FxColor[catID]; //依連線的符號顏色調整特效顏色
                        _fx.active = true; //開啟符號上的連線特效
    
                    }else if(symName == 'SymS_0' ){  //如果是炸彈、升級符號就配合角色改變連線特效顏色
                        let _fx = symNode.getChildByName('Particle_Link'); //獲取Wild的連線特效節點
                        _fx.getComponent(ParticleSystem).startColor.color = selFxColor//reelRunTA.FxColor[catID]; //依連線的符號顏色調整特效顏色
                        _fx.children[0].getComponent(ParticleSystem).startColor.color = selFxColor//reelRunTA.FxColor[catID]; //依連線的符號顏色調整特效顏色
                        _fx.active = true; //開啟符號上的連線特效
                    }
                } 
            }       
            resolve('')  

    })

        
};







/* 消除符號 */

export const symRemoveB =  async (object:any,symNode:any,timeout:number) => new Promise((resolve) =>  { 
    
    setTimeout(() => {
        let symbolRecoveryTime:number = assetData.symbolPerformanceTime.symbolRecoveryTime


          
        let selSymComponent:any = symNode.getComponent("symSetting_TA")

        selSymComponent._Animation.play('sym_Remove'); //播放消除動畫
        let _symName = selSymComponent.node.name;  //取得符號自身的名稱
        if (_symName == 'SymS_3') {
            let _WildSprite = selSymComponent.node.getChildByName('posCtrl').getChildByName('sym_Sprite').getComponent(Sprite); //獲取Wild符號的Sprite
            _WildSprite.spriteFrame = selSymComponent.symbolResourceTA.WildTexture[4]; //重置Wild貼圖，回到預設顏色
        }
      

    resolve('')
    },timeout*1000)       

});




/* 符號啟動並消除 */

export async function symLaunchB(object:any,symNode:any,posX:number,posY:number,catID:number,timeout:number){ 

    return new Promise(resolve => { 

        setTimeout(() => {

            let selSymComponent:any = symNode.getComponent("symSetting_TA")
                selSymComponent._Animation.play('sym_Launch'); //播放消除動畫  包含透明度 0
            let _FxLaunch = selSymComponent.node.getChildByName('posCtrl').getChildByName('Fx_Launch'); //獲取符號上的功能啟動特效
                _FxLaunch.active = true; //開啟符號功能啟動特效
                _FxLaunch.getComponent(ParticleSystem).startColor.color = selSymComponent.FxColor[catID]; //依連線的符號顏色調整特效顏色
 

        resolve('')
    
        },timeout*1000)
    })
};



export const symbolInstanceNode = (object:any,prefab:Prefab,symName:string) =>{

        object.instancePool.set(symName,new NodePool());
        let pool = new NodePool()
            pool.put(instantiate(prefab))  
        return pool.get();
};



export const putSymToPool = (object:any,symNode:any) =>{

    let symName:string = symNode.name
    let pool = object.instancePool.get(symName);

    pool.put(symNode)
};



export const putSymToPoolA = async (object:any,symNode:any,timeout:number) =>   { 
    return new Promise(resolve => { 
     
            let symName:string = symNode.name
            let pool = object.instancePool.get(symName);

            pool.put(symNode)

            resolve('')

    })
};





export const putSymToPoolB = async (object:any,symNode:any,timeout:number) =>   { 
    return new Promise(resolve => { 
        setTimeout(() => {

            let symName:string = symNode.name
            let pool = object.instancePool.get(symName);

            pool.put(symNode)
            resolve('')
    
        },timeout*1000)
    })
};


export const getSymFromPool = async (object:any,symName:string,timeout:number) =>   { 
    return new Promise(resolve => { 
            let _instsymbolPrefab = object.symbolPool.get(symName)


            object.instancePool.set(symName,new NodePool());
            let pool = new NodePool()
                pool.put(instantiate(_instsymbolPrefab))
            resolve(pool.get())
    
    })
};


export const getSymFromPoolB = async (object:any,symName:string,timeout:number) =>   { 
    return new Promise(resolve => { 
        
        setTimeout(() => {

            let _instsymbolPrefab = object.symbolPool.get(symName)


            object.instancePool.set(symName,new NodePool());
            let pool = new NodePool()
                pool.put(instantiate(_instsymbolPrefab))


            resolve(pool.get())
    
        },timeout*1000)
    })
};

/* 重置狀態並回收進物件池 */
export const symPool_Recovery =  async (object:any,symNode:any,timeout:number)  => new Promise((resolve) =>  { 

    setTimeout(() => {

        symNode.setScale(1,1,1);
        symNode.getComponent(UIOpacity).opacity = 255;  //回收前將自身透明度重置，避免再次取用時透明度異常
        let _FxLaunch = symNode.getChildByName('posCtrl').getChildByName('Fx_Launch'); //獲取符號上的功能啟動特效
        if (_FxLaunch != null) {
            _FxLaunch.active = false; //關閉符號作用啟動特效
        }
        symNode.getChildByName('posCtrl').setPosition(0,0,0); //確認符號貼圖歸0
        symNode.getChildByName('posCtrl').getChildByName('sym_Sprite').active = true ; //確認符號貼圖開啟
        symNode.getChildByName('posCtrl').getChildByName('sym_Sprite').children[0].getComponent(UIOpacity).opacity = 0 ; //確認符號加色效果關閉
        symNode.getChildByName('posCtrl').getChildByName('sym_Sprite_blur').active = false ; //關閉模糊狀態貼圖

        let symName:string = symNode.name
        let pool = object.instancePool.get(symName);

        pool.put(symNode)

        
        resolve('')
    },timeout*1000)       
    
});


/* 重置Wild貼圖，回到預設顏色 */

export const resetWildSym =  async (symNode:any,timeout:number) => new Promise((resolve) =>  { 

    let selSymComponent:any = symNode.getComponent("symSetting_TA")

    setTimeout(() => {
        let _WildSprite = symNode.getChildByName('posCtrl').getChildByName('sym_Sprite').getComponent(Sprite); //獲取Wild符號的Sprite
        _WildSprite.spriteFrame = selSymComponent.symbolResourceTA.WildTexture[4]; //重置

        resolve('')
    },timeout*1000)       
  
});



/* 向前補牌 */
export async function dropSymbolInternal(object:any,reelSize:number,levelIndex:number,timeout:number){ 

    let reelRunTA:any = object.reelRunTA
    let mainCanvas:any = find('Canvas')!

    let posArray:any = assetData.posArray
    return new Promise((resolve) => {
        setTimeout(() => {
            
            var symbolData:any = assetData.symbolData

            let totalID_count:number = reelSize * reelSize 
            let moveTo = reelSize; //存放掉落目的地索引值，8格為最大值

            let unFillSymbolType:any = assetData.unFillSymbolType//不需補位的符號類型


            for(let i:number = 0 ; i < totalID_count ; i++){    //依序檢查每個符號下方是否是空位
                let c:number = Math.floor(i/reelSize)
                let r:number = i% reelSize

                let selSymPos:number = c * reelSize + r //計算symbol在symArray中的位置

                    if (mainCanvas.symList.get(i) != null && i >= reelSize ) {  //過濾掉空節點&&最下排符號
           
                        let symNode:any = mainCanvas.symList.get(i)//.clone(); //複製符號
                 
                        let symName:string = symNode.name

                        let selSymbolData:any = symbolData.filter(e => e.name === symName)[0];   // 以物件ID過濾
           
                        let symType:string = selSymbolData.type
        
                        moveTo = reelSize; //重置存放掉落目的地索引值
                        if ( unFillSymbolType.includes(symType)== false ) {  //過濾掉角色符號(角色符號固定不動)
                
                            for(let _i = i; _i >= 0 ; _i -= reelSize ){
                    
                                if (mainCanvas.symList.get(_i) == null){ //如果下方位置符號是空的
                                    moveTo = Math.floor(_i/reelSize) //暫存至掉落目的地索引值
                                 
                                  
                                }
                             

                            };
   

                            if (c > moveTo) {  //如果當前檢測符號位置高於檢測到的空格位置則執行掉落
                                let _minus = c-moveTo; //移動量的差值，當前位置索引值減目地位置索引值
                                let _moveToTime = 0.1*_minus;  //每格移動時間X移動量，算出不同移動距離的移動時間

                                let selPosArray:any = new Vec3(posArray[moveTo][r][0],posArray[moveTo][r][1],posArray[moveTo][r][2])
       
                                tween(symNode).to(_moveToTime, { position: selPosArray }, { easing: 'linear' })
                                .call(() => {
                                    symDropEnding(symNode,0.1)
                                  
                                })
                                .start();  //掉落到下方一個符號位置
                                    symNode.parent = reelRunTA.symLayer.children[reelRunTA.ColumnsID[moveTo]]; //依座標位置調整父物件，以控制顯示排序 
                                
                                   
                                    let moveToMapPos:number =(moveTo * reelSize ) +r; //計算symbol在地板上的位置
                                    setMapListtNode(i,mainCanvas.symList,null,0.05)

                                    setMapListtNode(moveToMapPos,mainCanvas.symList,symNode,0.05)

                                };
                            
                            };
                    
                  
                    };
                
                
            };    
            },timeout); //每軸各自要等待的時間;    
                    
        
            resolve('')     
    })

   
};

export const symDropEnding =  async (symNode:any,timeout:number) => new Promise((resolve) =>  { 

        let selSymComponent:any = symNode.getComponent("symSetting_TA")
        
            selSymComponent._Animation.play('sym_DropEnd'); //掉落結束時播放回彈動畫
            selSymComponent.node.children[1].getChildByName('sym_Sprite').active = true; //開啟清楚版符號貼圖
            selSymComponent.node.children[1].getChildByName('sym_Sprite_blur').active = false;  //關閉模糊版符號貼圖
            selSymComponent._Animation.on(Animation.EventType.FINISHED, selSymComponent.symIdle, selSymComponent)  //動畫播完時呼叫要執行的事件(涵式)

        resolve('')     
})


/* 設置node 到map */

export async function setSymNodeToMap(index:number,symNode:any,timeout:number) {

    return new Promise(resolve => { 
        let mainCanvas:any = find('Canvas')!
        
        setTimeout(() => {
            setMapListtNode(index,mainCanvas.symList,symNode,0.1)


            resolve('')
        },timeout*1000)

    })
};

/* 開始落下 */

export const symDropStarting =  async (symNode:any,timeout:number) => new Promise((resolve) =>  { 

        let selSymComponent:any = symNode.getComponent("symSetting_TA")
        
        selSymComponent.node.children[1].getChildByName('sym_Sprite').active = false; //關閉清楚版符號貼圖
        selSymComponent.node.children[1].getChildByName('sym_Sprite_blur').active = true;  //開啟模糊版符號貼圖

        resolve('')     
})




/* chance card swap */

export const swapSymOperateB =  async (object:any,reelSize:number,swapList:any,eventID:number,timeout:number)   =>  { 
 
        let dt_preSym_reelClean = assetData.reelTimer.dt_preSym_reelClean
    
        let mainCanvas:any = find('Canvas')!
      
            for(let i:number =0 ; i < swapList.length ; i++ ){
                if(swapList[i]){

                    let selSymNode:any = mainCanvas.symList.get(i)
                    let symName:string = selSymNode.name

                    let pool = object.instancePool.get(symName);

                    pool.put(selSymNode)

                    //console.log("swapSymOperate______________22222",i,swapList[i],selSymNode,symName) 
                    await putSymToPoolB(object,selSymNode,dt_preSym_reelClean)

                    await setMapListtNode(i,mainCanvas.symList,null,0.01)

                   // resolve('')    
                }

            };
        


};



/* 設定所有主要符號透明度為255*/
export const allMainSymUIOpacity =  async (object:any,reelSize:number,swapList:any) =>  { 

    let reelRunTA:any = object.reelRunTA
        let tokensData:any = assetData.tokens
        let posArray:any = assetData.posArray
        let mainCanvas:any = find('Canvas')!
     
        for(let i:number =0 ; i < swapList.length ; i++ ){
            let c:number = Math.floor(i/reelSize)
            let r:number = i % reelSize
            let selSymToken:string = swapList[i]
            if( selSymToken != null) {


                let selSymName:string = tokensData.filter(e => e.token === selSymToken)[0].name


                let instancSym:any = await getSymFromPool(object,selSymName,0.02)

                instancSym.parent = reelRunTA.symLayer.children[reelRunTA.ColumnsID[r]]; //依座標位置決定父物件，以控制顯示排序      
     
                let selPosArray:any = new Vec3(posArray[c][r][0],posArray[c][r][1],posArray[c][r][2])

                instancSym.position = selPosArray;
                instancSym.getComponent(UIOpacity).opacity = 255;   

                await setMapListtNode(i,mainCanvas.symList,instancSym,0.02)
               


                let selMainSymLevel:number = Number(selSymToken.charAt(1))

                await modifySymLevelPic(instancSym,selMainSymLevel,0.02)// = async (symNode:any,symPicID, timeout:number)

        
            };
  
        };

        await symExchangeEffect(object,swapList,"in",1)



};







/* 檢查第二層符號揭露*/
export const checkSymbolExposed = async (object:any,reelSize:number,posX:number,posY:number, timeout:number) => { 

        let secSymbolCount:number = object.secSymbolExposedData.length //取得第二層符號數量
        let reelRunTA:any = object.reelRunTA
        let uiControllerTA:any = object.uiControllerTA
        let multipleSymbolList:any = assetData.multipleSymbol
        let floorSymbolData:any = assetData.floorSymbolData
        let selPosDimNumber:number = posY*reelSize+posX
        let mainCanvas:any = find('Canvas')!

        for(let i = 0; i < object.secSymbolExposedData.length; i++){
            let symName:any = object.secSymbolExposedData[i].symName

            let unexposedList = object.secSymbolExposedData[i].unexposedList;
            let selSymScore:number = object.secSymbolExposedData[i].score

            if(unexposedList.includes(selPosDimNumber)){
                let newUnexposedList:any = unexposedList.filter((e, i) => e !== selPosDimNumber);

                object.secSymbolExposedData[i].unexposedList = newUnexposedList;
                object.secSymbolExposedData[i].unexposedCount --

     
                if(symName != "HO" && object.secSymbolExposedData[i].unexposedCount == 1 ){
                
                    //聽牌事件

 
                    let mapPos:number = object.secSymbolExposedData[i].unexposedList[0] //posY * reelSize + posX; //計算角色在地板上的位置

                    let selFloorNode:any = mainCanvas.floorGridList.get(mapPos)


                    await selFloorShake(selFloorNode,0.2)

                }else if(object.secSymbolExposedData[i].unexposedCount == 0 && multipleSymbolList.includes(symName)){
                    //揭露事件
                    let selFloorSymSize:any = floorSymbolData.filter(e => e.token === symName)

                    let selFloorID:number = null
                    if(symName == "MW"){
                        selFloorID = selFloorSymSize.filter(e => e.token === symName)[0].floor_symID
                    }else{

                        selFloorID = selFloorSymSize.filter(e => e.score === selSymScore)[0].floor_symID
                    }
                    let selFloorSymNode:any = mainCanvas.secSymList.get(i)
                 
                    let IsDone = selFloorSymNode.getChildByName('posCtrl').children[0].getComponent(UIOpacity).opacity; //偵測倍數符號是否已啟動過
                    object.winTotalScore += selSymScore

                    if (IsDone >= 250) { //透明度高於250表示未作用過
                        await multiplySymAward(object,reelRunTA.floorSymNode[i],selFloorID,1)
                        await multiplySymAwardClose(object,selFloorID,2)
            
                    }
                }
    
            };
    
        };

    
};
       



/* 依照Level置換符號貼圖 */

export const modifySymLevelPic = async (symNode:any,symPicID, timeout:number)  => new Promise((resolve) =>  { 

    let selSymComponent:any = symNode.getComponent("symSetting_TA")
        if (symPicID>0 && symPicID<=8) { //防呆，貼圖索引只有1~8
            selSymComponent.node.children[1].getChildByName('sym_Sprite').getComponent(Sprite).spriteFrame = selSymComponent.symLevelPicN[symPicID-1]; //置換正常版貼圖，-1 輸入1時讀入索引0
            selSymComponent.node.children[1].getChildByName('sym_Sprite').children[0].getComponent(Sprite).spriteFrame = selSymComponent.symLevelPicN[symPicID-1]; //置換正常版貼圖，-1 輸入1時讀入索引0
            selSymComponent.node.children[1].getChildByName('sym_Sprite_blur').getComponent(Sprite).spriteFrame = selSymComponent.symLevelPicB[symPicID-1]; //置換模糊版貼圖，-1 輸入1時讀入索引0
        }else{
            console.error(`符號貼圖索引數值錯誤:${symPicID}，只接受1~8`);
        }
    resolve('')     
});



export const setMapListtNode = async (key:any,selList:any,selNode:any,timeout:number)  => new Promise((resolve) =>  { 

        selList.set(key,selNode)

   resolve('')     
});

