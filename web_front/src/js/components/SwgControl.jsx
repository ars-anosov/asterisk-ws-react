import React from 'react'

export class SwgControl extends React.Component {

  constructor(args){
    super(args)

    this.props.swgControlActions.swgConnectAct(this.props.specUrl)
/*
    setInterval(
      () => {
        this.props.swgControlActions.swgConnectAct(this.props.specUrl)
      },
      10000
    )
*/
  }



  render() {
    console.log('SwgControl render')
    const swgControlRdcr = this.props.swgControlRdcr

    var finalTemplate =
    <div className={swgControlRdcr.displayBlock ? 'swgcontrol-win' : 'display-none'}>
      REST API <button className={swgControlRdcr.StatusClass} value={swgControlRdcr.StatusTxt}>{swgControlRdcr.StatusTxt}</button>
    </div>

    return finalTemplate
  }

}
