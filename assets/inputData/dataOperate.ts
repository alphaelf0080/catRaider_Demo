// data operate module
// 
//
//
//




import { Vec2, Vec3,find,resources,Prefab } from 'cc';
import {assetData} from '../inputData/asset_data';
import {} from './dataStructure';
//
//


const eventTarget = new EventTarget();



export async function convertInitialSymData (reelRunData:any,gameRound:number,step:number,timeout:number){ //補牌 各局初始盤面
    return new Promise(resolve => {
        setTimeout(() => {


            let selRoundData : any = reelRunData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾  //初始版本為 gameRound -1

            let tokensData :any = assetData.tokens

            let selGroundAllDate:any = []
            let initialTokensList:any = assetData.symArray  // from dataOperate.ts
            let initialTokenOneDimList:any = []
            let selFirstLayerInitialToken:any = []

            if(step == 0){
                 selFirstLayerInitialToken = selRoundData.initialReelSymData.tokens

            }else if(step >0 ){

                 selFirstLayerInitialToken = selRoundData.endDropEventData[step-1].acturallyDropSymList

            }
            
            let selSecLayerInitialToken = selRoundData.initialSecLayerSym

            let reelRow:number =selRoundData.currentReelSize 
            let reelColumn:number = selRoundData.currentReelSize
            let symIDList = []
            let tokenCordArray:any = []


            for(let i = 0 ; i < reelRow * reelColumn  ; i++){
                let c:number = Math.floor(i/reelRow)
                let r:number = i% reelColumn
                let SelTokenID:any = null

                if(selFirstLayerInitialToken[i] == null){
                    initialTokensList[r][c] = null
                    initialTokenOneDimList[i] = null
                }else{
                    SelTokenID = tokensData.filter(e => e.token == selFirstLayerInitialToken[i])[0].id
                    
                    initialTokensList[r][c] = SelTokenID
                    initialTokenOneDimList[i] = SelTokenID

                }
                symIDList.push(SelTokenID)
            }; 
            
 
            for(let i = 0 ; i < reelRow  ; i++){
               
                tokenCordArray[i]=[]
                    for(let j = 0 ; j < reelColumn  ; j++){
                        tokenCordArray[i].push(selFirstLayerInitialToken[i+j*reelColumn])
                    }

            }   
            
            selGroundAllDate = [initialTokensList,selSecLayerInitialToken,reelRow,reelColumn,selFirstLayerInitialToken,tokenCordArray,initialTokenOneDimList]

            resolve(selGroundAllDate)


        },timeout*1000)

    })
        
};




export const convertSymCordData_initial =  async (reelRunData:any,gameRound:number,step:number,timeout:number) =>{  //初始盤面座標資料轉換

    return new Promise(resolve => {
        setTimeout(() => {

            let reelData :any = assetData.reelData
            let tokensData :any = assetData.tokens
            let initialTokensList:any = assetData.symArray  // from dataOperate.ts

            let selGroundAllDate:any = []


            let initialGameKey : string = Object.keys(reelRunData)[0]
            let initialGameData : any  = reelRunData[initialGameKey].snapshots
            let initialReelData : any = initialGameData.filter(e => e.process_tag.key === "MAIN.L1.NORMAL.BEGIN.INIT")[0];   // 以物件ID過濾


            let initialGridLevel:string = initialReelData.process_tag.grid_level_tag
            let selReelData:any = reelData.filter(e => e.token === initialGridLevel)[0];   // 以物件ID過濾
            let initialReelSymTokens:any = initialReelData.first_layer.tokens 

            var reelRow:number = selReelData.row
            let selSecLayerInitialToken = initialReelData.second_layer

            var reelColumn:number = selReelData.column
            let tokenCordArray:any = assetData.symTokenArray
            let initialTokenOneDimList:any = []

            for(let i = 0 ; i < reelRow * reelColumn  ; i++){
                let c:number = Math.floor(i/reelRow)
                let r:number = i% reelColumn


                let SelTokenID:number = tokensData.filter(e => e.token === initialReelSymTokens[i])[0].id

                    initialTokensList[c][r] = SelTokenID
                    tokenCordArray[c][r] = initialReelSymTokens[i]
                    initialTokenOneDimList[i] = SelTokenID
            }; 
            selGroundAllDate = [initialTokensList,selSecLayerInitialToken,reelRow,reelColumn,initialReelSymTokens,tokenCordArray,initialTokenOneDimList]


            resolve(selGroundAllDate)


        },timeout*1000)

    })

        
};




export interface secSymbolExposedData{
    symName:string,
    secSymOneDimList:any[],
    unexposedCount:number,
    unexposedList:any[],    
    score:number 
};


export const convertSecFloorSymbolData = (object:any,reelRunData:any,gameRound:number) => new Promise((resolve) =>  { 

    console.log('convertSecFloorSymbolData_____22222',reelRunData,gameRound)

    let selRoundData : any = reelRunData.filter(e => e.roundCount === gameRound)[0];   // 以物件ID過濾

    let reelSize:number = selRoundData.currentReelSize //selReelData.row

    let selSecLayerInitialToken = selRoundData.initialSecLayerSym.data  //所有第二層符號資料

    let floorSymbolData:any = assetData.floorSymbolData 

    let secFloorSymCount:number = selSecLayerInitialToken.length
    let allSecFloorSymData:any = []
    let secSymbolExposedData:any = []
    
    let floorBlockedCheckList:any = selRoundData.initialReelSymData.blocked

  
    
    for(let i =0 ; i < secFloorSymCount ; i++){

        let selSecFloorSymTokenName:string = selSecLayerInitialToken[i].name
        let selSecFloorSymNumber:number = selSecLayerInitialToken[i].number  //第二層符號數字賠率

        let secFloorSymPos:any[] = [selSecLayerInitialToken[i].key_pos.r,selSecLayerInitialToken[i].key_pos.c ]  //第二層符號左下角座標位置[r,c]

        let selSecFloorSymData:any =   floorSymbolData.filter(e => e.token === selSecFloorSymTokenName)[0]

        let selSecFloorSymGrid:any = selSecFloorSymData.grid
        let selSecFloorSymID:number = selSecFloorSymData.floor_symID

        let originalPos:number = selSecLayerInitialToken[i].key_pos.r *reelSize +selSecLayerInitialToken[i].key_pos.c
       

        let selSecFloorSymGridCordList:any = []   //[c,r]
        let selSecFloorSymGriOneDimList:any = []   //[]

       
        for(let c:number = 0 ; c < selSecFloorSymGrid[0] ; c++){
            for(let r:number = 0 ; r < selSecFloorSymGrid[1] ; r++){
                selSecFloorSymGridCordList.push([secFloorSymPos[0]+r,secFloorSymPos[1]+c])

            }
            
        };

        for(let j:number = 0 ; j < selSecFloorSymGrid[0]*selSecFloorSymGrid[1] ; j++){
            let c:number = Math.floor(j/selSecFloorSymGrid[1])
            let r:number = j% selSecFloorSymGrid[1]

            let symPos:number = originalPos+r*reelSize + c
            selSecFloorSymGriOneDimList.push(symPos)            

        };

        allSecFloorSymData.push({"floorSymID":selSecFloorSymID,"symLeftLowerPos":secFloorSymPos,"symPos":selSecFloorSymGridCordList,"token":selSecFloorSymTokenName,"score":selSecFloorSymNumber})

        //  定義第二層符號的exposed
        let secSymOneDimList:any = selSecFloorSymGriOneDimList
        let secFloorSymExposedData:secSymbolExposedData = {
            "symName":selSecFloorSymTokenName,
            "secSymOneDimList":secSymOneDimList,
            "unexposedCount":0,    
            "unexposedList":[],
            "score":selSecFloorSymNumber 

        };

          
        if(floorBlockedCheckList!= null){
            for(let i = 0 ; i< floorBlockedCheckList.length ; i++){
                let selFloorState:boolean = floorBlockedCheckList[i]
                if(selFloorState == true && secSymOneDimList.includes(i) == true){

                    secFloorSymExposedData.unexposedList.push(i)

                };  //已揭露則紀錄
                
            };
            secFloorSymExposedData.unexposedCount = secFloorSymExposedData.unexposedList.length
        };
    
        secSymbolExposedData.push(secFloorSymExposedData)


    };

    object.secSymbolExposedData = secSymbolExposedData

    object.secFloorSymbolData = allSecFloorSymData 


    resolve(allSecFloorSymData) 
            
});

export const divAllProcessData = (object:any) => new Promise((resolve) => {  

    let selMoveProcessData:any = []
    let allStepSimData:any = []
    let selProcessStep:number = 0//-1
    let processStepDivTagList:any = assetData.processStepDivTagB//"INIT","DROP","TRIGGER_NEXT_LEVEL", "MOVE_DROP_END"
    let allEventTag:any = []
    let eventTagLength:number = object.process_tags.length
    let selProgressData:any = object.process_tags
    let selCatMovesData:any = object.cat_moves
    let selFirstLayerData:any = object.first_layers
    let selSecLayerData:any = object.second_layers
    let selStatesData:any = object.states
    let selChanceCardData:any = object.chance_cards
    let chanceCardEventList:Array<string> = []
    let selRatMovesData:any = object.rat_moves
    let selSecLayer:any = []
    let chanceCardEventIndex:any = assetData.chanceCardData    
    
    let traggerNewBonusList:any = object.process_tags.filter(e => e.event_tag === "TRIGGER_NEW_BONUS")
    let traggerNewBonusCount:number = traggerNewBonusList.length

    let currentFreeDropCount:number = 0
    for(let i = 0 ; i <traggerNewBonusCount ; i++){    //define bonus game free drop count
        let selTraggerNewBonusIdx:number = traggerNewBonusList[i].idx
        let currentEvent:string = object.events[selTraggerNewBonusIdx]
        let currentEventStateCollectedBonus:number = object.states.filter(e => e.event_id === currentEvent)[0].bonus
        let selPreEvent:string = object.events[selTraggerNewBonusIdx-1]
        let preEventStateCollectedBonus:number = object.states.filter(e => e.event_id === selPreEvent)[0].bonus
        let nextEvent:string = object.events[selTraggerNewBonusIdx+1]

        let nextEventData:any = object.process_tags.filter(e => e.event_id === nextEvent)[0]//.bonus
        let nextEventTag:string = nextEventData.event_tag
        
        if(preEventStateCollectedBonus == -1 && nextEventTag == "INIT"){
            currentFreeDropCount += 5
            nextEventData.freeDrops = currentFreeDropCount
        }else{
            currentFreeDropCount --
            nextEventData.freeDrops = currentFreeDropCount
        }
    
    }

    for(let i = 0 ; i <eventTagLength ; i++){
      
        let selProcessData:any = selProgressData[i]
   

        let selProcessEventTag :string = selProcessData.event_tag

        let selEventID:String = selProcessData.event_id   //當局 event id
        let selCatMoveData:any = selCatMovesData.filter(e => e.event_id === selEventID)//[0] //cat movie data with event_id
        let selFirstLayer:any = selFirstLayerData.filter(e => e.event_id === selEventID)
        if(selSecLayerData.filter(e => e.event_id === selEventID).length != 0){
            selSecLayer = selSecLayerData.filter(e => e.event_id === selEventID)

        }
   
        let selStateData:any = selStatesData.filter(e => e.event_id === selEventID)[0]//[0] //cat movie data with event_id
        let selChanceCard:any = selChanceCardData.filter(e => e.event_id === selEventID)
        let selRatMove:any = selRatMovesData.filter(e => e.event_id === selEventID)
        let selFreeDropCount:number = null;
        
        if(selProcessData.freeDrops){

            selFreeDropCount=  selProcessData.freeDrops   
        }

        var selEventAllData:any = {
            "event_id" : selEventID ,  
            "event_tag" : selProcessEventTag, 
            "process_tags" : selProcessData,          
            "cat_moves": selCatMoveData ,
            "first_layers" : selFirstLayer ,
            "second_layers" : selSecLayer ,
            "states" : selStateData , 
            "chance_cards": selChanceCard ,
            "rat_moves" : selRatMove,
            "freeDropsCount":selFreeDropCount
            };
        
        allEventTag.push(selProcessEventTag) //add all eventTag
        if(processStepDivTagList.includes(selProcessEventTag) == false){ //cat Move Process

            selMoveProcessData.push(selEventAllData)

        }

        if( processStepDivTagList.includes(selProcessEventTag) ) {
            

            allStepSimData[selProcessStep] = selMoveProcessData
            selMoveProcessData = [selEventAllData]
            selProcessStep += 1

        }
    
    

            

    } 

    for(let i = 0 ; i <selChanceCardData.length ; i++){
        let selChanceCardName:string = selChanceCardData[i].chance_card_name
        let chanceCardIndex:number = chanceCardEventIndex.filter(e => e.chanceCardName === selChanceCardName)[0].eventIndex   //取得該卡片在事件列表中的index
        let chanceCardRefData:any= {"chanceCardName":selChanceCardName,
                                    "event_id":selChanceCardData[i].event_id,
                                    "eventIndex":chanceCardIndex
                                    }
        chanceCardEventList.push(chanceCardRefData)
    };
    if(chanceCardEventList.length == 0){
            let chanceCardRefData:any ={
            "chanceCardName":"none",
                                "event_id":0,
                                "eventIndex":Math.floor(Math.random() * 2)
        }
        chanceCardEventList.push(chanceCardRefData)


    }
    resolve([allStepSimData,chanceCardEventList])
});


export interface awardGroupFormat {
    stepIndex:number,
    divTag:string,
    initialFirstLayer:any,
    initialEventIDX:number,
    initialEventTag:string,
    currentLevel:string,
    initialSecondLayer:any,
    initialRatMoves:any,
    colorAward:any,     
    freeDropCount:number,
};


export interface selEndEventDataFormat{
    selEndFirstLayerTokens :any,
    selEndFirstLayerCord :any,
    selEndReelSize:string,
    selEndEventIDX:number,
    selEndEventTag:string,
    selDropFirstLayer:any,
    acturallyDropSymList:any,        
    };


export interface selRoundDataFormat{
    roundCount:number,
    initTag:string,
    lineAward:any,
    //ratAward:any,
    dropFirstLayer:any,
    endDropEventData:any,
    initialReelSymData:any,
    initialEventProcessIDX:number,
    initialEventProcessTag:string,
    currentMajorTag:string,
    lastMajorTag:string,
    currentModeTag:string,
    lastModeTag:string,
    initialSecLayerSym:any,
    //floorExposedData:any,
    currentReelLevel:string,
    currentReelSize:number,
    chanceCardName:string,
    freeDropsCount:number,
};

export interface colorAwardFormat {   //define awardData format  以貓移動顏色 分中獎資料
    // index:number,     
     event_tag:string,
     colorSymID:number,
     idx:number,
     moveRoundIDX:number,
     symPos:any,
     tokens:any,
     scores:any,
     energy:number,
    // freeDropCount:number
 };

export const getAwardGroupData= async (object:any,divProcessSimData:any) => { 

  
    let divStepCount = divProcessSimData.length 

    let allAwardRound :any = []
    let allRoundData:any = [] //最終回傳結果
    let roundCount:number = 0

    let newRoundEventTag:any = assetData.newRoundEventTagB

   
    for(let i = 1 ; i<divStepCount ; i++){  
        let selDivStepData:any = divProcessSimData[i]//.event_tag
        let selProcessStepEventTag:string = null 

        let selInitialEventData:any  = selDivStepData[0]
        let selInitialEventIDX:number= selInitialEventData.process_tags.idx
        let selInitialEventTag:string = selInitialEventData.process_tags.event_tag
        let awardGroupData:awardGroupFormat = {   //define awardData format  以回合數分中獎資料
                                    "stepIndex":i,
                                    "divTag":selInitialEventTag,//selDivStepData[0].process_tag.event_tag,
                                    "initialFirstLayer":selDivStepData[0].first_layers,
                                    "initialEventIDX":selInitialEventIDX,
                                    "initialEventTag":selInitialEventTag,
                                    "currentLevel":selDivStepData[0].process_tags.grid_level_tag,
                                    "initialSecondLayer":selDivStepData[0].second_layers,   
                                    "initialRatMoves":await defineRatAward(selDivStepData,0.01), //selDivStepData[0].rat_moves,
                                    "colorAward": await defineSelLineAward(selDivStepData,0.01),   // selLineAward
                                    "freeDropCount":selInitialEventData.freeDropsCount
                                    
                                };
    
        allAwardRound.push(awardGroupData)

    };


    for(let i = 0 ; i<allAwardRound.length ; i++){

        let selAwardData:any = allAwardRound[i]
        let divTag:string = selAwardData.divTag
        let initialReelSymData :any = selAwardData.initialFirstLayer[0]
        let initialRatMoves:any = selAwardData.initialRatMoves
        await defineMoveRoundData(selAwardData)
        let selEndEventData:any = await defineSelEndEventData(object,i,selAwardData,allRoundData,0.01)
        if( newRoundEventTag.includes(divTag) ){ 
            var dropFirstLayer:any = []
            var endDropEventData:any = []
            var lineAwardList:any = []    //一個lineAward代表一回合的連線資訊，一個colorAward代表一種顏色符號的連線位置資訊，可new多組lineAward及colorAward
            var selRatAwardData:any = []
            let selRoundData:any = await defineSelRoundData(object,selAwardData,roundCount,0.01) 

            if(selRoundData){
                selRoundData.dropFirstLayer = dropFirstLayer
                selRoundData.endDropEventData = endDropEventData
                selRoundData.initialReelSymData = initialReelSymData
                selRoundData.lineAward = lineAwardList
                selRoundData.ratAward = selRatAwardData
                selRoundData.freeDropsCount = selAwardData.freeDropCount

                allRoundData.push(selRoundData)
    
    
            };

            roundCount += 1

    
        };


        let selColorAwardData:any = selAwardData.colorAward

        if(selColorAwardData.length >0){

            let colorAward:any = await defineColorAwardData(i,selColorAwardData,0.01)
            lineAwardList.push(colorAward)

        };


        if(divTag == "FILL" || divTag == "MOVE_DROP_END"){
       
            dropFirstLayer.push(initialReelSymData)
            endDropEventData.push(selEndEventData)


        };

        if(selAwardData.initialRatMoves.length >0){

            selRatAwardData.push(initialRatMoves)   
        };
   
    }

    return allRoundData
    

};


export const defineRatAward = (stepAwardData:any,timeout:number) => new Promise((resolve) =>  { 
    let bonusRatMoveTag:any = assetData.bonusRatMoveTag
    let selRatProcessStepData:any = null //selDivStepData[j]
    let selProcessRatAction:any = [] //selProcessStepData.cat_moves
    setTimeout(() => {
        if( stepAwardData.length){   //確認非空[]
            for(let j = 0 ; j<stepAwardData.length ; j++ ){
                if(stepAwardData[j]){
                    selRatProcessStepData = stepAwardData[j]

                    let selEventTag:string = selRatProcessStepData.event_tag
                    let selEventIDX:number = selRatProcessStepData.process_tags.idx
                    if(bonusRatMoveTag.includes(selEventTag)){

                        selProcessRatAction.push({"idx":selEventIDX,"eventTag":selEventTag,"eventID":selRatProcessStepData.event_id,"ratMoves":selRatProcessStepData.rat_moves[0]})


                    }

                
                };
            };
        };
    resolve(selProcessRatAction)
  

    },timeout*1000)
    
});



export const defineSelLineAward=  async (stepAwardData:any,timeout:number) => new Promise((resolve) =>  {  //stepAwardData 各回合資料  
    
    let newStepEventTag:any = assetData.newStepEventTagB
    let catMoveProcessTagData:any = assetData.catMoveProcessTagKeyB
    let catMoveEventTagList:any = Object.keys(catMoveProcessTagData)
    let selLineAward:any = []
   

    setTimeout(() => {

        if( stepAwardData.length){   //確認非空[]
            for(let j = 0 ; j<stepAwardData.length ; j++ ){
                let selProcessStepData:any = null //selDivStepData[j]
                let selProcessStepEventTag:string = null //selProcessStepData.process_tags.event_tag
                let selProcessStepIDX:number = null //selProcessStepData.process_tags.idx
                let selProcessMoves:any = null //selProcessStepData.cat_moves
                let selEventID:"string" = null
                let selFreeDropCount:number = null;
                if(stepAwardData[j]){

                    selProcessStepData = stepAwardData[j]
                    selProcessStepEventTag = selProcessStepData.process_tags.event_tag
                    selEventID = selProcessStepData.process_tags.event_id
                    selProcessStepIDX = selProcessStepData.process_tags.idx
                    selProcessMoves = selProcessStepData.cat_moves
                };
                let firstLayerData:any = []  //取得初始盤面與補牌資料

                if(newStepEventTag.includes(selProcessStepEventTag)){

                    firstLayerData = selProcessStepData.first_layers

                }else{

                    firstLayerData = null
                };

                if(catMoveEventTagList.includes(selProcessStepEventTag)){
                    let catMovePosData:any = selProcessStepData.cat_moves.filter(e => e.event_id === selEventID)[0]
                    let statesData:any = selProcessStepData.states//.filter(e => e.event_id === selEventID)[0]
                    let catMovePosList:any = catMovePosData.pos
                    let catMovePosToken:any = catMovePosData.tokens
                    let catMoveScoresList :any = catMovePosData.scores
                    let catMoveEnergy:any = statesData.energy
                    let convertPosRV:any = convertPosData(catMovePosList)  
                    let catMoveRoundIDX:number = catMovePosData.moveRoundIDX
                    let selColorID:number = catMoveProcessTagData[selProcessStepEventTag];   // 以物件ID過濾
                    if(catMovePosData){

                 
                        let selcolorAward:colorAwardFormat = {   //define awardData format  以貓移動顏色 分中獎資料

  
                                                "event_tag":selProcessStepEventTag,
                                                "colorSymID":selColorID,
                                                "idx":selProcessStepIDX,
                                                "moveRoundIDX":catMoveRoundIDX,
                                                "symPos":convertPosRV,
                                                "tokens":catMovePosToken,
                                                "scores":catMoveScoresList,
                                                "energy":catMoveEnergy,
                                                //"freeDropCount":  selFreeDropCount

                                                };
                            selLineAward.push(selcolorAward)  

                           
                    }else{

                    }
                    
                }
            };
        
        };
    
        resolve(selLineAward)
        
    },timeout*1000)
    
});


export const defineMoveRoundData=  async (selAwardData:any) => new Promise((resolve) =>  {   //加入同回合移動標記ID

    if(selAwardData.colorAward.length >0){
        let moveRoundIDX:number = selAwardData.colorAward[0].idx

        for(let i = 0 ; i<selAwardData.colorAward.length ; i++){

            selAwardData.colorAward[i].moveRoundIDX = moveRoundIDX
         
        };

        if(selAwardData.initialRatMoves.length >0){
            for(let i = 0 ; i<selAwardData.initialRatMoves.length ; i++){

                selAwardData.initialRatMoves[i].moveRoundIDX = moveRoundIDX
             
            };

        }   
    };


    resolve('')


});



export const defineSelEndEventData=  async (object:any,stepCount:number,selAwardData:any,allRoundData:any,timeout:number) => new Promise((resolve) =>  { 
    
        let selSimDataBuffer:any = object

        let reelData :any = assetData.reelData
        let initialEventProcessIDX:number =  selAwardData.initialEventIDX  //取得初始事件索引
        let selEndProcessTag:any =  selSimDataBuffer.process_tags.filter(e => e.idx === 0)[0]

        let selEndFirstLayerData:any = null  //取得最終結果的第一層盤面資料
        let selReelData:any = reelData.filter(e => e.token === "L1")[0]   

        let selEndReelSize:string = "L1"
        let selEndEventIDX:number = 0
        let selEndEventTag:string = "NA"
        let symTokens:any = assetData.tokens; //
        let exceptSymList:any = ["null_symbol" , "character" ,"empty","bonus_character"]
        let moveAbleSymTypeList:any = ["mainSymbol","featureSymbol","wildSymbol"]
        let unFillSymbolType:any = assetData.unFillSymbolType
        
    

        
        for(let j:number = initialEventProcessIDX-5 ; j < initialEventProcessIDX ; j++){

            let selTryEventData:any = selSimDataBuffer.process_tags.filter(e => e.idx === (j))[0]
            if(selTryEventData){
                let selTryEventID:string = selTryEventData.event_id    
                let selTryEventFirstLayer:any = selSimDataBuffer.first_layers.filter(e => e.event_id === selTryEventID)[0]
                
                if(selTryEventFirstLayer){
                    selEndProcessTag = selSimDataBuffer.process_tags.filter(e => e.event_id === selTryEventID)[0]
                    selEndFirstLayerData = selTryEventFirstLayer
                }
            };
        };

      
        let selEndFirstLayerCord:any =[] //assetData.symArray

        if(selEndFirstLayerData){

            let selReelTokensCount:number = selEndFirstLayerData.tokens.length
            let selReelSize:number = selEndFirstLayerData.size
    
            for( let j:number = 0 ; j<selReelTokensCount; j++){

                let r:number = Math.floor(j/selReelSize)
                let c:number = j% selReelSize
           
                if( r == 0){selEndFirstLayerCord.push([])}
                
                selEndFirstLayerCord[c].push(selEndFirstLayerData.tokens[j])  

    
            };
        };


        //處理符號向前補空位 START //
        let selEndSymFillCord:any = []   // 已向前補完空位，但未掉落補牌的盤面資料，
        let selEndFirstLayerCordRowCount:number = selEndFirstLayerCord.length


        for(let r=0 ; r < selEndFirstLayerCordRowCount ; r++){
            let availableGridCount:number = 0
            let fillSymReel_Row = selEndFirstLayerCord[r]
            let moveToGridList:any=[]

            if(fillSymReel_Row){
                let checkTokenFillList:any = []
                let sumMoveGrid:number = 0
                let availableMoveGrid:any = []  //element index 可移動格子排序 ,number 可移動位置
                
                for(let j:number = 0 ; j<fillSymReel_Row.length ; j++){

                    moveToGridList.push("E_")

                };
                for(let j:number = 0 ; j<fillSymReel_Row.length ; j++){ //判斷符號是否向下墜落補空格 //角色不動
                    let selToken:string =  fillSymReel_Row[j]

                    let selTokenType:string = symTokens.filter(e => e.token === selToken)[0].type
                    let rCount:number = j+1 //所在的r位置,1開始
                    if(selTokenType == "empty"){
                        availableMoveGrid.push(j)
                    };

                    if(exceptSymList.includes(selTokenType) == false){

                        sumMoveGrid += 1
                    };
                    if(moveAbleSymTypeList.includes(selTokenType)){ //["mainSymbol","featureSymbol"]
                        let moveStep:number = rCount-sumMoveGrid //可移動格數

                        if(moveStep ==0){
                            moveToGridList[j] = selToken

                        }else if(moveStep >=0){

                            availableMoveGrid.push(j)

                            if(availableMoveGrid[availableGridCount]>=0){

                                moveToGridList[availableMoveGrid[availableGridCount]] = selToken

                                availableGridCount += 1

                            };
                        }
                    }else if(unFillSymbolType.includes(selTokenType)){
                            moveToGridList[j] = selToken
                    };       
                };
            };

            selEndSymFillCord.push(moveToGridList)  // 
        };

        //處理符號向前補空位 END //


        let selEndSymFillCord_OneDim:any = []
        let initialReelSymData :any = selAwardData.initialFirstLayer[0]
        for(let c:number=0; c<selEndSymFillCord.length; c++){
            for(let r:number=0 ; r<selEndSymFillCord[c].length; r++){
                let selToken:string = selEndSymFillCord[r][c]
                selEndSymFillCord_OneDim.push(selToken)

            }


        };

        //處理實際會掉落符號，去除有符號存在
        let acturallyDropSymList:any = []
        for(let j:number= 0 ; j< selEndSymFillCord_OneDim.length ; j++){


            if(selEndSymFillCord_OneDim[j] != "E_"){
                acturallyDropSymList.push(null)    

            }else{
                acturallyDropSymList.push(initialReelSymData.tokens[j])    
            };           
        };


         selEndReelSize = selEndProcessTag.grid_level_tag

        let selEndEventData:selEndEventDataFormat = {
            "selEndFirstLayerTokens":selEndFirstLayerData,
            "selEndFirstLayerCord":selEndSymFillCord,
            "selEndReelSize":selEndReelSize,
            "selEndEventIDX":selEndEventIDX,
            "selEndEventTag":selEndEventTag,
            "selDropFirstLayer":initialReelSymData,
            "acturallyDropSymList":acturallyDropSymList
        }
      
        resolve(selEndEventData)

});


export const defineSelRoundData=  async (object:any,selAwardData:any,roundCount:number,timeout:number) => new Promise((resolve) =>  { 

    let divTag:string = selAwardData.divTag
    let lineAwardList:any = []    //一個lineAward代表一回合的連線資訊，一個colorAward代表一種顏色符號的連線位置資訊，可new多組lineAward及colorAward
    let dropFirstLayer:any = []
    let endDropEventData:any = []
    let chanceCardName:string = null
    let initialReelSymData :any = selAwardData.initialFirstLayer[0]
    let initialEventProcessIDX:number =  selAwardData.initialEventIDX  //取得初始事件索引
    let lastEventProcessIDX:number = initialEventProcessIDX -1      //取得前一回合的事件索引

    let selProcessTag:any = object.process_tags.filter(e => e.idx === (initialEventProcessIDX))[0]
    let lastProcessTag: any = object.process_tags.filter(e => e.idx === (lastEventProcessIDX))[0]
    let initialSecLayerSym :any = selAwardData.initialSecondLayer[0]
    let currentReelLevel:string = selAwardData.currentLevel
    let selProcessEventID:string = selProcessTag.event_id
    let MajorTag:string = selProcessTag.major_tag
    let ModeTag:string = selProcessTag.mode_tag
    let lastMajorTag:string = lastProcessTag.major_tag
    let lastModeTag:string = lastProcessTag.mode_tag

    let gridLevelIndex:any = assetData.gridLevelIndex

        var selRoundData:selRoundDataFormat={
            "roundCount":roundCount,
            "initTag":divTag,
            "lineAward":lineAwardList,
            //"ratAward":selRatAward,
            "dropFirstLayer":dropFirstLayer,
            "endDropEventData":endDropEventData,
            "initialReelSymData":initialReelSymData,
            "initialEventProcessIDX":initialEventProcessIDX,
            "initialEventProcessTag":selProcessEventID,
            "currentMajorTag":MajorTag,
            "lastMajorTag":lastMajorTag,
            "currentModeTag":ModeTag,
            "lastModeTag":lastModeTag,
            "initialSecLayerSym":initialSecLayerSym,
            //"floorExposedData":"",
            "currentReelLevel":currentReelLevel,
            "currentReelSize":gridLevelIndex.filter(e => e.token ===currentReelLevel )[0].reelRSize,
            "chanceCardName": chanceCardName,
            "freeDropsCount":0
        };

    resolve(selRoundData)


});


export const defineColorAwardData=  async (stepCount:number,selColorAwardData:any,timeout:number) => new Promise((resolve) =>  {


    let colorAwardCount:number = selColorAwardData.length
    let colorAward:any = []
  
    for(let j =0 ; j<colorAwardCount ; j++ ){

        let colorSymID:number = selColorAwardData[j].colorSymID
        let symPos:any = selColorAwardData[j].symPos
        let tokens:any = selColorAwardData[j].tokens
        let catScoreList :any = selColorAwardData[j].scores
        let catEnergy :any = selColorAwardData[j].energy
        let eventIDX:number = selColorAwardData[j].idx
        let moveRoundIDX:number = selColorAwardData[j].moveRoundIDX

        let catScore:any = convertTokenToScore(tokens,catScoreList)

        colorAward.push({"step":stepCount,"colorSymID":colorSymID,"idx":eventIDX,"moveRoundIDX":moveRoundIDX,"symPos":symPos,"tokens":tokens,"catScore":catScore,"scores":catScoreList,"energy":catEnergy})
        
    };
    

    resolve(colorAward)
});





export const defineLineEvent =  async (object:any,divAllRoundData:any) => new Promise((resolve) =>  { 

    let lineEventTag:any = assetData.lineEventTag
    let lineEventTagKeyList:any = Object.keys(lineEventTag)

    for(let i:number = 0 ; i<divAllRoundData.length ; i++){

        let currentEventTag:string = divAllRoundData[i].initTag

        let initialEventProcessTag:string =divAllRoundData[i].initialEventProcessTag 
        let chanceCardData:any = object.chance_cards.filter(e => e.event_id == initialEventProcessTag )//.chance_card_name
        if(chanceCardData.length != 0){
            divAllRoundData[i].chanceCardName = chanceCardData[0].chance_card_name

        }
     
        if(lineEventTagKeyList.includes(currentEventTag)){

            divAllRoundData[i].readyForLevelUpData = true
            divAllRoundData[i].lineEvent = lineEventTag[currentEventTag]//'sceneLevelUp' chanceCardName

        }else{
            divAllRoundData[i].lineEvent = "none"
           

        }
    }

    resolve(divAllRoundData)
 
 });
 



export const defineSecSymbolEvent =  async (object:any,divLineEventData:any) => {
    

    let roundCount:number = divLineEventData.length

    for(let i:number = 0 ; i<roundCount ; i++){
        let secSymData:any = divLineEventData[i].initialSecLayerSym.data
        if( secSymData.length >0){
            for(let j:number = 0 ; j<secSymData.length ; j++){

                let currentSelSymData:any = secSymData[j]
                            

            };
        };
    };
};


export const defineSecSymbolPos =  async (first_layersData:any,selSecSymData:any,currentReelSize:number,initialEventProcessTag:string) => new Promise((resolve) =>  {  



        let currentEventFirstLayer:any = first_layersData.filter(e => e.event_id == initialEventProcessTag )[0]
        let floorBlockedCheckList:Array<boolean> = null
        if(currentEventFirstLayer){
            floorBlockedCheckList = currentEventFirstLayer.blocked
        }

        let symLeftLowerPos:any = selSecSymData.key_pos
        let symSize:number = selSecSymData.size
        let secSymCordList:any = []
        let secSymOneDimList:any= []  //第二層符號覆蓋地板的一維座標
        let floorCheckList:any = []    //目前已揭露的地板一維座標

        for(let i = 0 ; i< symSize * symSize ; i++){

            let c:number = Math.floor(i/symSize)
            let r:number = i % symSize
            let posX:number = symLeftLowerPos.r+r
            let posY:number = symLeftLowerPos.c+c
            let symPos:Array<number> = [posX,posY]
            secSymCordList.push(symPos)
            secSymOneDimList.push(posY*currentReelSize+posX)
    
        };

   
        selSecSymData.secSymOneDimList = secSymOneDimList

    resolve(floorCheckList)
 
});

export const defineSecSymFloorUnexposed =  async (currentSelSymData:any,currentExposedFloorList:any) => new Promise((resolve) =>  {  

    let secSymOneDimList:any= currentSelSymData.secSymOneDimList  //第二層符號覆蓋地板的一維座標
    let secSymUnExposeList :Array<number> = []  //第二層符號未揭露的地板一維座標
    
    for(let i = 0 ; i< secSymOneDimList.length ; i++){

        if(currentExposedFloorList.includes(secSymOneDimList[i])!=true){

            secSymUnExposeList.push(secSymOneDimList[i])
        }
    };

    resolve(secSymUnExposeList)
 
});


export const defineBonusGame =  async (object:any) => new Promise((resolve) =>  {
    

    let bounsTagRoundData:any  = object.filter(e => e.initTag == "TRIGGER_NEW_BONUS")
    let bonusFreeDropCount:number = bounsTagRoundData.length
    


    for (let i = 0; i < bonusFreeDropCount; i++) {
        let selRoundData:any = bounsTagRoundData[i]
        let selRoundCount:number = selRoundData.roundCount
        let nextRountCount:number = selRoundCount + 1
        let nextRountData:any = object.filter(e => e.roundCount == nextRountCount)[0]
        let nextRountIntTag:string = nextRountData.initTag
        nextRountData.bonusCount = bonusFreeDropCount -i

    }

    resolve(object)
});




export const findSymLevelUpData = (selRoundData:any,selStepRoundData:any,gameRound:number,stepRound:any) => { 

    let colorAwardCount:number = selStepRoundData.length       //  get color award count from color award data.

    for(let i:number = 0 ; i < colorAwardCount ; i++){
        
        let colorAwardData:any = selStepRoundData[i]
        let colorAwardTokensList:any = colorAwardData.tokens

        if(colorAwardTokensList.includes("Lu")){



        };
     

    }





};


export const convertLineAwardData =  async (object:any) => {

    let simGameData:any = await divAllProcessData(object);

    let divProcessSimData:any = simGameData[0];
    let chanceCardRefData:any = simGameData[1];

    let allRoundData:any = await getAwardGroupData(object,divProcessSimData)  //object from demoreelTA

    let divLineEventData:any = await defineLineEvent(object,allRoundData);

    let allProceedData:any = await defineSecSymbolEvent(object,divLineEventData)

    let defineBonusGameData = await defineBonusGame(allRoundData)

    //console.log('convertLineAwardData_______A11111',simGameData,allProceedData,divProcessSimData,allRoundData,divLineEventData,chanceCardRefData)

    return [allRoundData,chanceCardRefData]


};


export const  convertPosData = (object:any) =>{ 

    let posDataList:any = object
    let posConvertList:any = []
    
    for(let i = 0 ; i< posDataList.length ; i++ ){
        let r:number = posDataList[i].r
        let c:number = posDataList[i].c
        posConvertList.push([c,r])

    };

    return posConvertList
    
};





export const convertTokenToScore = (tokens:any,catScoreList:any) =>{ 
    
    let tokenScoreList:any = []
    let scoreSum:number = 0

    for(let i = 0 ; i<catScoreList.length ; i++){

        let selTokenScore:number = catScoreList[i]//tokens[i]
        scoreSum += selTokenScore
        tokenScoreList.push(scoreSum.toFixed(2))
    }


    return tokenScoreList

};






export const convertChanceSwapTokens =async (preRondData:any,currentRoundData:any) => new Promise((resolve) =>  {

    let lastEndFirstLayerToken:Array<string>  = preRondData.endDropEventData[preRondData.endDropEventData.length -1].selEndFirstLayerTokens.tokens//.selEndFirstLayerTokens.tokens
    let initialFirstLayerToken:Array<string> = currentRoundData.initialReelSymData.tokens
    let currentLevelSize:number = currentRoundData.currentReelSize
    let reelTokenCount:number = currentLevelSize * currentLevelSize
    let chanceEffectsData:any = assetData.chanceEffects
    let chanceSwapData = assetData.swapSymbolType

    let mode:string = currentRoundData.chanceCardName

    let swapSymbolType:any = chanceSwapData.filter(e => e.mode === mode)[0].swapSymbolType
    let chanceCardName:string = currentRoundData.chanceCardName
    let tokensData:any = assetData.tokens
    let chanceCaedID:number = chanceEffectsData.filter(e => e.chanceCardName === chanceCardName)[0].effect_ID
    let swapSymList:Array<string> = []
    let swapTokenCoord:Array<string[]>  = assetData.symTokenArray


    for(let i:number =0 ; i < reelTokenCount ; i++ ){

        let elementA:string = lastEndFirstLayerToken[i]
        let elementB:string = initialFirstLayerToken[i]
        let elementA_type:string = tokensData.filter(e => e.token === elementA)[0].type
        let r:number = Math.floor(i/currentLevelSize)
        let c:number = i % currentLevelSize


        if(elementA == elementB && swapSymbolType.includes(elementA_type) ){
            swapSymList.push(null)
            swapTokenCoord[c][r] = null
        }else{
            swapSymList.push(elementB)
            swapTokenCoord[c][r] = elementB

        };
    };


    let ChanceCardEventData:any = [swapTokenCoord,chanceCardName,chanceCaedID,swapSymList]
    
    resolve(ChanceCardEventData)
});



//獲取後端JSON資料 start //

export const getGameSimeJson=  async (url:string,jsonFile:string,isFix:boolean,fixID:number) => new Promise((resolve) =>  { 

    fetch(url,{
    method:'POST',

    body: JSON.stringify( {
        'fixGameSimData' : isFix,
        'fixID' :fixID,
        'jsonFile':jsonFile
    }),

    }).then(response=>{
        
        return response.json()
    }).then((value) => {
        
        resolve(value)
    })



});






export const requestJsonData =  async (object:any,jsonFile:string,mode:string,isFix:boolean,fixID:any) => {

    let host:string = "http://127.0.0.1:7456/" 

    //let host:string = "http://192.168.151.106:8080/"
        //console.log('requestJsonData_______________016',object,mode,isFix,fixID)




    if( mode == "assetData"){
        let url:string = host + "assetData"
        let postJsonData:any = await getGameSimeJson(url,jsonFile,isFix,fixID)

        return postJsonData

    }else if( mode == "initData" ){
        let url:string = host + "playInitialData"
        let postJsonData:any = await getGameSimeJson(url,jsonFile,isFix,fixID)
         
        return postJsonData

    }else if( mode == "selPlayData" ){
        let url:string = host + "selPlayData"
        let postJsonData:any = await getGameSimeJson(url,jsonFile,isFix,fixID)


        return postJsonData

    }else if(mode = "convertData"){
        let url:string = host + "convertGameData"
        let postJsonData:any = await getGameSimeJson(url,jsonFile,isFix,fixID)

        console.log('postJsonData_____________C00000',postJsonData)

    };
  
//獲取後端JSON資料 end //


};





export const loadSymbalDataResource =async (resourcesPool:any,timeout:number) => new Promise((resolve) =>  {
        let resourcesLoadSymType:any = assetData.resourcesLoadSymType
        let symbolData = assetData.symbolData

        //載入主要符號資源 角色符號 特殊符號
        for(let i = 0; i < symbolData.length; ++i){
            let symName:string = symbolData[i].name;
            let symType:string = symbolData[i].type;
            if(resourcesLoadSymType.includes(symType)){
                let url:string =  symbolData[i].url + "/"+ symName

                resources.load(url, Prefab, (err, prefab) => {
                    resourcesPool.set(symName,prefab)

                });
            }
        };

    resolve('')

})


export const loadResource =async (dataList:any,resourcesPool:any,timeout:number) => new Promise((resolve) =>  {

       //載入地板下符號資源
        for(let i = 0; i < dataList.length; ++i){
            let symName:string = dataList[i].name;
            let url:string =  dataList[i].url + "/"+ symName

            resources.load(url, Prefab, (err, prefab) => {
                resourcesPool.set(symName,prefab)

            });
        };

        resolve('')
})



export const loadAllResourceData = async (object:any,timeout:number) => {
    let floorSymbolData = assetData.floorSymbolData
    let floorGridData = assetData.floorGrid
    let fxResources = assetData.fxResources


    let resourcesPool:any = object.symbolPool

    await loadResource(fxResources,resourcesPool,2)

    await loadSymbalDataResource(resourcesPool,2)

    await loadResource(floorSymbolData,resourcesPool,0.5)

    await loadResource(floorGridData,resourcesPool,1)




};

