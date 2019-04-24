import React from 'react'

import { bindActionCreators } from 'redux' 
import { connect } from 'react-redux' 
 
import * as swgControlActions   from '../actions/swgControlActions' 
import * as authActions         from '../actions/authActions' 

import * as appMenuActions      from '../actions/appMenuActions' 

import { withStyles } from '@material-ui/core/styles'
import withRoot from './withRoot'

import { SwgControl, AuthWin, AppMenuTop }  from '../components/asterisk-ws-react-components'



const styles = theme => ({
  divTop: {
    flexGrow: 1,
    padding: 0,
  },
  topSpace: {
    paddingTop: theme.spacing.unit * 10,
  },
})
 
 
 
class Cnt_connectAndAuth extends React.Component { 
  render() { 
    console.log('Cnt_connectAndAuth render')
    const {
      classes,
      specUrl,
      swgControlRdcr, swgControlActions,
      authRdcr, authActions,
      appMenuRdcr, appMenuActions
    } = this.props
 
    // Всякое намэпленое в результате connect() лежит в this.props

    // Вытаскиваем из REDUX state -> swgControlRdcr : свойство swgClient
    // Его туда заполнил swgControlActions.swgConnectAct в компоненте SwgControl.jsx
    const swgClient      = swgControlRdcr.swgClient

    // 1) Если API отдает message === 'token Unauthorized': все контейнеры делают dispatch AUTH_TOKEN_DISPLAY_BLK (authRdcr.displayBlock = true)
    // 2) Если первый вход: localStorage 'token' пустой. Так же реализован выход пользователя в UserProfile.jsx 
    const tokenUnauthorized = (authRdcr.displayBlock || !window.localStorage.getItem('token'))
  
    return (
    <div className={classes.divTop}>
      
      <SwgControl
        headerTxt         ='связь с сервером'
        specUrl           ={specUrl}        

        swgControlActions ={swgControlActions}

        swgControlRdcr    ={swgControlRdcr}
      />
      <AppMenuTop
        headerTxt         ='Start'
        swgClient         ={swgClient}

        appMenuActions    ={appMenuActions}
        authActions       ={authActions}

        swgControlRdcr    ={swgControlRdcr}
        appMenuRdcr       ={appMenuRdcr}
        authRdcr          ={authRdcr}
      />

      <div className={ tokenUnauthorized || appMenuRdcr.itemSelected === 'Сменить пользователя' ? classes.topSpace : 'display-none'}>
        <AuthWin
          headerTxt       ='Вы не авторизованы'
          swgClient       ={swgClient}

          authActions     ={authActions}

          authRdcr        ={authRdcr}
        />
      </div>
    </div>)
  }
} 
 
 
 
 
 
 
 
 
 
// Редьюсеры уже лежат в Store через RootReducer 
// Мэпим их из Redux Store в React-компоненту Connect(Cnt_connectAndAuth) 
function mapStateToProps (state) { 
  //console.log(state) 
  return { 
    'specUrl':        window.localStorage.getItem('apiUrl')+'/spec/swagger.json', 
    'swgControlRdcr': state.swgControlRdcr, 
    'authRdcr':       state.authRdcr,

    'appMenuRdcr':    state.appMenuRdcr 
  } 
} 
 
// Мэпим Redux (actions --> Store:dispatch) через процедуру bindActionCreators в React-компоненту Connect(Cnt_connectAndAuth) 
function mapDispatchToProps(dispatch) { 
  return { 
    'swgControlActions':  bindActionCreators(swgControlActions, dispatch), 
    'authActions':        bindActionCreators(authActions, dispatch),

    'appMenuActions':     bindActionCreators(appMenuActions, dispatch) 
  } 
} 
 
// Мэп и коннект: <Cnt_connectAndAuth> --> <Connect(Cnt_connectAndAuth)> 
export default connect(mapStateToProps, mapDispatchToProps)( withRoot( withStyles(styles)(Cnt_connectAndAuth) ) ) 
