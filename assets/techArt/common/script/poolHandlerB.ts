import { NodePool,instantiate,Node,Prefab,resources } from 'cc';
import {assetData} from '../../../inputData/asset_data';

/**
 * @api {class} poolHandler prefab節點創建回收
 * @apiName poolHandler
 * @apiGroup data
 * @apiDescription prefab節點創建回收
 */

/* 生成symbolNode物件池內容 */
export default class poolHandler {
    private poolTable:Map<string,NodePool>=null; //建立一個在緩存區的數據庫
    /**取得 */
    public get(pre:Prefab):Node{
        if( this.poolTable === null){
            this.poolTable = new Map([[pre.name,new NodePool()]]);
        }
        let pool = this.poolTable.get(pre.name);
        if( pool === undefined ){
            this.poolTable.set(pre.name,new NodePool());
            pool = this.poolTable.get(pre.name);
        }
        if( pool.size() > 0){
            return pool.get();
        }else{
            pool.put(instantiate(pre));
        }
        return pool.get();
    }

    public getByName(symName:string):Node{
        let symbolData = assetData.symbolData
        
        if( this.poolTable === null){
            this.poolTable = new Map([[symName,new NodePool(symName)]]);
        }
        let pool = this.poolTable.get(symName);
        if( pool === undefined ){
            this.poolTable.set(symName,new NodePool(symName));
            pool = this.poolTable.get(symName);
        }
        if( pool.size() > 0){
            return pool.get();
        }else{

               let url:string =  symbolData.filter(e => e.name === symName)[0].url + "/"+ symName
               console.log('selSymPrefab______00000',url,this)
               let newNode = null

                resources.load(url, Prefab, (err, prefab) => {
                    //pool = this.poolTable.get(symName)
                    pool.put(instantiate(prefab));  
                    //return pool.get();
                    console.log('selSymPrefab______22222',pool)   
                })
                //console.log('selSymPrefab______22222',prefab)        
                //pool.put(instantiate(selSymPrefab));  

        }
        //console.log('selSymPrefab______22222',resources)
       return pool.get();
    }



    /**退還 */
    public put = async (node:Node,timeout:number) => {
        if( this.poolTable === null){
            return;
        } 
        let pool = this.poolTable.get(node.name);

        if( pool === null ){
            return;
        }
        //pool.put(node);
        await this.poolPut(pool,node,timeout)
    };

    public destroy():void{
        for( let tab in this.poolTable){
            let pool = this.poolTable.get(tab);
            pool.clear();
        }
        this.poolTable.clear();
        this.poolTable = null;
    }


    public  async  poolPut(pool:any,node:any,timeout:number){ 
        return new Promise(resolve => { 
            setTimeout(() => {
                
                pool.put(node)
    
            resolve('')
    
            },timeout*1000)
        })
    };
    public putB = (node:Node) => {
        if( this.poolTable === null){
            return;
        } 
        let pool = this.poolTable.get(node.name);

        if( pool === null ){
            return;
        }
        pool.put(node);
       // poolPutB(pool,node)
    };



}