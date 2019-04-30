import {
  WSPP_DISPLAY_BLK,
} from '../constants/wsPopupConst'



function hideWin() {
  return (dispatch) => {
    
    dispatch({
      type: WSPP_DISPLAY_BLK,
      payload: {'boolVal': false}
    })

  }

}









export {
  hideWin,
}