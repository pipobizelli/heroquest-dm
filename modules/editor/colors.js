export const colors = {
  iddle: 0xFFFFFF,
  hover: 0xEDEDED,
  disabled: 0xA5A5A5,
  selected: 0x96FF96,
  menu: 0xF0F0F0
}

export function getTileColor (l, c) {
  let color = window.Store.state.board.disabledTiles.indexOf(`${l}:${c}`) >= 0
    ? 'disabled'
    : window.Store.state.board.selectedTiles.indexOf(`${l}:${c}`) >= 0
      ? 'selected'
      : 'iddle'

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
