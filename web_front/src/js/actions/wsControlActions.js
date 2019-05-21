import {
  WSCTL_DISPLAY_BLK,

  WSCTL_CONNECT_REQUEST,
  WSCTL_CONNECT_SUCCESS,
  WSCTL_DISCONNECT_OK,
  WSCTL_DISCONNECT_ERR,

  WS_MSG_EVENT,
} from '../constants/wsControlConst'



function wsConnectAct(wsUrl, nickname) {
  
  return (dispatch) => {
    // try
    dispatch({
      type: WSCTL_CONNECT_REQUEST,
      payload: {'wsClient': {}, 'message': 'Попытка соединения с '+wsUrl}
    })



    var socket = new WebSocket("ws://192.168.13.97:8019")

    
    
    socket.onopen = function() {
      dispatch({
        type: WSCTL_CONNECT_SUCCESS,
        payload: {'wsClient': socket, 'message': 'Ok'}
      })
    }
    
    
    
    socket.onclose = function(event) {

      if (event.wasClean) {
        dispatch({
          type: WSCTL_DISCONNECT_OK,
          payload: {'message': 'Соединение закрыто чисто'}
        })

      }
      else {
        // например, "убит" процесс сервера
        dispatch({
          type: WSCTL_DISCONNECT_ERR,
          payload: {'message': 'Обрыв соединения'}
        })
      }

    }


    socket.onmessage = function(event) {
      dispatch({
        type: WS_MSG_EVENT,
        payload: {'data': JSON.parse(event.data)}
      })
    }
    /*
    socket.onerror = function(error) {
      console.log("Ошибка " + error.message);
    }
    */


  }

}



function wsSendMsg(socket, msg) {
  
  return (dispatch) => {
    if (socket) {
      socket.send(msg)

      dispatch({
        type: WS_MSG_EVENT,
        payload: {'data': {'msg_sended': msg}}
      })
    }
    else {
      dispatch({
        type: WS_MSG_EVENT,
        payload: {'data': {'msg_not_sended': 'no socket'}}
      })
    }
  }

}








export {
  wsConnectAct,
  wsSendMsg
}