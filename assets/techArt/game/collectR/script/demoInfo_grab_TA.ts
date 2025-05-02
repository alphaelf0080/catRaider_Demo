import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

//* Demo腳本資料內容 *//
// 局：一局指按下1次Spin或清空盤面後再生成的全新盤面(如場景升級(盤面擴張))，一局含多次連鎖回合
// 回合：一回合 = 一次掉落的新盤面或補牌

//建立每局盤面符號類型
export class slotNumber {
    public symID: number[][]; //2維陣列順序代表符號位置，輸入的數字代表符號ID
    constructor(winPos: number[][]) {
        this.symID = [...winPos];
    }
    public destroy(): void {
        this.symID = [];
    }
}

//連線的獎項子層
export class colorAward {
    public colorSymID: number; //連線符號[ID](顏色)，判斷由哪隻角色表演連線
    public symPos: number[][]; //中獎的位置[順序及ID]
    constructor(colorSymID: number, winPos: number[][]) {
        this.colorSymID = colorSymID;
        this.symPos = [...winPos];
    }
    public destroy(): void {
        this.colorSymID = null;
        this.symPos = [];
    }
}

//連線的獎項子層-機會卡事件
export class chanceAward {
    public chanceEvent: string; //機會卡事件名稱('reflash'重置, 'wildEvent'隨機百搭, 'exchange'對調)
    constructor(chanceEvent: string) {
        this.chanceEvent = chanceEvent;
    }
    public destroy(): void {
        this.chanceEvent = null;
    }
}

//連線的獎項子層-地鼠符號
export class mouseSym {
    public action: string; //行動名稱('comeIn'生成, 'suckIn'吸收符號)
    public nextPos: number[] = [];//吸收完移動到下個位置的ID
    constructor(action: string, nextPos: number[]) {
        this.action = action;
        this.nextPos = nextPos;
    }
    public destroy(): void {
        this.action = null;
        this.nextPos = null;
    }
}

//連線的獎項母層
export class lineAward {
    public colorAward: colorAward[] = [];//牌型資料
    public mouseSym: mouseSym = null; //地鼠符號行動資訊
    public chanceAward: chanceAward[] = [];//機會卡事件資料
    constructor(colorAward: colorAward[], mouseSym: mouseSym, chanceAward: chanceAward[]) {
        this.colorAward = colorAward;
        this.mouseSym = mouseSym;
        this.chanceAward = chanceAward;
    }

    public destroy(): void {
        this.colorAward = [];
        this.mouseSym = null;
        this.chanceAward = [];
    }
}

//地板符號子層
export class floorSymSub {
    public floorSymID: number; //地板下符號[ID]
    public symPos: number[][]; //中獎的位置[順序及ID]
    constructor(floorSymID: number, floorSymPos: number[][]) {
        this.floorSymID = floorSymID;
        this.symPos = [...floorSymPos];
    }
    public destroy(): void {
        this.floorSymID = null;
        this.symPos = [];
    }
}

//地板符號母層
export class floorSym {
    public floorSymSub: floorSymSub[] = [];//牌型資料
    constructor(floorSymSub: floorSymSub[]) {
        this.floorSymSub = floorSymSub;
    }
    public destroy(): void {
        this.floorSymSub = [];
    }
}

//免費遊戲次數資料
export class freeGameLeftover {
    public FG_countSwitch: boolean; //是否計算免費遊戲次數
    public FG_usedTimes: number; //已使用免費遊戲次數
    public FG_TotalTimes: number; //獲得的免費遊戲總次數
    constructor(FG_countSwitch: boolean, FG_usedTimes: number, FG_TotalTimes: number) {
        this.FG_countSwitch = FG_countSwitch;
        this.FG_usedTimes = FG_usedTimes;
        this.FG_TotalTimes = FG_TotalTimes;
    }
    public destroy(): void {
        this.FG_countSwitch = false;
        this.FG_usedTimes = 0;
        this.FG_TotalTimes = 5;
    }
}

//建立一局的全部盤面資料類型
export class awardGroup {
    public isNewRound: boolean = false; //是否為新局，用來判斷是否要重置總得分
    public slotNumber: slotNumber[] = []; //symbol盤面，先創好8X8空值也無法解決報錯問題
    public lineAward: lineAward[] = []; //連線的獎項
    public floorSym: floorSym[] = []; //地板下符號盤面
    public lineEvent: string[] = []; //每局結算完需執行事件 'sceneLevelUp','sceneLevelDown'
    public chanceEvent: number[] = []; //每局要生成的機會事件ID(0~2三種)
    public freeGameLeftover: freeGameLeftover = null; //免費遊戲次數資訊(是否計算,已使用次數,應執行次數)
    public haveBigWin: boolean = false; //是否顯示BigWin跑分
    // public ws: number; //得分(所有線的總和)----改為於reelRun_TA的winTotalScore數值累加計算
    // public totalScore: number;  //totalWin(最終分數)----改為於reelRun_TA的bonusTotalScore數值累加計算
    // public destroy(): void {
    //     this.lineAward = [];
    // }
}

@ccclass('demoInfo_freeGame_TA')
export class demoInfo_freeGame_TA extends Component {
    //***************仿gameInfo的腳本 ****************/
    public antes: number[] = [100, 200, 500, 1000];
    /**押注的antes索引 */
    public nowBetIndex = 0;
    // /**每局下注金額 */
    // public betScore: number = 50;  //改於demoFlow_TA內設定
    /**遊戲demo幾局 */
    public demoRound: number = 2; //case0取用第1局，設定3只會運行到case2的盤面結果
    /**遊戲中獎表演資料*/
    public symData: Array<awardGroup> = [];

    onLoad(){
        this.setWinData();//設置一般遊戲中獎表演參數(demo)
    }


    //設置demo表演資料
    setWinData() {
        for (let i = 0; i < this.demoRound; i++) {
            const awardGroupData: awardGroup = new awardGroup();//本局參數(一回合slot的資料)

            // console.log(`加載第${i}Case的盤面內容`);
            switch (i) {
                case 0://5x5
                    //symbol盤面
                    awardGroupData.slotNumber = [  //symbol盤面
                        new slotNumber([[4, 0, 3, 0, 5, null, null, null],[1, 11, 3, 8, 1, null, null, null],[2, 2, 9, 2, 2, null, null, null],
                            [1, 10, 3, 12, 1, null, null, null],[6, 0, 3, 0, 7, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        ]
                    awardGroupData.freeGameLeftover = new freeGameLeftover(false,0,5); //本局免費遊戲資訊(是否計算,已使用次數,應執行次數)，需計算時將已使用次數+1
                    break;

                case 1://5x5
                    //symbol盤面
                    awardGroupData.slotNumber = [  //symbol盤面
                        new slotNumber([[2, 1, 9, 1, 3, null, null, null],[3, 2, 1, 4, 3, null, null, null],[3, 0, 2, 3, 1, null, null, null],
                            [3, 0, 2, 2, 6, null, null, null],[7, 12, 0, 5, 2, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],[null, 0, null, 3, null, null, null, null],
                            [1, 0, 2, 1, 1, null, null, null],[null, 3, 2, 1, 0, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, 3, 3, null, null, null, null],[null, 3, 11, null, 1, null, null, null],[null, null, null, 0, 2, null, null, null],
                            [null, null, 0, 2, 2, null, null, null],[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, 2, 1, 1, null, null, null, null],[null, 3, 12, 1, 0, null, null, null],[null, null, 3, null, 2, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                    ];
                    //盤面連線獎項
                    awardGroupData.lineAward = [  //一個lineAward代表一回合的連線資訊，一個colorAward代表一種顏色符號的連線位置資訊，可new多組lineAward及colorAward
                        //colorAward 內第數值1-colorSymID:是顏色符號的ID, 2-symPos:符號位置索引值(2維陣列)，用於轉換成角色要吃符號的移動座標，例:有3個綠色符號連線，symPos內就會有3組索引值
                        //mouseSym 內數值(1-action:行動名稱(字串'comeIn'生成, 'suckIn'吸收符號), 2-nextPos:下個位置座標)
                        new lineAward([new colorAward(2,[[4,4],[3,4],[3,3],[3,2],[2,2]]),new colorAward(3,[[4,1],[4,0],[3,0],[2,0],[1,0]]),new colorAward(1,[[4,4],[3,4],[2,4]])],new mouseSym('comeIn', [0,1]),[new chanceAward('')]),  
                        new lineAward([new colorAward(1, [[3,4],[3,3],[4,3]]), new colorAward(2, [[3,2],[4,2]]), new colorAward(3, [[2,0]])],new mouseSym('suckIn', [0,4]), [new chanceAward('')]),
                        new lineAward([new colorAward(0, [[1,2],[1,3],[2,3]]),new colorAward(3, [[1,0],[0,0],[1,0],[1,1],[1,2],[2,2],[1,2],[0,2],[0,3],[0,4]])],new mouseSym('', [null]),[new chanceAward('')]),
                    ]
                    //地板下符號盤面
                    awardGroupData.floorSym = [
                        new floorSym([new floorSymSub(0, [[1,0],[1,1],[2,0],[2,1]]),new floorSymSub(4, [[2,2],[2,3],[2,4],[3,2],[3,3],[3,4],[4,2],[4,3],[4,4],]),new floorSymSub(11, [[3,0]])]),
                    ]
                    awardGroupData.chanceEvent = [2,1,null]; //依序要生成的機會事件ID，0:reflash, 1:exchange, 2:wild
                    awardGroupData.freeGameLeftover = new freeGameLeftover(false,0,5); //本局免費遊戲資訊(是否計算,已使用次數,應執行次數)，需計算時將已使用次數+1
                    awardGroupData.haveBigWin = false; //是否顯示BigWin跑分
                    break;

                case 2://5x5
                    //symbol盤面
                    awardGroupData.slotNumber = [  //symbol盤面
                        new slotNumber([[9, 0, 2, 2, 4, null, null, null],[3, 0, 3, 0, 0, null, null, null],[3, 2, 5, 3, 3, null, null, null],
                            [1, 11, 1, 0, 10, null, null, null],[6, 2, 0, 7, 2, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, null, null, 2, null, null, null],[null, null, null, null, 0, null, null, null],[null, null, null, null, 1, null, null, null],
                            [null, null, null, 2, 1, null, null, null],[null, null, 3, null, 0, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, null, null, null, null, null, null],[null, null, null, 1, 3, null, null, null],[null, null, null, 0, 3, null, null, null],
                            [null, null, null, null, 2, null, null, null],[null, null, 3, 1, null, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[3, 3, 3, 1, 8, null, null, null],[11, 1, 7, 1, 2, null, null, null],[0, 6, 2, 1, 0, null, null, null],
                            [5, 0, 3, 0, 1, null, null, null],[3, 3, 9, 0, 4, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),  
                            //reflash事件-如置換後符號與置換前相同，有機率出現找不到動畫可播放Bug，目前找不到原因
                        new slotNumber([[null, null, 0, 0, 10, null, null, null],[null, null, null, null, 3, null, null, null],[null, null, null, null, 3, null, null, null],
                            [null, null, null, null, 2, null, null, null],[null, null, null, 2, 11, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                    ];
                    //盤面連線獎項
                    awardGroupData.lineAward = [  //一個lineAward代表一回合的連線資訊，一個colorAward代表一種顏色符號的連線位置資訊，可new多組lineAward及colorAward
                        new lineAward([new colorAward(0,[[1,4],[1,3]]),new colorAward(1,[[3,2],[3,1],[3,0]]),new colorAward(2,[[4,1],[3,1],[2,1]])],new mouseSym('', [null]),[new chanceAward('')]),  //colorAward內第1個值:colorSymID 是顏色符號的ID，內第2個值(2維陣列):symPos 是符號位置索引值，用於轉換成角色要吃符號的移動座標，例:有3個綠色符號連線，symPos內就會有3組索引值
                        new lineAward([new colorAward(0,[[1,4]]), new colorAward(3,[[4,2],[3,2],[2,2],[2,3],[1,3],[1,2]]), new colorAward(0, [[1,3],[2,3],[2,2],[3,2],[4,2],[4,3],[4,4]])],new mouseSym('', [null]),[new chanceAward('')]), 
                        new lineAward([new colorAward(9,[])],new mouseSym('', [null]),[new chanceAward('reflash')]),  //colorSymID：9 代表無顏色中獎連線, reflash代表機會卡-全盤面符號重置事件
                        new lineAward([new colorAward(0,[[4,3],[3,3],[4,3],[4,2]]),new colorAward(2,[[2,2]]),new colorAward(3,[[0,2],[0,1],[0,0],[1,0]])],new mouseSym('', [null]),[new chanceAward('')]),
                    ]
                    //地板下符號盤面
                    awardGroupData.floorSym = [
                        new floorSym([new floorSymSub(3, [[0,3],[0,4],[1,3],[1,4]]),new floorSymSub(0, [[3,1],[3,2],[4,1],[4,2]])]),
                    ]
                    awardGroupData.chanceEvent = [0,2,1]; //依序要生成的機會事件ID，本局取用2次(索引ID:0,1)，0:reflash, 1:exchange, 2:wild    
                    awardGroupData.freeGameLeftover = new freeGameLeftover(false,0,5); //本局免費遊戲資訊(是否計算,已使用次數,應執行次數)，需計算時將已使用次數+1
                    awardGroupData.haveBigWin = false; //是否顯示BigWin跑分
                    awardGroupData.lineEvent = ['sceneLevelUp'];
                    break;

                case 3://6x6
                    //symbol盤面
                    awardGroupData.slotNumber = [  //symbol盤面
                        new slotNumber([[10, 1, 0, 2, 4, 0, null, null],[1, 7, 2, 2, 2, 0, null, null],[3, 3, 0, 9, 3, 0, null, null],
                            [0, 3, 0, 3, 1, 1, null, null],[2, 2, 0, 0, 2, 5, null, null],[1, 6, 1, 12, 3, 3, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, null, null, 12, 3, null, null],[null, null, null, null, 1, 3, null, null],[null, 8, 0, null, 1, null, null, null],
                            [null, null, null, null, 2, 2, null, null],[null, null, null, null, 0, 1, null, null],[null, null, null, null, null, 1, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, null, null, null, null, null, null],[null, null, null, null, null, 3, null, null],[null, null, null, 1, 1, null, null, null],
                            [null, null, null, null, null, 2, null, null],[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, 11, null, null, null, null, null],[null, null, null, null, null, null, null, null],[null, null, 11, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],[null, null, null, null, 11, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],[null, null, null, 0, 3, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                    ];
                    //盤面連線獎項
                    awardGroupData.lineAward = [
                        new lineAward([new colorAward(0, [[0,5],[1,5],[2,5]]),new colorAward(1, [[3,5],[3,4],[2,4],[2,3]]),new colorAward(2, [[4,1],[4,0]]),new colorAward(3, [[2,1],[2,0],[2,1],[3,1]])],new mouseSym('', [null]),[new chanceAward('')]),
                        new lineAward([new colorAward(1, [[2,4],[1,4],[0,4]]),new colorAward(3, [[2,1]])],new mouseSym('', [null]),[new chanceAward('')]),
                        new lineAward([new colorAward(9,[])],new mouseSym('', [null]),[new chanceAward('wildEvent')]),  //colorSymID：9 代表無顏色中獎連線, wildEvent代表機會卡-隨機變換成Wild事件
                        new lineAward([new colorAward(3, [[2,2],[3,2]])],new mouseSym('', [null]),[new chanceAward('')]),
                    ]
                    //地板下符號盤面
                    awardGroupData.floorSym = [
                        new floorSym([new floorSymSub(0, [[1,0],[1,1],[2,0],[2,1]]),new floorSymSub(6, [[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],[3,3],[3,4],[3,5]]),new floorSymSub(3, [[3,2],[3,3],[4,2],[4,3]])]),
                    ]
                    awardGroupData.chanceEvent = [1,null,null]; //依序要生成的機會事件ID，本局取用1次(索引ID:2)，0:reflash, 1:exchange, 2:wild   
                    awardGroupData.freeGameLeftover = new freeGameLeftover(false,0,5); //本局免費遊戲資訊(是否計算,已使用次數,應執行次數)，需計算時將已使用次數+1
                    awardGroupData.haveBigWin = false; //是否顯示BigWin跑分
                    awardGroupData.lineEvent = ['sceneLevelUp'];
                    break;

                case 4://7x7
                    //symbol盤面
                    awardGroupData.slotNumber = [  //symbol盤面
                        new slotNumber([[0, 0, 6, 0, 11, 3, 3, null],[2, 1, 1, 0, 2, 1, 3, null],[2, 7, 2, 3, 2, 1, 3, null],
                            [2, 0, 10, 2, 4, 2, 8, null],[0, 1, 0, 0, 0, 5, 1, null],[1, 1, 9, 3, 3, 3, 1, null],
                            [0, 0, 2, 2, 0, 2, 1, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, 9, 2, 2, 0, null],[0, 11, 2, 1, 1, 2, 0, null],[null, null, null, null, 1, 0, 8, null],
                            [null, null, null, null, null, 3, 3, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, null, null, null, 2, 2, null],[3, null, null, null, 3, null, 2, null],[3, null, 3, 2, 3, null, 2, null],
                            [3, 3, 3, null, 3, 3, null, null],[null, null, 3, null, null, 3, null, null],[null, 2, 2, 2, null, null, null, null],
                            [null, 3, 3, null, 3, 2, 2, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, null, null, null, null, null, null],[null, null, null, null, null, 2, 3, null],[null, null, null, 2, 2, 3, 3, null],
                            [null, 9, 0, 0, 10, 1, 1, null],[null, null, null, null, 1, null, 2, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                    ];
                    //盤面連線獎項
                    awardGroupData.lineAward = [
                        new lineAward([new colorAward(0, [[4,4],[4,3],[4,2],[5,2],[4,2],[3,2],[3,1]]),
                                       new colorAward(1, [[4,6],[3,6],[4,6],[5,6],[6,6],[5,6],[4,6],[4,5],[4,4],[4,3],[4,2],[4,1],[5,1],[5,0]]),
                                       new colorAward(0, [[4,1],[4,0],[4,1],[5,1],[6,1],[6,0]])],new mouseSym('', [null]),[new chanceAward('')]),
                        new lineAward([new colorAward(9,[])],new mouseSym('', [null]),[new chanceAward('exchange')]),  //colorSymID：9 代表無顏色中獎連線, exchange代表機會卡-隨機二色調換事件
                        new lineAward([new colorAward(3, [[2,0],[1,0],[2,0],[3,0],[3,1],[4,1],[4,2],[3,2],[2,2],[3,2],[3,3],[3,4],[2,4],[1,4],[2,4],[3,4],[3,5],[4,5]])],new mouseSym('', [null]),[new chanceAward('')]),
                    ]
                    //地板下符號盤面
                    awardGroupData.floorSym = [
                        new floorSym([new floorSymSub(0, [[2,5],[2,6],[3,5],[3,6]]),new floorSymSub(3, [[0,3],[0,4],[1,3],[1,4]]),new floorSymSub(8, [[3,0],[3,1],[3,2],[3,3],[4,0],[4,1],[4,2],[4,3],[5,0],[5,1],[5,2],[5,3],[6,0],[6,1],[6,2],[6,3]])]),
                    ]
                    awardGroupData.chanceEvent = [2,1,null]; //依序要生成的機會事件ID，本局取用2次(索引ID:3,4)，0:reflash, 1:exchange, 2:wild
                    awardGroupData.freeGameLeftover = new freeGameLeftover(false,0,5); //本局免費遊戲資訊(是否計算,已使用次數,應執行次數)，需計算時將已使用次數+1
                    awardGroupData.haveBigWin = false; //是否顯示BigWin跑分  
                    awardGroupData.lineEvent = ['sceneLevelUp'];
                    break;
                case 5://8x8
                    //symbol盤面
                    awardGroupData.slotNumber = [  //symbol盤面
                        new slotNumber([[0, 0, 0, 2, 1, 3, 1, 1],[2, 11, 1, 0, 10, 3, 3, 1],[2, 1, 2, 1, 1, 2, 3, 12],
                            [3, 3, 2, 0, 5, 2, 4, 3],[0, 0, 7, 0, 3, 2, 2, 3],[1, 6, 0, 0, 2, 0, 0, 0],
                            [1, 1, 2, 3, 2, 3, 8, 0],[1, 0, 2, 12, 2, 1, 1, 2] ]),
                        new slotNumber([[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, 3],[null, null, null, null, null, null, 1, 3],
                            [null, null, null, null, null, null, null, 2],[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, null, null, null, null, 11, null],[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, 11, null, null, null, null, null],[null, null, null, null, null, null, 11, null],[null, null, null, null, null, null, null, null],
                            [null, 11, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, 0, 0, 2],[null, null, null, null, null, null, 3, 1],[null, null, null, 1, null, null, 3, 1],
                            [null, null, null, 9, 1, 1, 3, 10],[null, null, null, null, null, 2, 2, 0]]),
                        new slotNumber([[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, 2],[null, null, null, null, null, null, null, 2],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                        new slotNumber([[2, 2, 0, null, null, null, null, null],[0, null, null, 2, null, null, null, null],[0, null, 0, 0, null, null, null, null],
                            [null, 2, 0, null, null, 2, 2, 0],[2, 2, 2, null, null, null, null, 0],[null, 2, 2, null, null, null, null, 0],
                            [null, null, null, null, null, null, null, null],[null, 2, null, null, 0, 0, 0, 2]]),
                        new slotNumber([[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, 0],
                            [null, null, null, null, null, 1, null, 0],[null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                    ];
                    //盤面連線獎項
                    awardGroupData.lineAward = [
                        new lineAward([new colorAward(1, [[2,4],[2,3],[2,4],[1,4],[0,4]])],new mouseSym('', [null]),[new chanceAward('')]),
                        new lineAward([new colorAward(9,[])],new mouseSym('', [null]),[new chanceAward('wildEvent')]),  //colorSymID：9 代表無顏色中獎連線, wildEvent代表機會卡-隨機變換成Wild事件
                        new lineAward([new colorAward(0, [[4,6],[5,6],[6,6],[6,7],[5,7],[5,6],[5,5]]),new colorAward(2, [[6,1],[6,2],[7,2],[7,3],[7,4],[6,4],[5,4]]),
                                       new colorAward(3, [[3,2],[3,1],[3,0]])],new mouseSym('', [null]),[new chanceAward('')]),
                        new lineAward([new colorAward(2, [[4,4],[3,4]])],new mouseSym('', [null]),[new chanceAward('')]),
                        new lineAward([new colorAward(9,[])],new mouseSym('', [null]),[new chanceAward('exchange')]),  //colorSymID：9 代表無顏色中獎連線, exchange代表機會卡-隨機二色調換事件
                        new lineAward([new colorAward(2, [[3,5],[2,5],[3,5],[3,6]])],new mouseSym('', [null]),[new chanceAward('')]),
                    ]
                    //地板下符號盤面
                    awardGroupData.floorSym = [
                        new floorSym([new floorSymSub(10, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],
                            [3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[7,7],])]),
                    ]
                    awardGroupData.chanceEvent = [2,null,null]; //依序要生成的機會事件ID，本局取用1次(索引ID:4)，0:reflash, 1:exchange, 2:wild  
                    awardGroupData.freeGameLeftover = new freeGameLeftover(false,0,5); //本局免費遊戲資訊(是否計算,已使用次數,應執行次數)，需計算時將已使用次數+1
                    awardGroupData.haveBigWin = false; //是否顯示BigWin跑分
                    awardGroupData.lineEvent = ['sceneLevelDown'];
                    break;

                case 6://5x5 回到第一關，展示流程結束
                    //symbol盤面
                    awardGroupData.slotNumber = [  //symbol盤面
                        new slotNumber([[2, 9, 1, 1, 3, null, null, null],[7, 2, 1, 4, 3, null, null, null],[0, 3, 3, 3, 8, null, null, null],
                            [3, 3, 0, 5, 2, null, null, null],[0, 0, 6, 0, 2, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                    ];
                    //地板下符號盤面
                    awardGroupData.floorSym = [
                        new floorSym([new floorSymSub(0, [[0,3],[0,4],[1,3],[1,4]]),new floorSymSub(2, [[2,1],[2,2],[3,1],[3,2]])]),
                    ]
                    awardGroupData.chanceEvent = [0,null,null]; //依序要生成的機會事件ID
                    awardGroupData.freeGameLeftover = new freeGameLeftover(false,0,5); //本局免費遊戲資訊(是否計算,已使用次數,應執行次數)，需計算時將已使用次數+1
                    awardGroupData.haveBigWin = false; //是否顯示BigWin跑分
                    break;
                
                case 7://5x5 測試用數據，正式演示不使用
                    //symbol盤面
                    awardGroupData.slotNumber = [  //symbol盤面
                        new slotNumber([[2, 2, 1, 1, 3, null, null, null],[3, 2, 2, 7, 3, null, null, null],[3, 3, 5, 3, 1, null, null, null],
                            [2, 0, 0, 2, 9, null, null, null],[10, 3, 0, 8, 3, null, null, null],[null, null, null, null, null, null, null, null],
                            [null, null, null, null, null, null, null, null],[null, null, null, null, null, null, null, null]]),
                    ];
                    //盤面連線獎項
                    awardGroupData.lineAward = [  //連線的獎項符號顏色&位置，可以new多組lineAward，其下也可再new多組colorAward
                        new lineAward([new colorAward(2, [[3,3],[3,2],[2,2]]) ],new mouseSym('', [null]),[new chanceAward('')]),  //colorAward內第1個值:colorSymID 是顏色符號的ID，內第2個值(2維陣列):symPos 是符號位置索引值，用於轉換成角色要吃符號的移動座標，例:有3個綠色符號連線，symPos內就會有3組索引值
                        new lineAward([new colorAward(103, [[21,22,23,24],[25,26,27,28],[29,30,31,32]]),new colorAward(104, [[41,42,43,44],[45,46,47,48],[49,50,51,52]]) ],new mouseSym('', [null]),[new chanceAward('')]),  
                    ]
                    awardGroupData.freeGameLeftover = new freeGameLeftover(false,0,5); //本局免費遊戲資訊(是否計算,已使用次數,應執行次數)，需計算時將已使用次數+1
                    awardGroupData.haveBigWin = false; //是否顯示BigWin跑分
                    break; 
            }
            this.symData.push(awardGroupData);//設置一般遊戲中獎表演資料
        }
    }

}