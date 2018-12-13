import React from 'react';

export class AuthWin extends React.Component {

  constructor(args) {
    super(args)      // наполняю this от PageAuth

    this.handleClkAction        = this.handleClkAction.bind(this)
    this.handleChangeData       = this.props.authActions.handleChangeData.bind(this)
  }



  handleClkAction(event) {
    switch (true) {

      case (event.target.value === 'Login'):
        this.props.authActions.authTokenAct(this.props.swgClient, this.props.authRdcr.authName, this.props.authRdcr.authPass)
      break

    }
  }



  render() {
    console.log('authWin render')

    var finalTemplate
    const authRdcr             = this.props.authRdcr

    if (typeof window.Storage === 'undefined') {
      finalTemplate = <div className='auth-win' id='auth-win'>Браузер не поддерживает localStorage !<br />Не могу сохранить временный token.</div>
    }
    else {
      if (authRdcr.token) {
        window.localStorage.setItem('token', authRdcr.token)
        document.location.reload(true)
      }

      finalTemplate =
      <div className='auth-win'>
        <input type='text'      store_data_key={'authName'} value={authRdcr.authName} onChange={this.handleChangeData}  style={{width: '200px', margin: '2px'}} />
        <input type='password'  store_data_key={'authPass'} value={authRdcr.authPass} onChange={this.handleChangeData}  style={{width: '200px', margin: '2px'}} />
        <input type="button"    value="Login"                                         onClick={this.handleClkAction}    style={{width: '80px',  margin: '2px'}} />
      </div>
    }

    return finalTemplate
  }

}