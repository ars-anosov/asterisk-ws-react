import React from 'react'

class WsControl extends React.Component {

  constructor(args){
    super(args)

    // Если еще нет wsClient то получаем его
    if ( Object.keys(this.props.wsControlRdcr.wsClient).length === 0 ) {
      this.props.wsControlActions.wsConnectAct(this.props.wsUrl)
    }

  }



  render() {
    console.log('WsControl render')
    const wsControlRdcr = this.props.wsControlRdcr

    var callStr = ''
    if (wsControlRdcr.msgEvent && wsControlRdcr.msgEvent.calleridnum) {
      callStr += 'context: '+wsControlRdcr.msgEvent.context+'\n'
      callStr += 'calleridnum: '+wsControlRdcr.msgEvent.calleridnum+'\n'
      callStr += 'exten: '+wsControlRdcr.msgEvent.exten+'\n'
    }

    var finalTemplate =
    <div className={wsControlRdcr.displayBlock ? 'wscontrol-win' : 'display-none'}>
      {this.props.headerTxt} <button className={wsControlRdcr.StatusClass} value={wsControlRdcr.StatusTxt}>{wsControlRdcr.StatusTxt}</button>
      <pre>
        {callStr}
      </pre>
    </div>

    return finalTemplate
  }

}

export default WsControl