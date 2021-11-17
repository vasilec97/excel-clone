export function createStore(rootReducer, initialState = {}) {
  let state = rootReducer({...initialState}, {type: '__INIT__'})
  let listeners = []

  return {
    subscribe(fn) {
      listeners.push(fn)
      return {
        unsubscribe() {
          listeners = listeners.filter(l => l !== fn)
        }
      }
    },
    dispatch(action) {
      state = rootReducer(state, action)
      listeners.forEach(listener => listener(state))
    },
    getState() {
      return JSON.parse(JSON.stringify(state))
    }
  }
}

// Extra task - Переписать на класс


// export class Store {
//   constructor(rootReducer, initialState = {}) {
//     this._rootReducer = rootReducer
//     this.state = rootReducer(initialState, {type: '__INIT__'})
//     this.listeners = []
//   }
//
//   get rootReducer() {
//     return this._rootReducer
//   }
//
//   subscribe(fn) {
//     this.listeners.push(fn)
//     return {
//       unsubscribe: () => {
//         this.listeners = this.listeners.filter(listeners => listeners !== fn)
//       }
//     }
//   }
//
//   dispatch(action) {
//     this.state = this.rootReducer(state, action)
//     this.listeners.forEach(listener => listener(state))
//   }
//
//   getState() {
//     return this.state
//   }
// }