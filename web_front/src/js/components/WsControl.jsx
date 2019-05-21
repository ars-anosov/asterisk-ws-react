import React from 'react'

class WsControl extends React.Component {

  constructor(args){
    super(args)

    // Если еще нет wsClient то получаем его
    if ( Object.keys(this.props.wsControlRdcr.wsClient).length === 0 ) {
      this.props.wsControlActions.wsConnectAct(this.props.wsUrl, this.props.nickname)
    }

    // Как только появится this.props.nickname --> отсылаем nickname по WS
    let nickInterval = setInterval( 
      () => {
        if (this.props.nickname) {
          this.props.wsControlActions.wsSendMsg(this.props.wsControlRdcr.wsClient, this.props.nickname)
          clearInterval(nickInterval)
        }
      }, 
      1000
    ) 

  }



  render() {
    console.log('WsControl render')

    const {
      wsControlRdcr,
    } = this.props

    var finalTemplate =
    <div className={wsControlRdcr.displayBlock ? 'wscontrol-win' : 'display-none'}>
      {this.props.headerTxt} <button className={wsControlRdcr.StatusClass} value={wsControlRdcr.StatusTxt}>{wsControlRdcr.StatusTxt}</button>
    </div>

    return finalTemplate
  }

}

export default WsControl