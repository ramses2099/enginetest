import * as ex from 'excalibur'
import { ImageSource, Loader } from 'excalibur'

// It is convenient to put your resources in one place
export const Resources = {
  Sword: new ImageSource('./images/sword.png'),
  BirdImage: new ImageSource('./images/bird.png'),
  PipeImage: new ImageSource('./images/pipe.png', {
    wrapping: ex.ImageWrapping.Clamp
  }),
  GroundImage: new ImageSource('./images/ground.png', {
    wrapping: ex.ImageWrapping.Repeat
  }),
  FlapSound: new ex.Sound('./sounds/flap.wav'),
  FailSound: new ex.Sound('./sounds/fail.wav'),
  ScoreSound: new ex.Sound('./sounds/score.wav'),
  // Music
  BackgroundMusic: new ex.Sound('./sounds/two_left_socks.ogg')
  // Vite public/ directory serves the root images
} as const // the 'as const' is a neat typescript trick to get strong typing on your resources.
// So when you type Resources.Sword -> ImageSource

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader()
for (const res of Object.values(Resources)) {
  loader.addResource(res)
}
