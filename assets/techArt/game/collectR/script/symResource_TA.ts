import { _decorator, Component, Node, SpriteFrame, Prefab, Button, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

//* 建立Symbol圖素資源庫 *//
@ccclass('symResource_TA')
export class symResource_TA extends Component {
    @property({ type: [Prefab], tooltip: "表層符號" })
    public symNode: Prefab[] = [];

    @property({ type: [Prefab], tooltip: "裡層符號" })
    public floorSym: Prefab[] = [];

    @property({ type: Prefab, tooltip: "地板格子" })
    public floorNode: Prefab = null;

    @property({ type: [SpriteFrame], tooltip: "地板貼圖" })
    public floorTexture: SpriteFrame[] = []!;

    @property({ type: [SpriteFrame], tooltip: "Wild貼圖" })
    public WildTexture: SpriteFrame[] = []!;

    @property({ type: [SpriteFrame], tooltip: "主遊戲背景" })
    public mainGameBG: SpriteFrame[] = [];

    /* 特效素材 */
    @property({ type: [Prefab], tooltip: "地板用特效", group: { name: 'Fx', id: '1' } })
    public fxFloorGrid: Prefab[] = [];

    @property({ type: [Prefab], tooltip: "炸彈符號用特效", group: { name: 'Fx', id: '1' } })
    public fxBomb: Prefab[] = [];

    @property({ type: [Prefab], tooltip: "升級符號用特效", group: { name: 'Fx', id: '1' } })
    public fxLevelUp: Prefab[] = [];

    @property({ type: [Prefab], tooltip: "地鼠符號用特效", group: { name: 'Fx', id: '1' } })
    public fxMouse: Prefab[] = [];
    
    @property({ type: [Prefab], tooltip: "機會卡-重置全符號用特效", group: { name: 'Fx', id: '1' } })
    public fxReflash: Prefab[] = [];

    @property({ type: [Node], tooltip: "搶分模式用特效", group: { name: 'Fx', id: '1' } })
    public fxGrabGame: Node[] = [];


    /* 按鈕相關 */
    @property({ type: Node, tooltip: "spin按鈕", group: { name: 'UI Button', id: '2' } })
    public btnSpin: Node = null;
    @property({ type: Node, tooltip: "stop按鈕", group: { name: 'UI Button', id: '2' } })
    public btnStop: Node = null
    @property({ type: Node, tooltip: "自動按鈕停止", group: { name: 'UI Button', id: '2' } })
    public btnAutoStop: Node = null;
    @property({ type: Node, tooltip: "閃電按鈕(關閉狀態)", group: { name: 'UI Button', id: '2' } })
    public btnFastOff: Node = null;
    @property({ type: Node, tooltip: "閃電按鈕(開啟狀態)", group: { name: 'UI Button', id: '2' } })
    public btnFastOn: Node = null;
    @property({ type: Button, tooltip: "自動按鈕", group: { name: 'UI Button', id: '2' } })
    public btnAuto: Button = null;
    @property({ type: Button, tooltip: "下注加分按鈕", group: { name: 'UI Button', id: '2' } })
    public betAdd: Button = null;
    @property({ type: Button, tooltip: "下注減分按鈕", group: { name: 'UI Button', id: '2' } })
    public betLess: Button = null;
    @property({ type: Button, tooltip: "設置選單按鈕", group: { name: 'UI Button', id: '2' } })
    public btnSetting: Button = null;
}


