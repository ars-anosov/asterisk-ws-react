import {
  AUTH_TOKEN_DISPLAY_BLK,

  AUTH_TOKEN_GET_REQUEST,
  AUTH_TOKEN_GET_SUCCESS,
  AUTH_TOKEN_GET_202,

  AUTH_USER_GET_REQUEST,
  AUTH_USER_GET_SUCCESS,
  AUTH_USER_GET_202,

  AUTH_DATA_USER_INPUT
} from '../constants/authConst'



function authTokenAct(swgClient, authName, authPass) {
  return (dispatch) => {

    if (authName && authPass) {
      // try
      dispatch({
        type: AUTH_TOKEN_GET_REQUEST,
        payload: {'token': '', 'message': 'Попытка авторизации...'}
      })

      // request
      swgClient.apis.Client.token_get({'auth_name': authName, 'auth_pass': authPass})
      .then((res) => {
        if (res.status == '200' && res.body) {

          // token - Ok
          dispatch({
            type: AUTH_TOKEN_GET_SUCCESS,
            payload: {'token': res.body.token, 'fio': res.body.fio, 'message': res.body.message}
          })

        }
        if (res.status == '202' && res.body) {

          // token - NOT Ok !
          dispatch({
            type: AUTH_TOKEN_GET_202,
            payload: {'token': '', 'message': res.body.message}
          })

        }
      })
      .catch((err) => {
        //console.log(err)
          dispatch({
            type: AUTH_TOKEN_GET_202,
            payload: {'token': '', 'message': 'что-то пошло не так'}
          })
      })
    }

  }
}



function clientUserDataGet(swgClient, token) {
  //console.log(swgClient)
  return (dispatch) => {

    if (swgClient && swgClient.apis && token) {
      // try
      dispatch({
        type: AUTH_USER_GET_REQUEST,
        payload: {'data': {}}
      })

      // request
      swgClient.apis.Client.user_get({
        'token':  token
      })
      .then((res) => {
        if (res.status == '200' && res.body) {
          dispatch({
            type: AUTH_USER_GET_SUCCESS,
            payload: {'data': res.body}
          })
        }
        if (res.status == '202' && res.body) {
          dispatch({
            type: AUTH_USER_GET_202,
            payload: {'data': {}, 'message': res.body.message}
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
            type: AUTH_USER_GET_202,
            payload: {'data': {}}
          })
      })
    }

  }
}



function handleChangeData(event) {
  return (dispatch) => {
    dispatch({
      type: AUTH_DATA_USER_INPUT,
      payload: {'storeDataKey': event.target.id, 'storeDataValue': event.target.value}
    })
  }
}









export {
  authTokenAct,
  clientUserDataGet,
  handleChangeData,
}