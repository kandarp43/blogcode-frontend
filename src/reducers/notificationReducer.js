export const initialStatenotification = {
    // snackbaropen: false,
    // snackbartype: 'error'
}

export const reducerNotification = (notification, action) => {
    if (action.type === "NOTIFY") {
        return {
            snackbaropen: true,
            snackbartype: action.snacktype,
            snackbarcolor: action.snackcolor,
            snackbarduration: action.duration,
            snackbarmsg: action.payload
        }
    }
    if (action.type === "CLOSE") {
        return {
            snackbaropen: false,
            snackbarcolor: action.snackcolor
        }
    }

    return notification
}