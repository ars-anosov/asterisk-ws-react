import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as swgControlActions   from '../actions/swgControlActions'
import * as authActions         from '../actions/authActions'

import { SwgControl, AuthWin }  from '../components/asterisk-ws-react-components'




// App
class App extends React.Component {
  render() {
    console.log('App render')

    // Всякое намэпленое в результате connect()
    const { specUrl, liveUrl }    = this.props
    // swgControl
    const { swgControlRdcr }      = this.props

    return <div>

      <SwgControl   specUrl={specUrl} swgConnectAct={this.props.swgControlActions.swgConnectAct} swgControlRdcr={swgControlRdcr} headerTxt='SwgControl component' />

      {/*
        1) Если API отдает message === 'token Unauthorized': все компоненты делают dispatch AUTH_TOKEN_DISPLAY_BLK
        2) Если первый вход: localStorage 'token' пустой. Так же реализован выход пользователя в UserProfile.jsx
        Результат проверки в div-обертке
      */}
      
      {/* div-обертка 1 */}
      <div className={(this.props.authRdcr.displayBlock || !window.localStorage.getItem('token') ) ? '' : 'display-none'}>
        <AuthWin      swgClient={swgControlRdcr.swgClient}                        authRdcr={this.props.authRdcr}          authActions={this.props.authActions}          headerTxt='Авторизация' />
      </div>

      {/* div-обертка 2 */}
      <div className={ (this.props.authRdcr.displayBlock || !window.localStorage.getItem('token') ) ? 'display-none' : ''}>
        <pre>Inside</pre>
      </div>

    </div>
  }
}









// Редьюсеры уже лежат в Store через RootReducer
// Мэпим их из Redux Store в React-компоненту Connect(App)
function mapStateToProps (state) {
  //console.log(state)
  return {
    'specUrl':        window.localStorage.getItem('specUrl'),
    'liveUrl':        window.localStorage.getItem('liveUrl'),
    'swgControlRdcr': state.swgControlRdcr,
    'authRdcr':       state.authRdcr
  }
}

// Мэпим Redux (actions --> Store:dispatch) через процедуру bindActionCreators в React-компоненту Connect(App)
function mapDispatchToProps(dispatch) {
  return {
    'swgControlActions':  bindActionCreators(swgControlActions, dispatch),
    'authActions':        bindActionCreators(authActions, dispatch)
  }
}

// Мэп и коннект: <App> --> <Connect(App)>
export default connect(mapStateToProps, mapDispatchToProps)(App)
