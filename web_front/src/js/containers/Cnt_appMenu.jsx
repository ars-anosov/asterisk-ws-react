import React from 'react'

import { bindActionCreators } from 'redux' 
import { connect } from 'react-redux' 
 
import * as swgControlActions   from '../actions/swgControlActions'
import * as swgControlActions2   from '../actions/swgControlActions2'
import * as wsControlActions    from '../actions/wsControlActions' 
import * as authActions         from '../actions/authActions' 

import * as appMenuActions      from '../actions/appMenuActions' 

import { withStyles } from '@material-ui/core/styles'
import withRoot from './withRoot'

import { SwgControl, WsControl, AuthWin, AppMenuTop }  from '../components/asterisk-ws-react-components'



const styles = theme => ({
  divTop: {
    flexGrow: 1,
    padding: 0,
  },
  topSpace: {
    paddingTop: theme.spacing.unit * 10,
  },
})
 
 
 
class Cnt_appMenu extends React.Component { 
  render() { 
    console.log('Cnt_appMenu render')
    const {
      classes,
      specUrl, wsUrl,
      specUrl2,
      swgControlRdcr, swgControlActions,
      swgControlRdcr2, swgControlActions2,
      wsControlRdcr, wsControlActions,
      authRdcr, authActions,
      appMenuRdcr, appMenuActions
    } = this.props
 
    // Всякое намэпленое в результате connect() лежит в this.props

    // Вытаскиваем из REDUX state -> swgControlRdcr : свойство swgClient
    // Его туда заполнил swgControlActions.swgConnectAct в компоненте SwgControl.jsx
    const swgClient     = swgControlRdcr.swgClient
    const swgClient2     = swgControlRdcr2.swgClient
    const wsClient      = wsControlRdcr.wsClient

    // 1) Если API отдает message === 'token Unauthorized': все контейнеры делают dispatch AUTH_TOKEN_DISPLAY_BLK (authRdcr.displayBlock = true)
    // 2) Если первый вход: localStorage 'token' пустой. Так же реализован выход пользователя в UserProfile.jsx 
    const tokenUnauthorized = (authRdcr.displayBlock || !window.localStorage.getItem('token'))
  
    return (
    <div className={classes.divTop}>



      {/* Самостоятельные компоненты (прибиты position:absolute) */}
      <SwgControl
        headerTxt         ='API connector'
        specUrl           ={specUrl}        

        swgControlActions ={swgControlActions}
        swgControlRdcr    ={swgControlRdcr}
      />

      <SwgControl
        headerTxt         ='API connector2'
        specUrl           ={specUrl2}        

        swgControlActions ={swgControlActions2}
        swgControlRdcr    ={swgControlRdcr2}
      />

      <WsControl
        headerTxt         ='WS connector'
        wsUrl             ={wsUrl}        

        wsControlActions ={wsControlActions}
        wsControlRdcr    ={wsControlRdcr}
      />



      {/* Верхняя менюшка material-ui : AppBar, Toolbar */}
      <AppMenuTop
        headerTxt         ='Start'
        swgClient         ={swgClient}

        appMenuActions    ={appMenuActions}
        authActions       ={authActions}

        swgControlRdcr    ={swgControlRdcr}
        wsControlRdcr    ={wsControlRdcr}

        appMenuRdcr       ={appMenuRdcr}
        authRdcr          ={authRdcr}
      />



      {/* На случай если человек не авторизован */}
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
// Мэпим их из Redux Store в React-компоненту Connect(Cnt_appMenu) 
function mapStateToProps (state) { 
  //console.log(state) 
  return { 
    'specUrl':        window.localStorage.getItem('apiUrl')+'/spec/swagger.json',
    'specUrl2':        window.localStorage.getItem('apiUrl2')+'/spec/swagger.json',
    'wsUrl':          window.localStorage.getItem('wsUrl'),
    'swgControlRdcr': state.swgControlRdcr,
    'swgControlRdcr2': state.swgControlRdcr2,
    'wsControlRdcr':  state.wsControlRdcr,
    'authRdcr':       state.authRdcr,

    'appMenuRdcr':    state.appMenuRdcr,
  } 
} 
 
// Мэпим Redux (actions --> Store:dispatch) через процедуру bindActionCreators в React-компоненту Connect(Cnt_appMenu) 
function mapDispatchToProps(dispatch) { 
  return { 
    'swgControlActions':  bindActionCreators(swgControlActions, dispatch),
    'swgControlActions2':  bindActionCreators(swgControlActions2, dispatch), 
    'wsControlActions':   bindActionCreators(wsControlActions, dispatch), 
    'authActions':        bindActionCreators(authActions, dispatch),

    'appMenuActions':     bindActionCreators(appMenuActions, dispatch),
  } 
} 
 
// Мэп и коннект: <Cnt_appMenu> --> <Connect(Cnt_appMenu)> 
export default connect(mapStateToProps, mapDispatchToProps)( withRoot( withStyles(styles)(Cnt_appMenu) ) ) 
