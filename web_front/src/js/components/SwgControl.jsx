import React from 'react'

class SwgControl extends React.Component {

  constructor(args){
    super(args)

    // Если еще нет swgClient то получаем его
    if ( Object.keys(this.props.swgControlRdcr.swgClient).length === 0 ) {
      this.props.swgControlActions.swgConnectAct(this.props.specUrl)
    }

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
      {this.props.headerTxt} <button className={swgControlRdcr.StatusClass} value={swgControlRdcr.StatusTxt}>{swgControlRdcr.StatusTxt}</button>
    </div>

    return finalTemplate
  }

}

export default SwgControl