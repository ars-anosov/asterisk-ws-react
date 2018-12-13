import OpenApiSwagger from 'swagger-client'

import {
  SWGCTL_CONNECT_REQUEST,
  SWGCTL_CONNECT_SUCCESS
} from '../constants/swgControlConst'

export function swgConnectAct(specUrl) {
  
  return (dispatch) => {
    // try
    dispatch({
      type: SWGCTL_CONNECT_REQUEST,
      payload: {'swgClient': {}}
    })

    OpenApiSwagger(specUrl)
      .then(
        (client) => {
          // connected
          dispatch({
            type: SWGCTL_CONNECT_SUCCESS,
            payload: {'swgClient': client}
          })
        }
      )
      .catch(
        (err) => {
          // err
          console.log(err)
        }
      )

  }
}
