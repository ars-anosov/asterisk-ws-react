import React from 'react' 
import { bindActionCreators } from 'redux' 
import { connect } from 'react-redux' 
 
//import * as hdActions         from '../actions/hdActions' 

import { withStyles } from '@material-ui/core/styles'
import withRoot from './withRoot'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

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
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 1,
  },
})


class Cnt_phone extends React.Component {
  
  constructor(args) {
    super(args)

    this.alertFunc    = this.alertFunc.bind(this)

    this.injectBlockly    = this.injectBlockly.bind(this)
    this.showCode         = this.showCode.bind(this)
    this.runCode          = this.runCode.bind(this)
    this.demoWorkspace    = ''
  }

  alertFunc(event) {
    alert('Работа с ТТ. Потом сделаю как-нибудь...')
  }



  // Blockly ---
  injectBlockly() {

    document.getElementById('blocklyDiv').innerHTML = ''

    this.demoWorkspace = Blockly.inject(
      'blocklyDiv',
      {
        media     : 'blockly12/media/',
        toolbox   : document.getElementById('toolbox')
      }
    )

    Blockly.Xml.domToWorkspace(
      document.getElementById('startBlocks'),
      this.demoWorkspace
    )
  }

  showCode() {
    // Generate JavaScript code and display it.
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.JavaScript.workspaceToCode(this.demoWorkspace)
    alert(code);
  }

  runCode() {
    // Generate JavaScript code and run it.
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var code = Blockly.JavaScript.workspaceToCode(this.demoWorkspace)
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null
    
    try {
      eval(code)
    } catch (e) {
      alert(e)
    
    }
  }
  // END OF Blockly ---




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
            <Paper className={classes.paper}>
              <Typography>
                Твой телефон <strong>{authRdcr.clientUserData.exten_arr}</strong><br />
                Он живет на <strong>sputnik.intellin-tech.ru</strong>, виртуальная АТС №6<br />
                <a href='https://office.intellin-tech.ru/sputnik/'><strong>WEB-админка</strong></a> (логин/пароль: virtual6/virtual6)<br />
              </Typography>
              <br />
              <Button variant="contained" color='primary' onClick={this.injectBlockly}>Показать текущую логику обработки вызова</Button>
              <br />
              <div id="blocklyDiv" style={{height: '800px', width: '1600px'}}></div>
              <br />
              <button onClick={this.showCode}>Код который выполнит АТС</button><br />
              <button onClick={this.runCode}>Пезультат логической цепочки</button><br />

            </Paper>
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
