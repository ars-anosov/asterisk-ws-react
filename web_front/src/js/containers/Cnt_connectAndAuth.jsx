import React from 'react' 
import { bindActionCreators } from 'redux' 
import { connect } from 'react-redux' 
 
import * as swgControlActions   from '../actions/swgControlActions' 
import * as authActions         from '../actions/authActions' 
 
import { SwgControl, AuthWin }  from '../components/asterisk-ws-react-components' 
 
 
 
 
// Cnt_connectAndAuth 
class Cnt_connectAndAuth extends React.Component { 
  render() { 
    console.log('Cnt_connectAndAuth render') 
 
    // Всякое намэпленое в результате connect() лежит в this.props

    // Вытаскиваем из REDUX state -> swgControlRdcr : свойство swgClient
    // Его туда заполнил swgControlActions.swgConnectAct в компоненте SwgControl.jsx
    const swgClient      = this.props.swgControlRdcr.swgClient 
 
    return <div> 
 
      <SwgControl     specUrl={this.props.specUrl}      swgControlRdcr={this.props.swgControlRdcr}      swgControlActions={this.props.swgControlActions} headerTxt='SwgControl component' /> 
 
      {/* 
        1) Если API отдает message === 'token Unauthorized': все компоненты делают dispatch AUTH_TOKEN_DISPLAY_BLK 
        2) Если первый вход: localStorage 'token' пустой. Так же реализован выход пользователя в UserProfile.jsx 
        Результат проверки в div-обертке 
      */} 
       
      {/* div-обертка 1 (не авторизован) */} 
      <div className={ (this.props.authRdcr.displayBlock || !window.localStorage.getItem('token') ) ? '' : 'display-none'}> 
        <AuthWin      swgClient={swgClient}              authRdcr={this.props.authRdcr}                 authActions={this.props.authActions}              headerTxt='Авторизация' /> 
      </div> 
 
      {/* div-обертка 2 (работаем) */} 
      <div className={ (this.props.authRdcr.displayBlock || !window.localStorage.getItem('token') ) ? 'display-none' : ''}> 
        <pre>Inside</pre> 
      </div> 
 
    </div> 
  } 
} 
 
 
 
 
 
 
 
 
 
// Редьюсеры уже лежат в Store через RootReducer 
// Мэпим их из Redux Store в React-компоненту Connect(Cnt_connectAndAuth) 
function mapStateToProps (state) { 
  //console.log(state) 
  return { 
    'specUrl':        window.localStorage.getItem('specUrl'), 
    'swgControlRdcr': state.swgControlRdcr, 
    'authRdcr':       state.authRdcr 
  } 
} 
 
// Мэпим Redux (actions --> Store:dispatch) через процедуру bindActionCreators в React-компоненту Connect(Cnt_connectAndAuth) 
function mapDispatchToProps(dispatch) { 
  return { 
    'swgControlActions':  bindActionCreators(swgControlActions, dispatch), 
    'authActions':        bindActionCreators(authActions, dispatch) 
  } 
} 
 
// Мэп и коннект: <Cnt_connectAndAuth> --> <Connect(Cnt_connectAndAuth)> 
export default connect(mapStateToProps, mapDispatchToProps)(Cnt_connectAndAuth) 
