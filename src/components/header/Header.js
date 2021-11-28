import {ExcelComponent} from '@core/ExcelComponent'
import * as actions from '@/redux/actions'
import {$} from '@core/dom'
import {defaultTitle} from '@/constants'
import {debounce} from '@core/utils'
import {ActiveRoute} from '@core/routes/ActiveRoute'

export class Header extends ExcelComponent{
  static className = 'excel__header'

  constructor($root, options) {
    super($root, {
      name: 'Header',
      listeners: ['input', 'click'],
      subscribe: ['headerInput'],
      ...options,
    })
  }

  prepare() {
    this.onInput = debounce(this.onInput, 300)
  }

  toHTML() {
    const title = this.store.getState().title || defaultTitle
    return `
      <input type="text" class="input" value="${title}" />
  
      <div>
        <div class="button" data-id="remove">
          <i class="material-icons" data-id="remove">delete</i>
        </div>
        <div class="button" data-id="exit">
          <i class="material-icons" data-id="exit">exit_to_app</i>
        </div>
      </div>
    `
  }

  onClick(e) {
    const target = $(e.target)

    switch (target.data.id) {
      case 'remove':
        const decision = confirm('Вы действительно хотите удалить эту таблицу?')
        
        if (decision) {
          localStorage.removeItem('excel:' + ActiveRoute.param)
          ActiveRoute.navigate('')
        } 
        
        break
      case 'exit':
        ActiveRoute.navigate('')
        break
    }
  }

  onInput(e) {
    const $input = $(e.target)
    this.$dispatch(actions.changeTitle($input.text()))
  }
}