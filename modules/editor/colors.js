export const colors = {
  white: 0xFFFFFF,
  black: 0x000000,
  hover: 0xEDEDED,
  disabled: 0xA5A5A5,
  selected: 0x96FF96,
  menu: 0xF0F0F0,
  menuBorder: 0xBFBFBF,
  blue: 0x4B9DF8
}

export function getTileColor (l, c) {
  let color = window.Store.state.board.disabledTiles.indexOf(`${l}:${c}`) >= 0
    ? 'disabled'
    : window.Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0
      ? 'selected'
      : 'white'

  return colors[color]
}

export function getTileAlpha (l, c) {
  let alpha = window.Store.state.board.disabledTiles.indexOf(`${l}:${c}`) >= 0
    ? 0.5
    : window.Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0
      ? 0.3
      : 0.1

  return alpha
}
