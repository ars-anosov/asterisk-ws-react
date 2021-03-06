import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import IconPower from '@material-ui/icons/Power';
import IconPowerOff from '@material-ui/icons/PowerOff';
import IconImportExport from '@material-ui/icons/ImportExport';

import IconAccountCircle from '@material-ui/icons/AccountCircle';
import Popover from '@material-ui/core/Popover';

import Button from '@material-ui/core/Button'

import { AuthWin }  from './asterisk-ws-react-components' 

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
    //backgroundColor: theme.palette.grey['400'],
    //backgroundColor: theme.palette.primary.main,
  },
  drawerLogo: {
    height: theme.spacing.unit * 6,
    //marginRight: theme.spacing.unit * 3,
  },
  drawerIcon: {
    //color: 'white',
  },
  growRight: {
    flexGrow: 1,
    //marginRight: 20,
  },
  popper: {
    padding: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
})



class AppMenuTop extends React.Component {

  constructor(args) {
    super(args)

    this.state = {
      open: false,
      anchorEl_api: null,
      anchorEl_ws: null,
      anchorEl_user: null,
    }

    this.handleDrawerOpen     = this.handleDrawerOpen.bind(this)
    this.handleDrawerClose    = this.handleDrawerClose.bind(this)

    this.handleClickAnchorEl  = this.handleClickAnchorEl.bind(this)
    this.handleCloseAnchorEl  = this.handleCloseAnchorEl.bind(this)

    this.handleMenuSelect     = this.handleMenuSelect.bind(this)
  }

  handleDrawerOpen() {
    this.setState({ open: true })
  }

  handleDrawerClose() {
    this.setState({ open: false })
  }

  handleMenuSelect(event) {
    this.props.appMenuActions.handleMenuSelect(event, this.props.swgClient)
    this.setState({ open: false })
  }

  handleClickAnchorEl(event) {
    if ( event.currentTarget.getAttribute('popover_flag') === 'api_status' )  { this.setState({ anchorEl_api: event.currentTarget }) }
    if ( event.currentTarget.getAttribute('popover_flag') === 'ws_status' )   { this.setState({ anchorEl_ws: event.currentTarget }) }
    if ( event.currentTarget.getAttribute('popover_flag') === 'user' )        { this.setState({ anchorEl_user: event.currentTarget }) }
  }

  handleCloseAnchorEl(event) {
    this.setState({
      anchorEl_api: null,
      anchorEl_ws: null,
      anchorEl_user: null,
    })
  }



  render() {
    console.log('AppMenuTop render')
    
    const {
      classes, theme,
      swgControlRdcr, swgControlRdcr2,
      wsControlRdcr,
      appMenuRdcr,
      authRdcr, authActions
    } = this.props

    const {
      open,
      anchorEl_api,
      anchorEl_ws,
      anchorEl_user,
    } = this.state

    const swgClient      = swgControlRdcr.swgClient


    
    return (
      <div>
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              {appMenuRdcr.itemSelected}
            </Typography>

            <div className={classes.growRight} align='right'>
              <Button variant="text" color='inherit' popover_flag="user" onClick={this.handleClickAnchorEl} >{authRdcr.clientUserData.name}
                <IconAccountCircle className={classes.rightIcon} />
              </Button>

              <Button variant="text" color='inherit' popover_flag="ws_status" onClick={this.handleClickAnchorEl} >ws
              {
                wsControlRdcr.StatusClass === 'ws-ok'
                ? <IconImportExport color='inherit' className={classes.rightIcon} />
                : <IconImportExport color='error' className={classes.rightIcon} />
              }
              </Button>

              <Button variant="text" color='inherit' popover_flag="api_status" onClick={this.handleClickAnchorEl} >api
              {
                swgControlRdcr.StatusClass === 'swg-ok'
                ? <IconPower color='inherit' className={classes.rightIcon} />
                : <IconPowerOff color='error' className={classes.rightIcon} />
              }
              </Button>
            </div>

          </Toolbar>
        </AppBar>



        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <img className={classes.drawerLogo} src="img/intellin-logo.jpg" />
            <Typography variant="h6">Интеллин</Typography>
            <IconButton onClick={this.handleDrawerClose} className={classes.drawerIcon}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </div>
          <Divider />
          {/* Эти названия проверяются в контейнерах: ВПИСАТЬ в соответствующий Cnt_* !!! */}
          {/* Эти названия проверяются в appMenuActions (первичное действие) */}
          <List>
            <ListItem button>
              <ListItemText primary='HelpDesk' onClick={this.handleMenuSelect} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Мой телефон' onClick={this.handleMenuSelect} />
            </ListItem>
            <ListItem button>
              <ListItemText primary='Мониторинг' onClick={this.handleMenuSelect} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemText primary='Пользователь' onClick={this.handleMenuSelect} />
            </ListItem>
          </List>
        </Drawer>



        <Popover
          id='user'
          open={Boolean(anchorEl_user)}
          anchorEl={anchorEl_user}
          onClose={this.handleCloseAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <AuthWin
            headerTxt       ='Авторизация'
            swgClient       ={swgClient}

            authActions     ={authActions}

            authRdcr        ={authRdcr}
          />
        </Popover>



        <Popover
          id='ws_status'
          open={Boolean(anchorEl_ws)}
          anchorEl={anchorEl_ws}
          onClose={this.handleCloseAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className={classes.popper}>
            <Typography variant='h6'>WebSocket</Typography>
            <br />
            <Typography>Main service WS: {wsControlRdcr.StatusTxt}</Typography>
            <Divider />
            <Typography variant='caption'>{wsControlRdcr.wsClient.url}</Typography>
          </div>
        </Popover>

        <Popover
          id='api_status'
          open={Boolean(anchorEl_api)}
          anchorEl={anchorEl_api}
          onClose={this.handleCloseAnchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className={classes.popper}>
            <Typography variant='h6'>OpenAPI</Typography>
            <br />
            <Typography>Main service API: {swgControlRdcr.StatusTxt}</Typography>
            <Divider />
            <Typography variant='caption'>{swgControlRdcr.swgClient.url}</Typography>
            <br />
            <Typography>Zabbix service API: {swgControlRdcr2.StatusTxt}</Typography>
            <Divider />
            <Typography variant='caption'>{swgControlRdcr2.swgClient.url}</Typography>
          </div>
        </Popover>



      </div>
    ) 
  } 
} 



AppMenuTop.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles, { withTheme: true })(AppMenuTop)