import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { NotifyContext, UserContext } from "../../App";
import CreatepostButton from "./CreatepostButton";
import { htmlToText } from "html-to-text";
import "./home.css";

const Home = () => {
  document.title = "BlogCode";
  const [data, setData] = useState([]);
  const { dispatchLoad } = useContext(NotifyContext);
  const { state, url } = useContext(UserContext);

  useEffect(() => {
    dispatchLoad({ type: "LOAD" });
    fetch(url + "/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result.posts);
        setData(result.posts);
        dispatchLoad({ type: "LOADOFF" });
      });
  }, [url, dispatchLoad]);
  return (
    <>
      <div id="top"></div>
      <div className="home">
        {data.map((item, index) => {
          return (
            <CardPost
              className="card_shadow"
              key={index}
              index={index}
              time={item.createdAt}
              userId={item.postedBy._id}
              name={item.postedBy.name}
              photo={item.photo}
              postId={item._id}
              title={item.title}
              body={item.body}
            />
          );
        })}
      </div>
      <div id="bottom"></div>
      {state ? <CreatepostButton /> : ""}
    </>
  );
};

const CardPost = (props) => {
  const history = useHistory();
  const { state } = useContext(UserContext);
  // eslint-disable-next-line
  const { notification, dispatchNotification } = useContext(NotifyContext);
  const redirection = (Id) => {
    history.push("/posts/" + Id);
  };
  const redirectionProfile = (userId) => {
    if (state) {
      if (state._id === userId) {
        history.push("/profile");
      } else {
        history.push("/profile/" + userId);
      }
    } else {
      return dispatchNotification({
        type: "NOTIFY",
        payload: "you must be signed in to view others profile",
        snacktype: "error",
        snackcolor: "error",
        duration: 3000,
      });
      // history.push('/')
    }
  };

  const html = props.body;
  const text = htmlToText(html, {
    wordwrap: 130,
  });
  const finaltext = text.slice(0, 70) + "...";

  return (
    <>
      <Card className="card" elevation={6}>
        <CardHeader
          avatar={
            <Avatar
              style={{ cursor: "pointer", backgroundColor: "#f56786" }}
              onClick={() => redirectionProfile(props.userId)}
              className="card_avatar"
            >
              {props.name.slice(0, 1)}
            </Avatar>
          }
          title={
            <span
              style={{ cursor: "pointer" }}
              onClick={() => redirectionProfile(props.userId)}
            >
              {props.name}
            </span>
          }
          subheader={props.time}
        />

        <CardActionArea onClick={() => redirection(props.postId)}>
          {props.photo && (
            <CardMedia className="card_img" image={props.photo} alt="" />
          )}
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {props.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {finaltext}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

// const useStyles = makeStyles({
//     card: {
//         display: 'flex',
//     },
//     cardDetails: {
//         flex: 1,
//     },
//     cardMedia: {
//         width: 160,
//     },
// });

// const Post = (props) => {
//     const classes = useStyles();
//     const history = useHistory()

//     const redirection = (Id) => {
//         history.push('/posts/' + Id)
//     }
//     return (
//         <Grid item xs={12} md={6}>
//             <CardActionArea component="a" onClick={() => redirection(props.postId)}>
//                 <Card className={classes.card}>
//                     <div className={classes.cardDetails}>
//                         <CardContent>
//                             <Typography component="h2" variant="h5">
//                                 {props.title}
//                             </Typography>
//                             <Typography variant="subtitle1" color="textSecondary">
//                                 {'12 nov'}
//                             </Typography>
//                             <Typography variant="subtitle1" paragraph>
//                                 {props.body}
//                             </Typography>
//                             <Typography variant="subtitle1" color="primary">
//                                 Continue reading...
//               </Typography>
//                         </CardContent>
//                     </div>
//                     {/* <Hidden xsDown> */}
//                     <CardMedia className={classes.cardMedia} image={props.image} title={props.name} />
//                     {/* </Hidden> */}
//                 </Card>
//             </CardActionArea>
//         </Grid>
//     )
// }

export default Home;
