import * as ex from 'excalibur'
import { Ground } from './ground'
import { Pipe } from './pipe'
import { Level } from './level'
import { Config } from './config'
import { Resources } from './resources'

export class Bird extends ex.Actor {
  jumping = false
  playing = false
  startSprite!: ex.Sprite
  upAnimation!: ex.Animation
  downAnimation!: ex.Animation

  constructor (private level: Level) {
    super({
      pos: Config.BirdStartPos,
      // width: 16,
      // height: 16,
      radius: 8,
      color: ex.Color.Yellow
    })
  }

  override onInitialize (engine: ex.Engine): void {
    const spriteSheet = ex.SpriteSheet.fromImageSource({
      image: Resources.BirdImage,
      grid: {
        rows: 1,
        columns: 4,
        spriteWidth: 32,
        spriteHeight: 32
      }
    })

    this.startSprite = spriteSheet.getSprite(1, 0)
    this.upAnimation = ex.Animation.fromSpriteSheet(
      spriteSheet,
      [2, 1, 0],
      150,
      ex.AnimationStrategy.Freeze
    )

    this.downAnimation = ex.Animation.fromSpriteSheet(
      spriteSheet,
      [0, 1, 2],
      150,
      ex.AnimationStrategy.Freeze
    )

    //register
    this.graphics.add('down', this.downAnimation)
    this.graphics.add('up', this.upAnimation)
    this.graphics.add('start', this.startSprite)

    this.graphics.use('start')

    this.acc = ex.vec(0, 1200)
    this.on('enterviewport', () => {
      this.level.triggerGameOver()
    })
  }

  private isInputActive (engine: ex.Engine) {
    return (
      engine.input.keyboard.isHeld(ex.Keys.Space) ||
      engine.input.pointers.isDown(0)
    )
  }

  override onPostUpdate (engine: ex.Engine, elapsed: number): void {
    if (!this.playing) return

    if (!this.jumping && this.isInputActive(engine)) {
      this.vel.y += Config.BirdJumpVelocity
      this.jumping = true
      this.graphics.use('up')

      this.upAnimation.reset()
      this.downAnimation.reset()

      Resources.FlapSound.play()
    }

    if (!this.isInputActive(engine)) {
      this.jumping = false
    }

    this.vel.y = ex.clamp(
      this.vel.y,
      Config.BirdMinVelocity,
      Config.BirdMaxVelocity
    )

    this.rotation = ex.vec(Config.PipeSpeed, this.vel.y).toAngle()

    if (this.vel.y > 0) {
      this.graphics.use('down')
    }
  }

  start () {
    //TODO no implement yet!
    this.playing = true
    this.pos = Config.BirdStartPos
    this.acc = ex.vec(0, Config.BirdAcceleration)
  }

  reset () {
    this.pos = Config.BirdStartPos
    this.stop()
  }

  stop () {
    this.playing = false
    this.vel = ex.vec(0, 0)
    this.acc = ex.vec(0, 0)
  }

  override onCollisionStart (
    self: ex.Collider,
    other: ex.Collider,
    side: ex.Side,
    contact: ex.CollisionContact
  ): void {
    if (other.owner instanceof Ground || other.owner instanceof Pipe) {
      this.level.triggerGameOver()
    }
  }
}
