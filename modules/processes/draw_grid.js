import Config from '@@/config/env'
export default async function (canvasApp) {
  const PIXI = await import('pixi.js')
  const grid = PIXI.Sprite.from(`${Config.paths.images}boardmap.png?alt=media`)
  canvasApp.stage.addChild(grid)
}
