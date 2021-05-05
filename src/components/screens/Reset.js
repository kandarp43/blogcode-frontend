import React, { useState, useContext } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom'
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

export default function Reset() {
    document.title = 'Reset password | BlogCode';
    const classes = useStyles();
    // eslint-disable-next-line
    const history = useHistory()
    const [email, setEmail] = useState('')
    // eslint-disable-next-line
    const { notification, dispatchNotification } = useContext(NotifyContext)
    const { url } = useContext(UserContext)

    document.title = 'Reset Password | BlogCode';

    const validateEmail = (value) => {
        setEmail(value)
        // eslint-disable-next-line
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,2}))$/.test(email)) {
            return dispatchNotification({ type: 'NOTIFY', payload: 'please insert correct Email', snacktype: 'error', snackcolor: 'error', duration: 1000 })
        }
        else {
            return dispatchNotification({ type: 'NOTIFY', payload: '', snacktype: 'success', snackcolor: 'success', duration: 1000 })
        }
    }

    const sendData = (e) => {
        e.preventDefault();
        fetch(url + '/reset-password', {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
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
                        Reset Password
                     </Typography>
                    <form className={classes.form} onSubmit={(e) => sendData(e)} validate='true' autoComplete='off'>
                        <TextField
                            color='secondary'
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            value={email}
                            onChange={(e) => validateEmail(e.target.value)}
                            autoComplete="email"
                        />
                        <Button
                            type='submit'
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                        >
                            Reset Password
                        </Button>
                    </form>
                </div>

            </Container>

        </div>
    );
}
