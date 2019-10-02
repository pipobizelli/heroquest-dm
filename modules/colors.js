export const colors = {
  white: 0xFFFFFF,
  black: 0x000000,
  lightGray: 0xEDEDED,
  gray: 0xA5A5A5,
  darkGray: 0x7C7C7C,
  green: 0x96FF96,
  darkGreen: 0x509050,
  menu: 0xF0F0F0,
  menuBorder: 0xBFBFBF,
  blue: 0x4B9DF8
}

export function getTileColor (label, hover = '') {
  const state = window.Store.state.board.disabledTiles.indexOf(label) >= 0
    ? window.Store.state.board.selectedTiles.indexOf(label) >= 0
      ? 'disabledSelected'
      : 'disabled'
    : window.Store.state.board.selectedTiles.indexOf(label) >= 0
      ? 'selected'
      : 'iddle'

  let color = 'white'
  switch (state) {
    case 'disabled':
      color = hover !== '' ? 'darkGray' : 'gray'
      break
    case 'selected':
      color = 'green'
      break
    case 'disabledSelected':
      color = 'darkGreen'
      break
    default:
      color = hover !== '' ? 'lightGray' : 'white'
  }

  return colors[color]
}
