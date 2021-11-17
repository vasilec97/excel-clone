import {range} from "@core/utils";
import {defaultStyles} from "@/constants";

export function shouldResize(e) {
  return e.target.dataset.resize
}

export function isCell(e) {
  return e.target.dataset.type === 'cell'
}

export function matrix($target, $current) {
  const target = $target.id(true)
  const current = $current.id(true)

  const cols = range(current.col, target.col)
  const rows = range(current.row, target.row)

  return cols.reduce((acc, col) => {
    rows.forEach(row => acc.push(`${row}:${col}`))
    return acc
  }, [])
}

export function getKey(e) {
  const keys = ['ArrowDown', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'Tab', 'Enter']

  return keys.includes(e.key)
}

export function nextSelector(key, {row, col}) {
  switch(key) {
    case 'Enter':
    case 'ArrowDown':
      row++
      break
    case 'Tab':
    case 'ArrowRight':
      col++
      break
    case 'ArrowLeft':
      col--
      break
    case 'ArrowUp':
      row--
      break
  }

  return `[data-id="${row}:${col}"]`
}