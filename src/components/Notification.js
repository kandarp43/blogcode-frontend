import React, { useContext } from 'react'
import { Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'
import { NotifyContext } from '../App'
// import { reducerNotification, initialStatenotification } from '../reducers/notificationReducer'
function Notification() {
  const { notification, dispatchNotification } = useContext(NotifyContext)

  const handleClose = async (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    await dispatchNotification({
      type: 'CLOSE',
    })
  }
  return (
    <div>
      {notification.snackbaropen ? (
        <Snackbar
          elevation={6}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          onClose={handleClose}
          open={true}
          autoHideDuration={notification.snackbarduration}
        >
          <MuiAlert
            onClose={handleClose}
            elevation={6}
            variant='filled'
            severity={notification.snackbartype}
            color={notification.snackbarcolor}
            style={{ fontFamily: 'Lemonada' }}
          >
            {notification.snackbarmsg}
          </MuiAlert>
        </Snackbar>
      ) : (
        <Snackbar
          elevation={6}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={false}
        ></Snackbar>
      )}
    </div>
  )
}

export default Notification
