//
//
//  config data
//
//
//
//



export const assetData = {
            globalKey : {
                "turboScale": 0.5

            },

            rowAndColumn : {
                     "0": 5,    "1": 6,  "2": 7, "3": 8
                    },
                     
            symLayerSize : {
                        "0": 1080,  "1": 1296,  "2": 1512,  "3": 1728 
                    },
            gridLevel : {
                        "L1":0,
                        "L2":1,
                        "L3":2,
                        "L4":3 
                    },
            reelLevelSizeData:[
                        {"token":"L1","levelIndex":0,"reelSize":1080,"rowCount":5,"columnCount":5},
                        {"token":"L2","levelIndex":1,"reelSize":1296,"rowCount":6,"columnCount":6},
                        {"token":"L3","levelIndex":2,"reelSize":1512,"rowCount":7,"columnCount":7},
                        {"token":"L4","levelIndex":3,"reelSize":1728,"rowCount":8,"columnCount":8},

            ],

            gridLevelIndex : [
                       {"token":"L1","index":0,"reelRSize":5,"reelCSize":5},
                       {"token":"L2","index":1,"reelRSize":6,"reelCSize":6},
                       {"token":"L3","index":2,"reelRSize":7,"reelCSize":7},
                       {"token":"L4","index":3,"reelRSize":8,"reelCSize":8}
                    ],
            symArray : [
                        [
                        null, null, null,
                        null, null, null,
                        null, null
                        ],
                        [
                        null, null, null,
                        null, null, null,
                        null, null
                        ],
                        [
                        null, null, null,
                        null, null, null,
                        null, null
                        ],
                        [
                        null, null, null,
                        null, null, null,
                        null, null
                        ],
                        [
                        null, null, null,
                        null, null, null,
                        null, null
                        ],
                        [
                        null, null, null,
                        null, null, null,
                        null, null
                        ],
                        [
                        null, null, null,
                        null, null, null,
                        null, null
                        ],
                        [
                        null, null, null,
                        null, null, null,
                        null, null
                        ]
                    ],
            symTokenArray : [
                      [
                      null, null, null,
                      null, null, null,
                      null, null
                      ],
                      [
                      null, null, null,
                      null, null, null,
                      null, null
                      ],
                      [
                      null, null, null,
                      null, null, null,
                      null, null
                      ],
                      [
                      null, null, null,
                      null, null, null,
                      null, null
                      ],
                      [
                      null, null, null,
                      null, null, null,
                      null, null
                      ],
                      [
                      null, null, null,
                      null, null, null,
                      null, null
                      ],
                      [
                      null, null, null,
                      null, null, null,
                      null, null
                      ],
                      [
                      null, null, null,
                      null, null, null,
                      null, null
                      ]
                  ],
            posArray:[[[108,108,0],[324,108,0],[540,108,0],[756,108,0],[972,108,0],[1188,108,0],[1404,108,0],[1620,108,0]],
                      [[108,324,0],[324,324,0],[540,324,0],[756,324,0],[972,324,0],[1188,324,0],[1404,324,0],[1620,324,0]],
                      [[108,540,0],[324,540,0],[540,540,0],[756,540,0],[972,540,0],[1188,540,0],[1404,540,0],[1620,540,0]],
                      [[108,756,0],[324,756,0],[540,756,0],[756,756,0],[972,756,0],[1188,756,0],[1404,756,0],[1620,756,0]],
                      [[108,972,0],[324,972,0],[540,972,0],[756,972,0],[972,972,0],[1188,972,0],[1404,972,0],[1620,972,0]],
                      [[108,1188,0],[324,1188,0],[540,1188,0],[756,1188,0],[972,1188,0],[1188,1188,0],[1404,1188,0],[1620,1188,0]], 
                      [[108,1404,0],[324,1404,0],[540,1404,0],[756,1404,0],[972,1404,0],[1188,1404,0],[1404,1404,0],[1620,1404,0]],
                      [[108,1620,0],[324,1620,0],[540,1620,0],[756,1620,0],[972,1620,0],[1188,1620,0],[1404,1620,0],[1620,1620,0]]],
     
                      reelGridEffectCoordOffset : [
                              {"name":"chanceEventEffect","offset":[0,0,0]}
                            ],
            floorSymArray : [ 
                        [ 
                          0, 0, 0, 0, 
                          0, 0, 0, 0 
                        ], 
                        [ 
                          0, 0, 0, 0, 
                          0, 0, 0, 0 
                        ], 
                        [ 
                          0, 0, 0, 0, 
                          0, 0, 0, 0 
                        ], 
                        [ 
                          0, 0, 0, 0, 
                          0, 0, 0, 0 
                        ], 
                        [ 
                          0, 0, 0, 0, 
                          0, 0, 0, 0 
                        ], 
                        [ 
                          0, 0, 0, 0, 
                          0, 0, 0, 0 
                        ], 
                        [ 
                          0, 0, 0, 0, 
                          0, 0, 0, 0 
                        ], 
                        [ 
                          0, 0, 0, 0, 
                          0, 0, 0, 0 
                        ] 
                    ], 
            columnsID : {
                        "0": 7,    "1": 6,    "2": 5,   "3": 4,   "4": 3,   "5": 2,  "6": 1,   "7": 0 
                    },
            reelData : [
                        {   "name":"reelData_5x5",
                            "token":"L1",
                            "reelID":0,
                            "reelLevel":0,
                            "width" : 216 ,
                            "height" : 216 ,
                            "step": 0 ,
                            "row": 5 ,
                            "column": 5 ,
                            "origin" : [108,108,0],
                            "rc_cord" : [ [0,0],[0,1],[0,2],[0,3],[0,4],
                                            [1,0],[1,1],[1,2],[1,3],[1,4],
                                            [2,0],[2,1],[2,2],[2,3],[2,4],
                                            [3,0],[3,1],[3,2],[3,3],[3,4],
                                            [4,0],[4,1],[4,2],[4,3],[4,4]
                                        ]
                        },
                        {   "name":"reelData_6x6",
                            "token":"L2",
                            "reelID":1,
                            "reelLevel":1,
                            "width" : 216 ,
                            "height" : 216 ,
                            "step": 0 ,
                            "row": 6 ,
                            "column": 6 ,
                            "origin" : [108,108,0],
                            "rc_cord" : [ [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],
                                        [1,0],[1,1],[1,2],[1,3],[1,4],[1,5],
                                        [2,0],[2,1],[2,2],[2,3],[2,4],[2,5],
                                        [3,0],[3,1],[3,2],[3,3],[3,4],[3,5],
                                        [4,0],[4,1],[4,2],[4,3],[4,4],[4,5],
                                        [5,0],[5,1],[5,2],[5,3],[5,4],[5,5]
                                        ]
                        },
                        {   "name":"reelData_7x7",
                            "token":"L3",
                            "reelID":2,
                            "reelLevel":2,
                            "width" : 216 ,
                            "height" : 216 ,
                            "step": 0 ,
                            "row": 7 ,
                            "column": 7 ,
                            "origin" : [108,108,0],
                            "rc_cord" : [ [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
                                        [1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],
                                        [2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],
                                        [3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],
                                        [4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],
                                        [5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],
                                        [6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6]
                                        ]
                        },
                        {   "name":"reelData_8x8",
                            "token":"L4",
                            "reelID":3,
                            "reelLevel":3,
                            "width" : 216 ,
                            "height" : 216 ,
                            "step": 0 ,
                            "row": 8 ,
                            "column": 8 ,
                            "origin" : [108,108,0],
                            "rc_cord" : [ [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],
                                        [1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],
                                        [2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],
                                        [3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],
                                        [4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],
                                        [5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],
                                        [6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7]
                                        ]
                        }
                    ],

            cameraPos:{
                      //盤面行列數，由下拉式選單轉換對應數值

                      0: [0,1860,1127],    1: [0,2200,1324],    2: [0,2570,1538],   3: [0,2956,1761]

            }, 
            camOrthoHeight:{
                      0: 960,   //5X5盤面尺寸
                      1: 1152,  //6X6盤面尺寸
                      2: 1344,  //7X7盤面尺寸
                      3: 1536,  //8X8盤面尺寸

            },
            camPosY:{
                    //攝影機拍攝位置校正

                      0: 0,   //5X5盤面
                      1: 10,  //6X6盤面
                      2: 20,  //7X7盤面
                      3: 30,  //8X8盤面

            },
            bgContentSize:{
                  //背景尺吋，由下拉式選單轉換對應數值，變動尺寸才能讓Layout控制正確居中

                      0: 1080,  //5X5盤面尺寸
                      1: 1296,  //6X6盤面尺寸
                      2: 1512,  //7X7盤面尺寸
                      3: 1728,  //8X8盤面尺寸
            },
            resourcesLoadSymType :[   //預載入符號類型
                       "mainSymbol",
                       "character",
                       "featureSymbol",
                       "wildSymbol",
                       "bonus_character"
                     

            ],

            symbolData : [
                        {"symID":0,"symPrefabName":"SymN_0.prefab","url":"prefab/sym","name":"SymN_0","description":"red_symbol","type":"mainSymbol","performanceTime":0,"grid":[1,1]},
                        {"symID":1,"symPrefabName":"SymN_1.prefab","url":"prefab/sym","name":"SymN_1","description":"yellow_symbol","type":"mainSymbol","performanceTime":0,"grid":[1,1]},
                        {"symID":2,"symPrefabName":"SymN_2.prefab","url":"prefab/sym","name":"SymN_2","description":"green_symbol","type":"mainSymbol","performanceTime":0,"grid":[1,1]},
                        {"symID":3,"symPrefabName":"SymN_3.prefab","url":"prefab/sym","name":"SymN_3","description":"blue_symbol","type":"mainSymbol","performanceTime":0,"grid":[1,1]},
                        {"symID":4,"symPrefabName":"SymC_0.prefab","url":"prefab/sym","name":"SymC_0","description":"red_cat","type":"character","performanceTime":0,"grid":[1,1]},
                        {"symID":5,"symPrefabName":"SymC_1.prefab","url":"prefab/sym","name":"SymC_1","description":"yellow_cat","type":"character","performanceTime":0,"grid":[1,1]},
                        {"symID":6,"symPrefabName":"SymC_2.prefab","url":"prefab/sym","name":"SymC_2","description":"green_cat","type":"character","performanceTime":0,"grid":[1,1]},
                        {"symID":7,"symPrefabName":"SymC_3.prefab","url":"prefab/sym","name":"SymC_3","description":"blue_cat","type":"character","performanceTime":0,"grid":[1,1]},
                        {"symID":8,"symPrefabName":"SymS_0.prefab","url":"prefab/sym","name":"SymS_0","description":"bomber_symbol","type":"featureSymbol","performanceTime":3,"grid":[1,1]},
                        {"symID":9,"symPrefabName":"SymS_1.prefab","url":"prefab/sym","name":"SymS_1","description":"bonus_symbol","type":"featureSymbol","performanceTime":1.6,"grid":[1,1]},
                        {"symID":10,"symPrefabName":"SymS_2.prefab","url":"prefab/sym","name":"SymS_2","description":"energy_symbol","type":"featureSymbol","performanceTime":1.9,"grid":[1,1]},
                        {"symID":11,"symPrefabName":"SymS_3.prefab","url":"prefab/sym","name":"SymS_3","description":"wild_symbol","type":"wildSymbol","performanceTime":1,"grid":[1,1]},
                        {"symID":12,"symPrefabName":"SymS_4.prefab","url":"prefab/sym","name":"SymS_4","description":"upgrade_symbol","type":"featureSymbol","performanceTime":2,"grid":[1,1]},
                        {"symID":13,"symPrefabName":"SymC_11.prefab","url":"prefab/sym","name":"SymC_11","description":"bonus_rat","type":"bonus_character","performanceTime":2,"grid":[1,1]},
                       
                        {"symID":14,"symPrefabName":"SymC_4.prefab","url":"prefab/sym","name":"SymC_4","description":"bonus_rat","type":"grab_character","performanceTime":2,"grid":[1,1]},
                        {"symID":15,"symPrefabName":"SymC_5.prefab","url":"prefab/sym","name":"SymC_5","description":"bonus_rat","type":"grab_character","performanceTime":2,"grid":[1,1]},
                        {"symID":16,"symPrefabName":"SymC_6.prefab","url":"prefab/sym","name":"SymC_6","description":"bonus_rat","type":"grab_character","performanceTime":2,"grid":[1,1]},
                        {"symID":17,"symPrefabName":"SymC_7.prefab","url":"prefab/sym","name":"SymC_7","description":"bonus_rat","type":"grab_character","performanceTime":2,"grid":[1,1]},

                        {"symID":99,"symPrefabName":"SymR_0.prefab","url":"prefab/sym","name":"SymR_0","description":"bonus_rat","type":"bonus_character","performanceTime":0,"grid":[1,1]},
                
                        {"symID":101,"symPrefabName":"SymF_1.prefab","url":"prefab/sym","name":"SymF_1","description":"2x_winSym","type":"secFloor_winSymbol","performanceTime":0,"grid":[2,2]},
                        {"symID":102,"symPrefabName":"SymF_2.prefab","url":"prefab/sym","name":"SymF_2","description":"5x_winSym","type":"secFloor_winSymbol","performanceTime":0,"grid":[2,2]},
                        {"symID":103,"symPrefabName":"SymF_3.prefab","url":"prefab/sym","name":"SymF_3","description":"10x_winSym","type":"secFloor_winSymbol","performanceTime":0,"grid":[2,2]},
                        {"symID":104,"symPrefabName":"SymF_4.prefab","url":"prefab/sym","name":"SymF_4","description":"15x_winSym","type":"secFloor_winSymbol","performanceTime":0,"grid":[3,3]},
                        {"symID":105,"symPrefabName":"SymF_5.prefab","url":"prefab/sym","name":"SymF_5","description":"25x_winSym","type":"secFloor_winSymbol","performanceTime":0,"grid":[3,3]},
                        {"symID":106,"symPrefabName":"SymF_6.prefab","url":"prefab/sym","name":"SymF_6","description":"50x_winSym","type":"secFloor_winSymbol","performanceTime":0,"grid":[3,3]},
                        {"symID":107,"symPrefabName":"SymF_7.prefab","url":"prefab/sym","name":"SymF_7","description":"100x_winSym","type":"secFloor_winSymbol","performanceTime":0,"grid":[4,4]},
                        {"symID":108,"symPrefabName":"SymF_8.prefab","url":"prefab/sym","name":"SymF_8","description":"500x_winSym","type":"secFloor_winSymbol","performanceTime":0,"grid":[4,4]},
                        {"symID":109,"symPrefabName":"SymF_9.prefab","url":"prefab/sym","name":"SymF_9","description":"1000x_winSym","type":"secFloor_winSymbol","performanceTime":0,"grid":[4,4]},
                        {"symID":199,"symPrefabName":"SymF_10.prefab","url":"prefab/sym","name":"SymF_10","description":"max_winSym","type":"secFloor_winSymbol","performanceTime":0,"grid":[8,8]},
                
                        {"symID":301,"symPrefabName":"SymF_0.prefab","url":"prefab/sym","name":"SymF_0","description":"next_level_symbobl","type":"secFloor_eventSymbol","performanceTime":0,"grid":[2,2]},
                       // {"symID":302,"symPrefabName":"SymE_0.prefab","url":"prefab/sym","name":"SymE_0","description":"bonus_ratHole","type":"secFloor_eventSymbol","performanceTime":0,"grid":[1,1]},
                
                        {"symID":555,"symPrefabName":"emptyGrid.prefab","url":"prefab/sym","name":"empty_grid","description":"empty_gird","type":"empty_symbol","performanceTime":0,"grid":[1,1]},
                
                        {"symID":700,"symPrefabName":"symW_0.prefab","url":"prefab/sym","name":"symW_0","description":"win_symbol","type":"empty_symbol","performanceTime":0,"grid":[1,1]},
                        {"symID":701,"symPrefabName":"symW_1.prefab","url":"prefab/sym","name":"symW_1","description":"win_symbol","type":"win_symbol","performanceTime":0,"grid":[2,2]},
                        {"symID":702,"symPrefabName":"symW_2.prefab","url":"prefab/sym","name":"symW_2","description":"win_symbol","type":"win_symbol","performanceTime":0,"grid":[1,1]},
                        {"symID":703,"symPrefabName":"symW_3.prefab","url":"prefab/sym","name":"symW_3","description":"win_symbol","type":"win_symbol","performanceTime":0,"grid":[1,1]},
                
                        {"symID":199,"symPrefabName":"SymF_10.prefab","url":"prefab/sym","name":"SymF_10","description":"max_winSym","type":"secFloor_winSymbol","performanceTime":0,"grid":[8,8]}
                

                
                      ],
            fxResources:[   //預載入特效類型 
                        {"fxID":0,"fxPrefabName":"fx_bomp_explosion.prefab","url":"prefab/fx","name":"fx_bomp_explosion","description":"fx_bomp_explosion","type":"effect_source","performanceTime":0,"grid":[2,2]},
                        {"fxID":1,"fxPrefabName":"fx_chanceStandby_0_reflash.prefab","url":"prefab/fx","name":"fx_chanceStandby_0_reflash","description":"fx_chanceStandby_0_reflash","type":"effect_source","performanceTime":0,"grid":[2,2]},
                        {"fxID":2,"fxPrefabName":"fx_chanceStandby_1_exchange.prefab","url":"prefab/fx","name":"fx_chanceStandby_1_exchange","description":"fx_chanceStandby_1_exchange","type":"effect_source","performanceTime":0,"grid":[0,0]},
                        {"fxID":3,"fxPrefabName":"fx_chanceStandby_2_wildEvent.prefab","url":"prefab/fx","name":"fx_chanceStandby_2_wildEvent","description":"fx_levefx_chanceStandby_2_wildEventlUfx_chanceStandby_2_wildEventp_start","type":"effect_source","performanceTime":0,"grid":[1,1]}, 
                        {"fxID":4,"fxPrefabName":"fx_floor_explosion.prefab","url":"prefab/fx","name":"fx_floor_explosion","description":"fx_floor_explosion","type":"effect_source","performanceTime":0,"grid":[2,2]},
                        {"fxID":6,"fxPrefabName":"Fx_levelUp_end.prefab","url":"prefab/fx","name":"Fx_levelUp_end","description":"fx_reFx_levelUp_endflash","type":"effect_source","performanceTime":0,"grid":[2,2]},
                        {"fxID":7,"fxPrefabName":"Fx_levelUpLine.prefab","url":"prefab/fx","name":"Fx_levelUpLine","description":"Fx_levelUpLine","type":"effect_source","performanceTime":0,"grid":[1,1]},
                        {"fxID":8,"fxPrefabName":"Fx_levelUp_start.prefab","url":"prefab/fx","name":"Fx_levelUp_start","description":"Fx_levelUp_start","type":"effect_source","performanceTime":0,"grid":[1,1]},
                        {"fxID":9,"fxPrefabName":"Fx_mouse_hit.prefab","url":"prefab/fx","name":"Fx_mouse_hit","description":"Fx_mouse_hit","type":"effect_source","performanceTime":0,"grid":[1,1]},
                        {"fxID":10,"fxPrefabName":"Fx_mouse_hit_part.prefab","url":"prefab/fx","name":"Fx_mouse_hit_part","description":"Fx_mouse_hit_part","type":"effect_source","performanceTime":0,"grid":[1,1]},
                        {"fxID":11,"fxPrefabName":"Fx_mouse_spawnCrystal_part.prefab","url":"prefab/fx","name":"Fx_mouse_spawnCrystal_part","description":"Fx_mouse_spawnCrystal_part","type":"effect_source","performanceTime":0,"grid":[1,1]},
                        {"fxID":12,"fxPrefabName":"Fx_reflash.prefab","url":"prefab/fx","name":"Fx_reflash","description":"Fx_reflash","type":"effect_source","performanceTime":0,"grid":[1,1]},
                        {"fxID":13,"fxPrefabName":"Fx_reflash.prefab","url":"prefab/fx","name":"Fx_reflash","description":"Fx_reflash","type":"effect_source","performanceTime":0,"grid":[1,1]},

                      ],
            unFillSymbolType:[   //不向前補牌符號類型
              "character",
              "bonus_character"

            ],   
            swapSymbolType:[   //機會卡不改變的符號類型 
              {"mode":"REFRESH","swapSymbolType":["mainSymbol","character","featureSymbol","wildSymbol","bonus_character"]},
              {"mode":"SWAP","swapSymbolType":["mainSymbol","character","featureSymbol","wildSymbol","bonus_character"]},
              {"mode":"WILD","swapSymbolType":["mainSymbol","character","featureSymbol","bonus_character"]},


             // "featureSymbol"
            ],   
            clearAbleSymbolType:[
              "mainSymbol",
              "featureSymbol"
            ],       
            floorSymbolData : [
                        {"floor_symID":0,"token":"NL","symPrefabName":"SymF_0.prefab","url":"prefab/sym","name":"SymF_0","score":0,"description":"next_level_symbobl","type":"secFloor_eventSymbol","performanceTime":0,"grid":[2,2]},
                        {"floor_symID":1,"token":"2-","symPrefabName":"SymF_1.prefab","url":"prefab/sym","name":"SymF_1","score":2,"description":"2x_winSym","type":"secFloor_eventSymbol","performanceTime":0,"grid":[2,2]},
                        {"floor_symID":2,"token":"2-","symPrefabName":"SymF_2.prefab","url":"prefab/sym","name":"SymF_2","score":5,"description":"5x_winSym","type":"secFloor_eventSymbol","performanceTime":0,"grid":[2,2]},
                        {"floor_symID":3,"token":"2-","symPrefabName":"SymF_3.prefab","url":"prefab/sym","name":"SymF_3","score":10,"description":"10x_winSym","type":"secFloor_eventSymbol","performanceTime":0,"grid":[2,2]},
                        {"floor_symID":4,"token":"3-","symPrefabName":"SymF_4.prefab","url":"prefab/sym","name":"SymF_4","score":15,"description":"15x_winSym","type":"secFloor_eventSymbol","performanceTime":0,"grid":[3,3]},
                        {"floor_symID":5,"token":"3-","symPrefabName":"SymF_5.prefab","url":"prefab/sym","name":"SymF_5","score":25,"description":"25x_winSym","type":"secFloor_eventSymbol","performanceTime":0,"grid":[3,3]},
                        {"floor_symID":6,"token":"3-","symPrefabName":"SymF_6.prefab","url":"prefab/sym","name":"SymF_6","score":50,"description":"50x_winSym","type":"secFloor_eventSymbol","performanceTime":0,"grid":[3,3]},
                        {"floor_symID":7,"token":"4-","symPrefabName":"SymF_7.prefab","url":"prefab/sym","name":"SymF_7","score":100,"description":"100x_winSym","type":"secFloor_eventSymbol","performanceTime":0,"grid":[4,4]},
                        {"floor_symID":8,"token":"4-","symPrefabName":"SymF_8.prefab","url":"prefab/sym","name":"SymF_8","score":500,"description":"500x_winSym","type":"secFloor_eventSymbol","performanceTime":0,"grid":[4,4]},
                        {"floor_symID":9,"token":"4-","symPrefabName":"SymF_9.prefab","url":"prefab/sym","name":"SymF_9","score":1000,"description":"1000x_winSym","type":"secFloor_eventSymbol","performanceTime":0,"grid":[4,4]},
                        {"floor_symID":10,"token":"MW","symPrefabName":"SymF_10.prefab","url":"prefab/sym","name":"SymF_10","score":3000,"description":"max_winSym","type":"secFloor_eventSymbol","performanceTime":0,"grid":[8,8]},
                        {"floor_symID":11,"token":"HO","symPrefabName":"SymF_11.prefab","url":"prefab/sym","name":"SymF_11","score":0,"description":"mouse_hole","type":"secFloor_eventSymbol","performanceTime":0,"grid":[1,1]}

                      ], 
            floorGrid:[ 
                        {"floor_GridID":0,"symPrefabName":"FloorGrid.prefab","url":"prefab/sym","name":"FloorGrid","description":"floor unit grid","type":"floor_grid","performanceTime":0,"grid":[1,1]},
                      ],
            floorTexture:[ 
                        {"floor_textureID":0,"textureName":"floor_type1","name":"floor_type1","description":"floor grid L1","type":"floor_grid_texture","performanceTime":0,"grid":[1,1]},
                        {"floor_textureID":1,"textureName":"floor_type2","name":"floor_type2","description":"floor grid L2","type":"floor_grid_texture","performanceTime":0,"grid":[1,1]},
                        {"floor_textureID":2,"textureName":"floor_type3","name":"floor_type3","description":"floor grid L3","type":"floor_grid_texture","performanceTime":0,"grid":[1,1]},
                        {"floor_textureID":3,"textureName":"floor_type4","name":"floor_type4","description":"floor grid L4","type":"floor_grid_texture","performanceTime":0,"grid":[1,1]},
                     
                      ],
            effectSources:[ 
                        {"effect_ID":0,"effectPrefabName":"fx_floor_explosion.prefab","name":"fx_floor_explosion","description":"fx_bomb","type":"effect_source","performanceTime":0,"grid":[2,2]},
                        {"effect_ID":1,"effectPrefabName":"fx_bomp_explosion.prefab","name":"fx_bomp_explosion","description":"fx_bomb","type":"effect_source","performanceTime":0,"grid":[2,2]},
                        {"effect_ID":2,"effectPrefabName":"Fx_levelUpLine.prefab","name":"Fx_levelUpLine","description":"fx_levelUp","type":"effect_source","performanceTime":0,"grid":[0,0]},
                        {"effect_ID":3,"effectPrefabName":"Fx_levelUp_start.prefab","name":"Fx_levelUp_start","description":"fx_levelUp","type":"effect_source","performanceTime":0,"grid":[1,1]},
                        {"effect_ID":4,"effectPrefabName":"Fx_levelUp_end.prefab","name":"Fx_levelUp_end","description":"fx_levelUp","type":"effect_source","performanceTime":0,"grid":[2,2]},
                        {"effect_ID":5,"effectPrefabName":"Fx_reflash.prefab","name":"Fx_reflash","description":"fx_reflash","type":"effect_source","performanceTime":0,"grid":[2,2]},


                      ],
            chanceEffects:[
                      {"effect_ID":0,"chanceCardName":"REFRESH","effectPrefabName":"fx_chanceStandby_0_reflash.prefab","url":"prefab/fx","name":"fx_chanceStandby_0_reflash","description":"chanceCard_reflash","type":"effect_source","performanceTime":0},
                      {"effect_ID":1,"chanceCardName":"SWAP","effectPrefabName":"fx_chanceStandby_1_exchange.prefab","url":"prefab/fx","name":"fx_chanceStandby_1_exchange","description":"chanceCard_exchange","type":"effect_source","performanceTime":0},
                      {"effect_ID":2,"chanceCardName":"WILD","effectPrefabName":"fx_chanceStandby_2_wildEvent.prefab","url":"prefab/fx","name":"fx_chanceStandby_2_wildEvent","description":"chanceCard_wildEvent","type":"effect_source","performanceTime":0},

                    
            ],

            wildFxColor:[
              {"index":0, "color": [255,59,154,220]},
              {"index":1, "color": [255,173,0,200]},
              {"index":2, "color": [30,155,0,200]},
              {"index":3, "color": [0,102,255,200]},

            ],
            btnColor:[
              {"name":"initial", "color": [255,255,255,255]},

              {"name":"run", "color": [0,255,100,100]},
              {"name":"disable", "color": [100,100,100,220]},


            ],

            animationSources:[
                        {"ID":0,"name":"xxxxx","clipName":"yyyyy","url":'',"description":"","performanceTime":0},
                      ], 
            functionDelayTime:{
                        "dt_getReelRunSymArray":0.2 //call入呼叫symArray時間
                          //let dt_getReelRunSymArray:number = assetData.functionDelayTime.dt_getReelRunSymArray
                      },
            reelTimer : {
                        "dt_preSymbol" :0.02,
                        "dt_preFloor":0.1,
                        "dt_preGrid":0.05,
                        "dt_preColumn_symIn" : 0.01 ,
                        "dt_preColumn_symClean" : 0.03 ,
                        "dt_preSym_reelClean": 0.02 , //符號清除延遲時間
                        "dt_levelUp_waitiing": 1,
                        "dt_preReel":1,
                        "dt_preFloorClean": 0.02, //地板清除延遲時間
                        "restoreFloorWaitting" : 0.05,
                        "delayTime_preColumn": 0.3, //每個column延遲掉落時間 0.05
                        "secFloorSymbol_initial" : 0.05,
                        "dt_performanceFirstColumn":0.04,
                        "dt_performancePreColumn":0.08,
                        "waitting_initialReel":0,
                        "symDropDelay":0.1, //符號掉落延遲時間
                        "chanceEventFXTime":0.5, //機會卡特效時間
                        "chanceSwapPreSymTime":0.01, //翻轉卡片的符號出現時間
                        "releaseChanceCardTime":0.5, //發放機會卡時間
                        
                    },
            ratPerformanceTime : {
                        "ratComingTime":2,
                        "ratGetFromPoolTime":0.01,
                        "ratStealTime":0.2,
                        "clearTargetSymbolTime":1,
                        "ratQuitTime":0.2,
                        "ratMoveTargetTime":0.2,
                        "ratPerFormanceDelayTime":2
                        },
            chaTimer : {
                       "catTimeScale":0.2,  //影響貓移動的速度、連線特效的速度 default 0.3
                        "stepDuration":0.03, //每一步移動所需時間
                        "stepWaittingTime":0,
                        "winAddTime":0,
                        "winWaitEndTime":0,
                        "ratSteelTime":2,
                        "ratQuitTime":1,
                        "chaMoveTimeOffset":0.1,  //角色移動基礎時間
                        "clearRatMoveTargetTime":1,  //消除老鼠移動後的符號
                        "ratMoveToTargetPosTime:":0.5 //老鼠移動到目標處的時間
                    },
            symbolPerformanceTime : {
                  chanceCardSwapWaitTime:0.05, // 翻轉卡片等待時間
                  symbolRecoveryTime:0.1, // 符號恢復時間 0.2
                    },


            waittingEventToken:[
                



                

            ],
            exceptSymList:[  //排除補牌的符號清單
                        "null_symbol" ,
                         "character" ,
                         "empty",
                         "bonus_character"
            ],

            energyBarCountedSym:[
                        "mainSymbol",
                        "featureSymbol",
                        "wildSymbol"
            ],

            moveAbleSymTypeList:[  //可移動的符號類型清單:[
                
                          "mainSymbol",
                          "featureSymbol",
                          "wildSymbol"
            ],
            UI : {
                        "spinBtnRotateSpeed":1,
                        "spinBtnClickRotateSpeed":4
                    },

            multipleSymbol : [
                        "2-",
                        "3-",
                        "4-",
                        "MW"
            ],
            energyBar:{
                        "initialEnergy":0.1,
                        "initialEnergyZero":0,
                        "energyStep":0.0334,  //每吸收一個能量能量條收集的進度
                        "maxEnergyInt":30,  //能量條最大值
                        "energyStepInt":1,  //每吸收一個能量能量條收集的進度
                        "energyStepBarDuration":0.2,  //能量條收集進度條的時間"
                      },
            tokens : [
                        {"token":"R1","symLevel":1,"id":0,"score":0.1,"name":"SymN_0","symPrefabName":"SymN_0.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"R2","symLevel":2,"id":0,"score":0.2,"name":"SymN_0","symPrefabName":"SymN_0.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"R3","symLevel":3,"id":0,"score":0.3,"name":"SymN_0","symPrefabName":"SymN_0.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"R4","symLevel":4,"id":0,"score":0.4,"name":"SymN_0","symPrefabName":"SymN_0.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"R5","symLevel":5,"id":0,"score":0.5,"name":"SymN_0","symPrefabName":"SymN_0.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"R6","symLevel":6,"id":0,"score":1.0,"name":"SymN_0","symPrefabName":"SymN_0.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"R7","symLevel":7,"id":0,"score":5.0,"name":"SymN_0","symPrefabName":"SymN_0.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"R8","symLevel":8,"id":0,"score":50.0,"name":"SymN_0","symPrefabName":"SymN_0.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"Y1","symLevel":1,"id":1,"score":0.05,"name":"SymN_1","symPrefabName":"SymN_1.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"Y2","symLevel":2,"id":1,"score":0.15,"name":"SymN_1","symPrefabName":"SymN_1.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"Y3","symLevel":3,"id":1,"score":0.25,"name":"SymN_1","symPrefabName":"SymN_1.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"Y4","symLevel":4,"id":1,"score":0.3,"name":"SymN_1","symPrefabName":"SymN_1.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"Y5","symLevel":5,"id":1,"score":0.45,"name":"SymN_1","symPrefabName":"SymN_1.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"Y6","symLevel":6,"id":1,"score":0.8,"name":"SymN_1","symPrefabName":"SymN_1.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"Y7","symLevel":7,"id":1,"score":3.0,"name":"SymN_1","symPrefabName":"SymN_1.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"Y8","symLevel":8,"id":1,"score":10.0,"name":"SymN_1","symPrefabName":"SymN_1.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"G1","symLevel":1,"id":2,"score":0.05,"name":"SymN_2","symPrefabName":"SymN_2.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"G2","symLevel":2,"id":2,"score":0.1,"name":"SymN_2","symPrefabName":"SymN_2.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"G3","symLevel":3,"id":2,"score":0.2,"name":"SymN_2","symPrefabName":"SymN_2.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"G4","symLevel":4,"id":2,"score":0.25,"name":"SymN_2","symPrefabName":"SymN_2.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"G5","symLevel":5,"id":2,"score":0.4,"name":"SymN_2","symPrefabName":"SymN_2.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"G6","symLevel":6,"id":2,"score":0.6,"name":"SymN_2","symPrefabName":"SymN_2.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"G7","symLevel":7,"id":2,"score":2.5,"name":"SymN_2","symPrefabName":"SymN_2.prefab","type":"mainSymbol","performanceTime":0.05},
                        {"token":"G8","symLevel":8,"id":2,"score":7.5,"name":"SymN_2","symPrefabName":"SymN_2.prefab","type":"mainSymbol","performanceTime":0.05},
                     
                     
                        {"token":"B1","symLevel":1,"id":3,"score":0.05,"name":"SymN_3","symPrefabName":"SymN_3.prefab","type":"mainSymbol","performanceTime":0.2},
                        {"token":"B2","symLevel":2,"id":3,"score":0.1,"name":"SymN_3","symPrefabName":"SymN_3.prefab","type":"mainSymbol","performanceTime":0.2},
                        {"token":"B3","symLevel":3,"id":3,"score":0.15,"name":"SymN_3","symPrefabName":"SymN_3.prefab","type":"mainSymbol","performanceTime":0.2},
                        {"token":"B4","symLevel":4,"id":3,"score":0.2,"name":"SymN_3","symPrefabName":"SymN_3.prefab","type":"mainSymbol","performanceTime":0.20},
                        {"token":"B5","symLevel":5,"id":3,"score":0.3,"name":"SymN_3","symPrefabName":"SymN_3.prefab","type":"mainSymbol","performanceTime":0.2},
                        {"token":"B6","symLevel":6,"id":3,"score":0.5,"name":"SymN_3","symPrefabName":"SymN_3.prefab","type":"mainSymbol","performanceTime":0.2},
                        {"token":"B7","symLevel":7,"id":3,"score":2.0,"name":"SymN_3","symPrefabName":"SymN_3.prefab","type":"mainSymbol","performanceTime":0.2},
                        {"token":"B8","symLevel":8,"id":3,"score":5.0,"name":"SymN_3","symPrefabName":"SymN_3.prefab","type":"mainSymbol","performanceTime":0.2},
                        {"token":"Rc","symLevel":0,"id":4,"score":0,"name":"SymC_0","symPrefabName":"SymC_0.prefab","type":"character","performanceTime":0.2},
                        {"token":"Yc","symLevel":0,"id":5,"score":0,"name":"SymC_1","symPrefabName":"SymC_1.prefab","type":"character","performanceTime":0.2},
                        {"token":"Gc","symLevel":0,"id":6,"score":0,"name":"SymC_2","symPrefabName":"SymC_2.prefab","type":"character","performanceTime":0.2},
                        {"token":"Bc","symLevel":0,"id":7,"score":0,"name":"SymC_3","symPrefabName":"SymC_3.prefab","type":"character","performanceTime":0.2},
                        {"token":"Tb","symLevel":0,"id":8,"score":0,"name":"SymS_0","symPrefabName":"SymS_0.prefab","type":"featureSymbol","performanceTime":1.2},//3
                        {"token":"Bs","symLevel":0,"id":9,"score":0,"name":"SymS_1","symPrefabName":"SymS_1.prefab","type":"featureSymbol","performanceTime":1},//1.6
                        {"token":"Eb","symLevel":0,"id":10,"score":0,"name":"SymS_2","symPrefabName":"SymS_2.prefab","type":"featureSymbol","performanceTime":1.9},//1.9
                        {"token":"Wd","symLevel":0,"id":11,"score":0,"name":"SymS_3","symPrefabName":"SymS_3.prefab","type":"wildSymbol","performanceTime":1.6},//0
                        {"token":"Lu","symLevel":0,"id":12,"score":0,"name":"SymS_4","symPrefabName":"SymS_4.prefab","type":"featureSymbol","performanceTime":2.5},//1
                    
                        {"token":"Rt","symLevel":0,"id":99,"score":0,"type":"bonus_character","performanceTime":0},
                    
                        {"token":"2x","symLevel":0,"id":101,"score":2,"type":"secFloor_winSymbol","performanceTime":0},
                        {"token":"5x","symLevel":0,"id":102,"score":5,"type":"secFloor_winSymbol","performanceTime":0},
                        {"token":"10x","symLevel":0,"id":103,"score":10,"type":"secFloor_winSymbol","performanceTime":0},
                        {"token":"15x","symLevel":0,"id":104,"score":15,"type":"secFloor_winSymbol","performanceTime":0},
                        {"token":"25x","symLevel":0,"id":105,"score":25,"type":"secFloor_winSymbol","performanceTime":0},
                        {"token":"50x","symLevel":0,"id":106,"score":50,"type":"secFloor_winSymbol","performanceTime":0},
                        {"token":"100x","symLevel":0,"id":107,"score":100,"type":"secFloor_winSymbol","performanceTime":0},
                        {"token":"500x","symLevel":0,"id":108,"score":500,"type":"secFloor_winSymbol","performanceTime":0},
                        {"token":"1000x","symLevel":0,"id":109,"score":1000,"type":"secFloor_winSymbol","performanceTime":0},
                        {"token":"maxWin","symLevel":0,"id":199,"score":10000,"type":"secFloor_winSymbol","performanceTime":0},
                    
                    
                        {"token":"L1","symLevel":0,"id":201,"score":0,"type":"","performanceTime":0},
                        {"token":"L2","symLevel":0,"id":202,"score":0,"type":"","performanceTime":0},
                        {"token":"L3","symLevel":0,"id":203,"score":0,"type":"","performanceTime":0},
                        {"token":"L4","symLevel":0,"id":204,"score":0,"type":"","performanceTime":0},
                    
                        {"token":"HO","symLevel":0,"id":302,"score":0,"type":"secFloor_eventSymbol","performanceTime":0},
                    
                        {"token":"E_","symLevel":0,"id":555,"score":0,"type":"empty","performanceTime":0},

                        {"token":"NL","symLevel":0,"id":0,"score":0,"type":"secFloor_eventSymbol","performanceTime":0},
                    
                        {"token":"2-","symLevel":0,"id":1,"score":2,"type":"secFloor_eventSymbol","performanceTime":0},
                        {"token":"2-","symLevel":0,"id":2,"score":5,"type":"secFloor_eventSymbol","performanceTime":0},
                        {"token":"2-","symLevel":0,"id":3,"score":10,"type":"secFloor_eventSymbol","performanceTime":0},
                    
                        {"token":"3-","symLevel":0,"id":4,"score":15,"type":"secFloor_eventSymbol","performanceTime":0},
                        {"token":"3-","symLevel":0,"id":5,"score":25,"type":"secFloor_eventSymbol","performanceTime":0},
                        {"token":"3-","symLevel":0,"id":6,"score":50,"type":"secFloor_eventSymbol","performanceTime":0},
                    
                        {"token":"4-","symLevel":0,"id":7,"score":100,"type":"secFloor_eventSymbol","performanceTime":0},
                        {"token":"4-","symLevel":0,"id":8,"score":500,"type":"secFloor_eventSymbol","performanceTime":0},
                        {"token":"4-","symLevel":0,"id":9,"score":1000,"type":"secFloor_eventSymbol","performanceTime":0},
                    
                        {"token":"MW","symLevel":0,"id":10,"score":10000,"type":"secFloor_eventSymbol","performanceTime":0},
                    
                        {"token":"St","symLevel":0,"id":999,"score":0,"type":"","performanceTime":0}
                    ],



            chanceCardData:[
                {"chanceCardName":"SWAP","eventIndex":0,},
                {"chanceCardName":"REFRESH","eventIndex":1},
                {"chanceCardName":"WILD","eventIndex":2}
                ],

            symLevelUpRef:[
              {"colorAwardID":0,"catName":"SymC_0","catID":4,"refTokens":["R1","R2","R3","R4","R5","R6","R7","R8"]},
              {"colorAwardID":1,"catName":"SymC_1","catID":5,"refTokens":["Y1","Y2","Y3","Y4","Y5","Y6","Y7","Y8"]},
              {"colorAwardID":2,"catName":"SymC_2","catID":6,"refTokens":["G1","G2","G3","G4","G5","G6","G7","G8"]},
              {"colorAwardID":3,"catName":"SymC_3","catID":7,"refTokens":["B1","B2","B3","B4","B5","B6","B7","B8"]},


            ],

            catMoveProcessTagKeyB : {
                      "RED_CAT_MOVED":0,
                      "YELLOW_CAT_MOVED":1,
                      "GREEN_CAT_MOVED":2,
                      "BLUE_CAT_MOVED":3
                   
              
                    },
            bonusRatMoveTag:[
                "RAT_HOLE_REVEAL",
                "RAT_START",
                "RAT_MOVED",
                "RAT_KILLED"
                ],
                
            catMoveProcessTag: [
                        "RED_CAT_MOVE",
                        "YELLOW_CAT_MOVE",
                        "GREEN_CAT_MOVE",
                        "BLUE_CAT_MOVE"
                
                    ],
                
            eventTagInitial : {
                      "NEW_SPIN":"NEW_SPIN",
                      "RED_CAT_MOVE":"MOVE",
                      "YELLOW_CAT_MOVE":"MOVE",
                      "GREEN_CAT_MOVE":"MOVE",
                      "BLUE_CAT_MOVE":"MOVE",
                      "INIT":"INIT",
                      "DROP":"DROP",
                      "MOVE_DROP_END":"END"
                
                  },


            processStepDivTagB : [
                      "INIT",
                      "FILL",
                      "CHANCE_CARD_REVEAL",
                      "TRIGGER_NEXT_LEVEL",
                      "TRIGGER_NEW_BONUS",
                      "MOVE_DROP_END"

                      ],
                        
                
          
            newRoundEventTagB : [
                      "INIT",
                      
                      "CHANCE_CARD_REVEAL",
                      "TRIGGER_NEXT_LEVEL",
                      "TRIGGER_NEW_BONUS",
                     // "FINAL"
                  ],
              
                
    
            newStepEventTagB : [
                      "INIT",
                      //"DROP",
                      "FILL",
                      "CHANCE_CARD_REVEAL",
                      "TRIGGER_NEXT_LEVEL",
                      "TRIGGER_NEW_BONUS",
                  ],
            lineEventTag:{
                      "CHANCE_CARD_REVEAL":"chanceCard",
                      "TRIGGER_NEXT_LEVEL":"sceneLevelUp" ,
                      //"TRIGGER_NEW_BONUS":"bonusGame"
            }     
                  
                  
                  
                  
};
