'use strict'

import React from 'react';
import ReactDOM from 'react-dom'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App_swgControlCnt from './containers/swgControlCnt'
import configureStore from './store/configureStore'

const store = configureStore()


ReactDOM.render(
  <Provider store={store}>
    <App_swgControlCnt />
  </Provider>,
  document.getElementById('root')
)
