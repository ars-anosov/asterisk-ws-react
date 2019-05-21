'use strict'

import React      from 'react';
import ReactDOM   from 'react-dom'

import { Provider }   from 'react-redux'
import configureStore from './store/configureStore'

import Cnt_appMenu      from './containers/Cnt_appMenu'
import Cnt_hd           from './containers/Cnt_hd'
import Cnt_phone        from './containers/Cnt_phone'
import Cnt_monit        from './containers/Cnt_monit'



const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Cnt_appMenu />
    <Cnt_hd />
    <Cnt_phone />
    <Cnt_monit />
  </Provider>,
  document.getElementById('root')
)
