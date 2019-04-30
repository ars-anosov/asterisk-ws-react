import React from 'react'

class WsPopup extends React.Component {

  constructor(args){
    super(args)

  }



  render() {
    console.log('WsPopup render')
    const wsPopupRdcr = this.props.wsPopupRdcr
    let msg = wsPopupRdcr.msgEvent
    msg.lines = ''

    var finalTemplate =
    <div className={wsPopupRdcr.displayBlock ? 'wspopup-win' : 'display-none'}>
      <h4>{this.props.headerTxt}</h4>
      <pre>
        {JSON.stringify(msg, null, '\t')}
      </pre>
    </div>

    return finalTemplate
  }

}

export default WsPopup