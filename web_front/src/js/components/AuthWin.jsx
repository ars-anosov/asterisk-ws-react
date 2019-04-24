import React from 'react';

import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
})



class AuthWin extends React.Component {

  constructor(args) {
    super(args)

    this.state = {
      authName:     '',
      authPass:     '',
    }

    this.handleClkAction        = this.handleClkAction.bind(this)
    // Прогоняю через Redux state. Не надо.
    //this.handleChangeData       = this.props.authActions.handleChangeData.bind(this)
    this.handleChangeData       = this.handleChangeData.bind(this)
  }



  handleClkAction(event) {
    event.preventDefault()  // Не перезагружать после form Submit
    // Прогоняю через Redux state. Не надо.
    //this.props.authActions.authTokenAct(this.props.swgClient, this.props.authRdcr.authName, this.props.authRdcr.authPass)
    this.props.authActions.authTokenAct(this.props.swgClient, this.state.authName, this.state.authPass)
  }

  handleChangeData(event) {
    if ( event.target.id === 'authName' ) {
      this.setState({ 'authName': event.target.value })
    }
    if ( event.target.id === 'authPass' ) {
      this.setState({ 'authPass': event.target.value })
    }
  }



  render() {
    console.log('authWin render')
    const {
      classes,
      authRdcr
    } = this.props

    var finalTemplate

    if (typeof window.Storage === 'undefined') {
      finalTemplate = <main className={classes.main}>Браузер не поддерживает localStorage !<br />Не могу сохранить временный token.</main>
    }
    else {
      if (authRdcr.token) {
        window.localStorage.setItem('token', authRdcr.token)
        document.location.reload(true)  // Перезагрузить если получен token
      }

      finalTemplate =
      <div className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">
            {authRdcr.clientUserData.fio ? authRdcr.clientUserData.fio: 'Вход'}
          </Typography>
          <Typography variant="caption">
            {authRdcr.message ? authRdcr.message : 'введите имя пользователя и пароль'}
          </Typography>
          <form className={classes.form} onSubmit={this.handleClkAction}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="authName">Имя пользователя</InputLabel>
              <Input id="authName" autoFocus        autoComplete="username"         value={this.state.authName/*authRdcr.authName*/} onChange={this.handleChangeData} />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="authPass">Пароль</InputLabel>
              <Input id="authPass" type="password"  autoComplete="current-password" value={this.state.authPass/*authRdcr.authPass*/} onChange={this.handleChangeData} />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Войти
            </Button>
          </form>
        </Paper>
      </div>

    }

    return finalTemplate
  }

}



AuthWin.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(AuthWin)