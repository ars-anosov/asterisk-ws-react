import React from 'react' 
import { bindActionCreators } from 'redux' 
import { connect } from 'react-redux' 
 
//import * as hdActions         from '../actions/hdActions' 

import { withStyles } from '@material-ui/core/styles'
import withRoot from './withRoot'
import Grid from '@material-ui/core/Grid'
//import {
//  PaperListItems,
//} from '../components/asterisk-ws-react-components'

import Typography from '@material-ui/core/Typography'


const styles = theme => ({
  main: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: `${theme.spacing.unit * 0}px ${theme.spacing.unit * 1}px`,
  },
  topSpace: {
    paddingTop: theme.spacing.unit * 10,
  },
  flexGrow1: {
    flexGrow: 1,
  }
})


class Cnt_phone extends React.Component {
  
  constructor(args) {
    super(args)

    this.alertFunc    = this.alertFunc.bind(this)
  }

  alertFunc(event) {
    alert('Работа с ТТ. Потом сделаю как-нибудь...')
  }


  render() { 
    console.log('Cnt_phone render')
    const {
      classes,
      //hdRdcr, hdActions,
      appMenuRdcr,
      //swgControlRdcr,
      authRdcr
    } = this.props

    let token = window.localStorage.getItem('token')
    let tokenUnauthorized = (authRdcr.displayBlock || !token)

    // Нажата именно эта вкладка?            : appMenuRdcr.itemSelected
    // Пользователю разрешена эта вкладка?   : authRdcr.clientUserData.app_arr
    let itemSelectedAuth = false
    if (authRdcr.clientUserData && authRdcr.clientUserData.app_arr) {
      JSON.parse(authRdcr.clientUserData.app_arr).map((row) => {
        if (row === 'Мой телефон' || row === '*') { itemSelectedAuth = true }
      })
    }
    let renderFlag = (!tokenUnauthorized && appMenuRdcr.itemSelected === 'Мой телефон' && itemSelectedAuth)
    // Результат проверок                    : renderFlag



    return (
    <div className={classes.main}>
      <div className={classes.topSpace} />
      { renderFlag 
        ?
        <Grid container className={classes.flexGrow1}
          direction="row"
          justify="space-between"
          alignItems="flex-start"
          spacing={8}
        >

          <Grid item xs={12} sm={12} md={12}>
            <Typography>
              Твой телефон <strong>{authRdcr.clientUserData.exten_arr}</strong>, SIP-регистрация на <strong>sputnik.intellin-tech.ru</strong><br />
              <br />
              Он живет на виртуальной АТС №6 - <a href='https://office.intellin-tech.ru/sputnik/'><strong>WEB-админка</strong></a> (логин/пароль: virtual6/virtual6)<br />
              По ссылке все настройки: данные SIP-регистрации, маршрутизайия, АОН и т.п.<br />
              <br />
              А тут всплывашки по факту входящего/исходящего вызова на твой телефон :)
            </Typography>
          </Grid>

        </Grid>
        :
        <div></div>
      }
    </div>
    ) 
  } 
} 
 
 
 
 
 
 
 
 
 
// Редьюсеры уже лежат в Store через RootReducer 
// Мэпим их из Redux Store в React-компоненту Connect(Cnt_phone) 
function mapStateToProps (state) { 
  //console.log(state) 
  return {
    'swgControlRdcr'    : state.swgControlRdcr, // это надо чтобы обращаться к Swagger (нужен объект swgClient)
    'authRdcr'          : state.authRdcr,       // это надо чтобы проверять авторизован ли пользователь (показано ли окно authRdcr.displayBlock = true)

    //'hdRdcr'            : state.hdRdcr,
    'appMenuRdcr'       : state.appMenuRdcr
  } 
} 
 
// Мэпим Redux (actions --> Store:dispatch) через процедуру bindActionCreators в React-компоненту Connect(Cnt_phone) 
function mapDispatchToProps(dispatch) { 
  return { 
    //'hdActions':        bindActionCreators(hdActions, dispatch) 
  } 
} 
 
// Мэп и коннект: <Cnt_phone> --> <Connect(Cnt_phone)> 
export default connect(mapStateToProps, mapDispatchToProps)( withRoot( withStyles(styles)(Cnt_phone) ) ) 
