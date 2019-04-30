import React from 'react'

class WsControl extends React.Component {

  constructor(args){
    super(args)

    // Если еще нет wsClient то получаем его
    // Перетащил в AuthActions.js-clientUserDataGet
    /*
    if ( Object.keys(this.props.wsControlRdcr.wsClient).length === 0 ) {
      this.props.wsControlActions.wsConnectAct(this.props.wsUrl)
    }
    */

  }



  render() {
    console.log('WsControl render')
    const wsControlRdcr = this.props.wsControlRdcr

    var finalTemplate =
    <div className={wsControlRdcr.displayBlock ? 'wscontrol-win' : 'display-none'}>
      {this.props.headerTxt} <button className={wsControlRdcr.StatusClass} value={wsControlRdcr.StatusTxt}>{wsControlRdcr.StatusTxt}</button>
    </div>

    return finalTemplate
  }

}

export default WsControl