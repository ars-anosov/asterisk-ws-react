'use strict'

import React from 'react';
import ReactDOM from 'react-dom'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import configureStore from './store/configureStore'

import Cnt_connectAndAuth from './containers/Cnt_connectAndAuth'
import Cnt_callPopup from './containers/Cnt_callPopup'


const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Cnt_connectAndAuth />
    <Cnt_callPopup />
  </Provider>,
  document.getElementById('root')
)
