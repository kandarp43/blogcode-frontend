import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { NotifyContext, UserContext } from "../../App";
import "./profile.css";

const Profile = () => {
  // eslint-disable-next-line
  const [mypics, setMypics] = useState([]);
  // eslint-disable-next-line
  const { state, url } = useContext(UserContext);
  const { dispatchLoad } = useContext(NotifyContext);
  document.title = state ? state.name + " | BlogCode" : "Profile | BlogCode";
  useEffect(() => {
    dispatchLoad({ type: "LOAD" });
    fetch(url + "/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setMypics(result.mypost);
        dispatchLoad({ type: "LOADOFF" });
      });
  }, [url, dispatchLoad]);
  const history = useHistory();
  const redirection = (Id) => {
    history.push("/posts/" + Id);
  };
  return (
    <div className="profile_main">
      <div className="profile_header">
        <div>
          <h3>{state ? <span> {state.name} </span> : "loading"}</h3>
          <br />
        </div>
      </div>

      <div className="profile_main">
        {mypics.map((item) => {
          return (
            <Card key={item._id} className="gallery" elevation={6}>
              {/* <div key={item._id} className='item'> */}
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
                {/* {!item.photo && ''} */}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.title}
                  </Typography>
                </CardContent>
              </CardActionArea>

              {/* </div> */}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
