import React, { useEffect, createContext, useReducer, useContext } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import SignIn from './components/screens/SignIn'
import Signup from './components/screens/Signup'

import {
  BrowserRouter,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom'
import Createpost from './components/screens/Createpost'

import { reducer, initialState } from './reducers/userReducer'
import { loadReducer, initialLoadState } from './reducers/loadReducer'
import {
  reducerNotification,
  initialStatenotification,
} from './reducers/notificationReducer'
import BlogPost from './components/screens/BlogPost'
import Notification from './components/Notification'
import UserProfile from './components/screens/UserProfile'
import LikedPost from './components/screens/LikedPost'
import Reset from './components/screens/Reset'
import SetNewPassword from './components/screens/SetNewpassword'
import VerifyProfile from './components/screens/VerifyProfile'
import LinearIndeterminate from './components/Loader/LinearIndeterminate'

document.addEventListener('contextmenu', () => {
  // e.preventDefault();
})

export const UserContext = createContext()
export const NotifyContext = createContext()
document.title = 'BlogCode'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [loading, dispatchLoad] = useReducer(loadReducer, initialLoadState)
  const [notification, dispatchNotification] = useReducer(
    reducerNotification,
    initialStatenotification
  )
  const url = 'https://blogcode-api.herokuapp.com'

  return (
    <UserContext.Provider value={{ state, dispatch, url }}>
      <NotifyContext.Provider
        value={{ notification, dispatchNotification, loading, dispatchLoad }}
      >
        <BrowserRouter>
          <div className='landing-main'>
            <Notification />
            <Navbar />
            <LinearIndeterminate />
            <Routing />
          </div>
        </BrowserRouter>
      </NotifyContext.Provider>
    </UserContext.Provider>
  )
}

const Routing = () => {
  const history = useHistory()
  const location = useLocation()
  // eslint-disable-next-line
  const { state, dispatch, url } = useContext(UserContext)
  useEffect(() => {
    let currentDate = Date.now()
    fetch(url + '/unverified-users', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        datenow: currentDate,
      }),
    }).then((res) => res.json())
    currentDate = ''
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({ type: 'USER', payload: user })
      if (
        location.pathname.startsWith('/signin') ||
        location.pathname.startsWith('/signup') ||
        location.pathname.startsWith('/reset')
      ) {
        history.push('/')
      } else {
        history.push(location.pathname)
      }
    } else {
      if (
        location.pathname.startsWith('/posts') ||
        location.pathname.startsWith('/reset') ||
        location.pathname.startsWith('/signin') ||
        location.pathname.startsWith('/signup') ||
        location.pathname.startsWith('/verify')
      ) {
        history.push(location.pathname)
      } else {
        history.push('/')
      }
    }
    // eslint-disable-next-line
  }, [])

  return (
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='/signin'>
        <SignIn />
      </Route>
      <Route path='/signup'>
        <Signup />
      </Route>
      <Route exact path='/profile'>
        <Profile />
      </Route>
      <Route path='/create'>
        <Createpost />
      </Route>
      <Route path='/likedposts'>
        <LikedPost />
      </Route>
      <Route path='/posts/:id'>
        <BlogPost />
      </Route>
      <Route path='/profile/:id'>
        <UserProfile />
      </Route>
      <Route exact path='/reset'>
        <Reset />
      </Route>
      <Route path='/reset/:token'>
        <SetNewPassword />
      </Route>
      <Route path='/verify/:token/:id'>
        <VerifyProfile />
      </Route>
    </Switch>
  )
}
