import { _decorator, Component, Node, ParticleSystem } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('particleContro_TA')
export class particleContro_TA extends Component {
    @property({type: [ParticleSystem], tooltip:'指定要控制的粒子特效'})
    particle: ParticleSystem[] = [];

    /* 啟動/關閉粒子特效 */
    enableParticle(particleID: number, enable: boolean) {
        this.particle[particleID].enabled = enable;
    }

    /* 調整粒子尺寸 */
    particleSize(particleID: number, sizeMin: number, sizeMax: number) {
        this.particle[particleID].startSizeX.constantMin = sizeMin;
        this.particle[particleID].startSizeX.constantMin = sizeMax;
    }

    /* 調整粒子序列貼圖播放速度 */
    TextureAnimationSpeed(particleID: number, Speed: number) {
        this.particle[particleID].textureAnimationModule.cycleCount = Speed;
    }
}


