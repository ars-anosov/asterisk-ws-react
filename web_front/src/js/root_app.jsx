'use strict'

import React from 'react';
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

import Cnt_appMenu from './containers/Cnt_appMenu'



const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Cnt_appMenu />
  </Provider>,
  document.getElementById('root')
)
