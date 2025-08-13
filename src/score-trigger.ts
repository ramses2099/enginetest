import * as ex from 'excalibur';
import { Level } from './level';
import { Config } from './config';
import { Resources } from './resources';

export class ScoreTrigger extends ex.Actor{
    constructor(pos: ex.Vector, private level: Level){
        super({pos: pos,
            width: 32,
            height: Config.PipeGap,
            anchor: ex.vec(0,0),
            vel: ex.vec(-Config.PipeSpeed, 0)
        });

        this.on('enterviewport', ()=>{
            this.kill();
        });

    }

    override onCollisionStart(self: ex.Collider, other: ex.Collider, side: ex.Side, contact: ex.CollisionContact): void {
        this.level.incrementScore();
        Resources.ScoreSound.play();
    }
}