import {Excel} from '@/components/excel/Excel'
import {Header} from '@/components/header/Header'
import {Toolbar} from '@/components/toolbar/Toolbar'
import {Table} from '@/components/table/Table'
import {Formula} from '@/components/formula/Formula'
import {createStore} from "@core/createStore"
import './scss/index.scss'
import {rootReducer} from "@/redux/rootReducer"
import {storage, debounce} from "@core/utils";
import {initialState} from "@/redux/initialState"

const store = createStore(rootReducer, initialState)

const stateListener = debounce(state => {
  storage('excel-state', state)
  console.log('App state:', state)
}, 300)

store.subscribe(stateListener)

const excel = new Excel('#app', {
  components: [Header, Toolbar, Formula, Table],
  store
})

excel.render()
