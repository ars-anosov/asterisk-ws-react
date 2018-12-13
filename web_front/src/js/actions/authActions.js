import {
  AUTH_TOKEN_DISPLAY_BLK,
  AUTH_TOKEN_GET_REQUEST,
  AUTH_TOKEN_GET_SUCCESS,
  AUTH_TOKEN_GET_202,

  AUTH_DATA_USER_INPUT
} from '../constants/authConst'



export function authTokenAct(swgClient, authName, authPass) {
  return (dispatch) => {

    if (authName && authPass) {
      // try
      dispatch({
        type: AUTH_TOKEN_GET_REQUEST,
        payload: {'token': ''}
      })

      // request
      swgClient.apis.Client.token_get({'auth_name': authName, 'auth_pass': authPass})
      .then((res) => {
        if (res.status == '200' && res.body) {

          // token - Ok
          dispatch({
            type: AUTH_TOKEN_GET_SUCCESS,
            payload: {'token': res.body.token, 'fio': res.body.fio}
          })

        }
        if (res.status == '202' && res.body) {

          // token - NOT Ok !
          dispatch({
            type: AUTH_TOKEN_GET_202,
            payload: {'token': ''}
          })

        }
      })
      .catch((err) => {
        //console.log(err)
          dispatch({
            type: AUTH_TOKEN_GET_202,
            payload: {'token': ''}
          })
      })
    }

  }
}

export function handleChangeData(event) {
  return (dispatch) => {
    dispatch({
      type: AUTH_DATA_USER_INPUT,
      payload: {'storeDataKey': event.target.getAttribute('store_data_key'), 'storeDataValue': event.target.value}
    })
  }
}