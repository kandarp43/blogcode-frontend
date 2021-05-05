import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { NotifyContext, UserContext } from '../App'
import { useHistory } from 'react-router';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import AddIcon from '@material-ui/icons/Add';
import { Divider, IconButton } from '@material-ui/core';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

export default function Menubar() {
    const classes = useStyles();
    const [states, setStates] = React.useState({
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setStates({ ...states, [anchor]: open });
    };
    const { state, dispatch } = useContext(UserContext)
    // eslint-disable-next-line
    const { notification, dispatchNotification } = useContext(NotifyContext)
    const history = useHistory()
    const renderList = () => {
        if (state) {
            return [
                <ListItem key={'createlist'}>
                    <Button className='login-btn' fullWidth variant="contained" color="secondary" style={{ outline: 0 }} key={'createpost'} onClick={() => { history.push('/create') }}> <AddIcon style={{ paddingLeft: '0', paddingRight: '10px' }} />create Post</Button>
                </ListItem>,
                <ListItem key={'likedlist'}>
                    <Button className='login-btn' fullWidth variant="contained" color="secondary" style={{ outline: 0 }} key={'likedpost'} onClick={() => { history.push('/likedposts') }}> <FavoriteBorderIcon style={{ paddingRight: '10px' }} /> Liked Post</Button>
                </ListItem>,
                <Divider key={'divider1'} />,
                <ListItem key={'logoutlist'}>
                    <Button className='login-btn' fullWidth variant="contained" key={'logout'} color="secondary" onClick={() => {
                        localStorage.clear()
                        dispatch({ type: 'CLEAR' })
                        dispatchNotification({ type: 'NOTIFY', payload: 'logged out', snacktype: 'info', snackcolor: 'info', duration: 3000 })
                        history.push('/')
                    }}><ExitToAppIcon style={{ paddingLeft: '0', paddingRight: '15px' }} /> LOGOUT</Button>
                </ListItem>
            ]
        }
        else {
            return [
                <ListItem key={'signinlist'}> <Button fullWidth onClick={() => { history.push('/signin') }} className='login-btn' variant="contained" color="secondary" key={'signin'}>sign in</Button></ListItem>,
                <ListItem key={'signuplist'}><Button className='signup-button' onClick={() => { history.push('/signup') }} style={{ fontWeight: 'bold' }} fullWidth variant="outlined" color="primary" key={'signup'}> Sign Up</Button></ListItem>
            ]
        }
    }
    const list = (anchor) => (
        <div
            className={classes.list}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {renderList()}
            </List>
        </div>
    );

    return (
        <div>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <IconButton aria-label="share" onClick={toggleDrawer(anchor, true)}><MenuIcon style={{ color: '#000' }} /></IconButton>
                    <SwipeableDrawer
                        anchor={anchor}
                        open={states[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                    >
                        {list(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
        </div>
    );
}
