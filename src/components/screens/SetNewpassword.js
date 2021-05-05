import React, { useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { useHistory, useParams } from 'react-router-dom'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { NotifyContext, UserContext } from '../../App';
import './signin.css';


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
}));

export default function SetNewPassword() {
    const classes = useStyles();
    const { token } = useParams()
    console.log(token)
    const history = useHistory()
    const [password, setPassword] = useState('')
    // eslint-disable-next-line
    const { notification, dispatchNotification } = useContext(NotifyContext)
    const { url } = useContext(UserContext)

    document.title = 'Set new password | BlogCode';
    const sendData = (e) => {
        e.preventDefault();
        const currentTime = Date.now()
        fetch(url + '/new-password', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token,
                currentTime,
                password
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    dispatchNotification({ type: 'NOTIFY', payload: data.error, snacktype: 'error' })
                }
                else {
                    dispatchNotification({ type: 'NOTIFY', payload: data.message, snacktype: 'success', snackcolor: 'success', duration: 3000 })
                    history.push('/signin')
                }

            }).catch(err => console.log(err))

    }


    return (

        <div>

            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Set New Password
                    </Typography>
                    <form className={classes.form} onSubmit={(e) => sendData(e)} validate='true' autoComplete='off'>
                        <TextField
                            id="password"
                            color='secondary'
                            type={'password'}
                            margin="normal"
                            label="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                        />
                        <Button
                            type='submit'
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                        >
                            update Password
                        </Button>
                    </form>
                </div>
            </Container>
        </div>
    );
}
