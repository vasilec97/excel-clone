import {ExcelComponent} from '@core/ExcelComponent'
import {createTable} from '@/components/table/table.template'
import {resizeHandler} from "@/components/table/table.resize"
import {getKey, matrix, nextSelector, shouldResize} from "@/components/table/table.function"
import {TableSelection} from "@/components/table/TableSelection"
import {isCell} from "@/components/table/table.function";
import {$} from "@core/dom";
import * as actions from '@/redux/actions'
import {defaultStyles} from "@/constants";
import {normalizeStyles} from './table.function'

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, options) {
    super($root, {
      name: 'Table',
      listeners: ['mousedown', 'keydown', 'input'],
      ...options,
    })
  }

  toHTML() {
    return createTable(20, this.store.getState())
  }

  prepare() {
    this.selection = new TableSelection()
  }

  init() {
    super.init()

    this.selectCell(this.$root.find('[data-id="0:0"]'))

    this.$on('formula:input', text => {
      this.selection.current.text(text)
      this.updateTextInStore(text)
    })
    this.$on('formula:done', () => {
      this.selection.current.focus()
    })

    this.$on('toolbar:applyStyle', value => {
      this.selection.applyStyle(value)
      this.$dispatch(actions.applyStyle({
        value,
        ids: this.selection.selectedIds
      }))
    })
  }

  selectCell($cell) {
    this.selection.select($cell)
    this.$emit('table:select', $cell)
    const styles = $cell.getStyles(Object.keys(defaultStyles))
    this.$dispatch(actions.changeStyles(styles))
  }

  async resizeTable(e) {
    try {
      const data = await resizeHandler(this.$root, e)
      this.$dispatch(actions.tableResize(data, e))
    } catch(e) {
      console.warn('Resize message')
    }

  }

  onMousedown(e) {
    if (shouldResize(e)) {
      this.resizeTable(e)
    } else if (isCell(e)) {
      const $target = $(e.target)
      if (e.shiftKey) {
        const $cells = matrix($target, this.selection.current)
          .map(id => this.$root.find(`[data-id="${id}"]`))
        this.selection.selectGroup($cells)
      } else {
        this.selectCell($target)
      }
    }
  }

  onKeydown(e) {
    if (getKey(e) && !e.shiftKey) {
      e.preventDefault()
      const id = this.selection.current.id(':')
      const $next = this.$root.find(nextSelector(e.key, id))
      if ($next.$el) {
        this.selectCell($next)
      }
    }
  }

  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value
    }))
  }

  onInput(e) {
    this.updateTextInStore($(e.target).text())
  }
}


