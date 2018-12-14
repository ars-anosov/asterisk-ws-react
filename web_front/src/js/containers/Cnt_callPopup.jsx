import React from 'react' 
import { bindActionCreators } from 'redux' 
import { connect } from 'react-redux' 
 
//import * as authActions         from '../actions/authActions' 
 
//import { SwgControl, AuthWin }  from '../components/asterisk-ws-react-components' 
 
 
 
 
// Cnt_callPopup 
class Cnt_callPopup extends React.Component { 
  render() { 
    console.log('Cnt_callPopup render') 
 
    const swgClient      = this.props.swgControlRdcr.swgClient 
 
    return <div> 
 
      {/* div-обертка (авторизован) */} 
      <div className={ (this.props.authRdcr.displayBlock || !window.localStorage.getItem('token') ) ? 'display-none' : ''}> 
        <pre>Inside 2</pre> 
      </div> 
 
    </div> 
  } 
} 
 
 
 
 
 
 
 
 
 
// Редьюсеры уже лежат в Store через RootReducer 
// Мэпим их из Redux Store в React-компоненту Connect(Cnt_callPopup) 
function mapStateToProps (state) { 
  //console.log(state) 
  return { 
    'swgControlRdcr': state.swgControlRdcr, // это надо чтобы обращаться к Swagger (нужен объект swgClient)
    'authRdcr':       state.authRdcr        // это надо чтобы проверять авторизован ли пользователь (показано ли окно от authRdcr)  
  } 
} 
 
// Мэпим Redux (actions --> Store:dispatch) через процедуру bindActionCreators в React-компоненту Connect(Cnt_callPopup) 
function mapDispatchToProps(dispatch) { 
  return { 
//    'authActions':        bindActionCreators(authActions, dispatch) 
  } 
} 
 
// Мэп и коннект: <Cnt_callPopup> --> <Connect(Cnt_callPopup)> 
export default connect(mapStateToProps, mapDispatchToProps)(Cnt_callPopup) 
