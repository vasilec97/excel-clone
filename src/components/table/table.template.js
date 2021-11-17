import {toInlineStyles} from '@core/utils'
import {defaultStyles} from '@/constants'

const CODES = {
  A: 65,
  Z: 90
}

const DEFAULT_WIDTH = 120
const DEFAULT_HEIGHT = 24

function getWidth(index, state) {
  return (state[index] || DEFAULT_WIDTH) + 'px'
}

function getHeight(index, state) {
  return (state[index] || DEFAULT_HEIGHT) + 'px'
}

function getContent(id, state) {
  return state[id] || ''
}

function toCell(state, row) {
  return function(_, col) {
    const id = `${row}:${col}`
    const width = getWidth(col, state.colState)
    const content = getContent(id, state.dataState)
    const styles = toInlineStyles({
      ...defaultStyles,
      ...state.stylesState[id]
    })
    return `
      <div class="cell"
        contenteditable
        data-col="${col}"
        data-type="cell"
        data-id="${id}"
        style="${styles}; width: ${width}">
      ${content}  
      </div>
    `
  }
}

function toColumn({ col, index, width }) {
  return `
    <div class="column" 
      data-type="resizable" 
      data-col="${index}" 
      style="width: ${width}">
      ${col}
      <div class="col-resize" data-resize="col"></div>
    </div>
  `
}

function createRow(index, content, state) {
  const height = getHeight(index, state)
  const resize = index ? `<div class="row-resize" data-resize="row"></div>` : '';

  return `
    <div class="row" 
      data-type="resizable"
      data-row="${index}"
      style="height: ${height}">
      <div class="row-info">
        ${index}
        ${resize}
      </div>
      <div class="row-data">${content}</div>
    </div>
  `
}

function toChar(_, index) {
  return String.fromCharCode(CODES.A + index)
}

function withWidthFrom(state) {
  return function(col, index) {
    return {
      col, index, width: getWidth(index, state.colState)
    }
  }
}

export function createTable(rowsCount = 15, state = {}) {
  const colsCount = CODES.Z - CODES.A + 1
  const rows = []

  const cols = new Array(colsCount)
    .fill('')
    .map(toChar)
    .map(withWidthFrom(state))
    .map(toColumn)
    .join('')

  rows.push(createRow('', cols, {}))

  for (let row = 0; row < rowsCount; row++) {
    const cells = new Array(colsCount)
      .fill('')
      .map(toCell(state, row))
      .join('')
    rows.push(createRow(row + 1, cells, state.rowState))
  }

  return rows.join('')
}