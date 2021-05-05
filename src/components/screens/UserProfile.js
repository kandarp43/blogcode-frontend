import React, { useContext, useEffect, useState } from "react";
import { /* useLocation, */ useHistory, useParams } from "react-router-dom";
import "./UserProfile.css";
import { NotifyContext, UserContext } from "../../App";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import { htmlToText } from "html-to-text";

function UserProfile() {
  const history = useHistory();
  const { id } = useParams();
  // const location = useLocation()
  // eslint-disable-next-line
  const { state, dispatch, url } = useContext(UserContext);
  const { dispatchLoad } = useContext(NotifyContext);
  // eslint-disable-next-line
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  useEffect(() => {
    dispatchLoad({ type: "LOAD" });
    fetch(url + "/user/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result.user);
        setPosts(result.posts);
        dispatchLoad({ type: "LOADOFF" });
      });
  }, [id, url, dispatchLoad]);

  const redirection = (Id) => {
    history.push("/posts/" + Id);
  };
  const finaltext = (body) => {
    const html = body;
    const text = htmlToText(html, {
      wordwrap: 130,
    });
    return text.slice(0, 80) + "...";
  };
  return (
    <div className="profile_main">
      <div className="profile_header">
        <div>
          <h3>{user ? <span> {user.name} </span> : "loading"}</h3>
          <br />
        </div>
      </div>

      <div className="profile_main">
        {posts.map((item) => {
          return (
            <Card key={item._id} className="gallery" elevation={6}>
              <CardActionArea
                key={item._id}
                onClick={() => redirection(item._id)}
              >
                {item.photo && (
                  <CardMedia
                    className="card_img"
                    image={item.photo}
                    alt={item.title}
                  />
                )}

                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {finaltext(item.body)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default UserProfile;

// {
//     data.map(item => {
//         return (
//             <div key={item._id} className='blogs'>
//                 {item.postedBy.name}
//                 <img height="500px" width="900px" src={item.photo} alt="hello" />

//                 <span>likes</span>
//                 <TextField key={item._id} className='card_comment' label="comment here" variant="filled" />
//             </div>
//         )
//     })
// }
