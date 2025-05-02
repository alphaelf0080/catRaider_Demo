
//define image type
export const imageType = ["png","PNG","jpg","JPG","gif","GIF"];

enum ETypeId {
    alpha  = "a",
    beta   = "b",
    gamma  = "g"
}

interface IType {
    id:     ETypeId,
    title:  string,
}

export enum trimType{
    auto = 0,
    custom = 1,
    none = 2,
}

export enum assetImageType{
    raw = 0,
    texxture = 1,
    normalMap = 2,
    spriteFrame = 3,
    textureCube = 4,
}

export enum imageMethodType{
    bg_Defocus,
    bg,
    bg_reel,
    main_operate_btn,
    btn,
    symbol,
    tx,
    pic,
    pic_mask,
    pic_line,
    odds,
    font,
    bonus,
    global
}

export enum imageLayerType{
    bg_Defocus,
    bg,
    bg_anim,
    bg_effect,
    reel,
    symbol,
    symbol_anim,
    symbol_effect,
    fg,
    fg_anim,
    fg_effect,
    cha,
    cha_anim
}

export interface imageAssetOption {
    name: string ;
    type: assetImageType ; 
    imgArea: String ;
    trimType:trimType ;
    trimThreshold: number ;
    rotated : boolean ;
    offsetX : number ;
    offsetY : number ;
    trimX: number ;
    trimY: number ;
    width: number ;
    height: number ;
    rawWidth: number ;
    rawHeight: number ;
    borderTop: number ;
    borderBottom: number ;
    borderLeft: number ;
    borderRigh: number ;
    packable: true,
    pixelsToUnit: number ;
    pivotX: number ;
    pivotY: number ;
    meshType: number ;
    uuid: string;
    fixAlphaTransparencyArtifacts: boolean;
    hasAlpha: boolean;
    redirect: string;
    uiType:imageMethodType;
    layer:imageLayerType;
};





// 定義interface 盤面數據
export interface reelCordData {

    width : number ;
    height : number ;
    step: number ;
    row: number ;
    column: number ;
    origin : any[] ;

};