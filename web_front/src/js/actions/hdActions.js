import {
  HD_DISPLAY_BLK,

  HD_TTMY_REQUEST,
  HD_TTMY_SUCCESS,
  HD_TTMY_202,

  HD_USER_INPUT
} from '../constants/hdConst'

import {
  AUTH_TOKEN_DISPLAY_BLK
} from '../constants/authConst'



function ttMyListGet(swgClient, token) {
  //console.log(swgClient)
  return (dispatch) => {

    if (swgClient && swgClient.apis && token) {
      // try
      dispatch({
        type: HD_TTMY_REQUEST,
        payload: {'data': []}
      })

      // request
      swgClient.apis.Hd.hd_ttmy_get({
        'token':  token
      })
      .then((res) => {
        if (res.status == '200' && res.body) {
          dispatch({
            type: HD_TTMY_SUCCESS,
            payload: {'data': res.body}
          })
        }
        if (res.status == '202' && res.body) {
          dispatch({
            type: HD_TTMY_202,
            payload: {'data': [], 'message': res.body.message}
          })
          // show auth win
          if (res.body.message === 'token Unauthorized') {
            dispatch({
              type: AUTH_TOKEN_DISPLAY_BLK,
              payload: {'boolVal': true}
            })
          }
        }
      })
      .catch((err) => {
        //console.log(err)
          dispatch({
            type: HD_TTMY_202,
            payload: {'data': []}
          })
      })
    }

  }
}









export {
  ttMyListGet,
}