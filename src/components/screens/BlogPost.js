import { CardActions, IconButton, TextField } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import renderHTML from "react-render-html";
import "react-quill/dist/quill.snow.css";
import "./BlogPost.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NotifyContext, UserContext } from "../../App";
import DeleteIcon from "@material-ui/icons/Delete";
function BlogPost() {
  const history = useHistory();
  const { id } = useParams();
  const location = useLocation();
  // eslint-disable-next-line
  const { state, dispatch, url } = useContext(UserContext);
  // eslint-disable-next-line

  const { dispatchNotification, dispatchLoad } = useContext(NotifyContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatchLoad({ type: "LOAD" });
    fetch(url + "/posts/" + id, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData([result.posts]);
        document.title = result.posts.title + " | BlogCode";
        dispatchLoad({ type: "LOADOFF" });
      });
  }, [id, url, dispatchLoad]);
  const likePost = (post_id) => {
    if (state) {
      fetch(url + "/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId: post_id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          const newData = data.map((item) => {
            if (item._id === result._id) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
          dispatchNotification({
            type: "NOTIFY",
            payload: "Added to Liked Post",
            snacktype: "success",
            snackcolor: "success",
            duration: 3000,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return dispatchNotification({
        type: "NOTIFY",
        payload: "you must be signed in to like Post",
        snacktype: "error",
        snackcolor: "warning",
        duration: 3000,
      });
    }
  };

  const unlikePost = (post_id) => {
    fetch(url + "/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: post_id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const comment = (text, postId) => {
    if (state) {
      fetch(url + "/comment", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId,
          text,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          const newData = data.map((item) => {
            if (item._id === result._id) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return dispatchNotification({
        type: "NOTIFY",
        payload: "you must be signed in",
        snacktype: "error",
        snackcolor: "warning",
        duration: 3000,
      });
    }
  };

  const deletePost = (postId) => {
    fetch(url + "/deletepost/" + postId, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
        dispatchNotification({
          type: "NOTIFY",
          payload: " Post Deleted",
          snacktype: "warning",
          snackcolor: "info",
          duration: 3000,
        });
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteComment = (postId, commentId) => {
    fetch(url + "/delete-comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        commentId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onCopyText = () => {
    dispatchNotification({
      type: "NOTIFY",
      payload: "Link copied successfully",
      snacktype: "success",
      snackcolor: "success",
      duration: 3000,
    });
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

  return (
    <div>
      {data.map((item) => {
        return (
          <div key={item._id}>
            <div className="titleMain">
              <div className="title" style={{ fontFamily: "Lemonada" }}>
                {" "}
                Posted by:{" "}
                <span
                  className="titleText"
                  style={{ fontFamily: "lemonade", cursor: "pointer" }}
                  onClick={() => redirectionProfile(item.postedBy._id)}
                >
                  {" "}
                  {item.postedBy.name}{" "}
                </span>
              </div>

              {state && state._id === item.postedBy._id ? (
                <IconButton
                  style={{ margin: "10px" }}
                  color="secondary"
                  aria-label="add to favorites"
                  onClick={() => deletePost(item._id)}
                >
                  <DeleteIcon />
                </IconButton>
              ) : (
                ""
              )}
            </div>
            <div className="date" style={{ fontFamily: "Lemonada" }}>
              {" "}
              Posted at:{" "}
              <span className="DateText" style={{ fontFamily: "lobster" }}>
                {" "}
                {item.createdAt}{" "}
              </span>
            </div>
            <div className="title" style={{ fontFamily: "Lemonada" }}>
              {" "}
              {item.title}{" "}
            </div>
            <div className="ql-snow">
              <div className="ql-editor">{renderHTML(item.body)}</div>
            </div>

            {/* {item.photo && <div className='imageContainer'><img className='imageSize' height="500px" width="900px" src={item.photo} alt={item.title} /></div>} */}
            {state
              ? [
                  <CardActions disableSpacing key={"like"}>
                    {item.likes.includes(state._id) ? (
                      <IconButton
                        aria-label="add to favorites"
                        onClick={() => unlikePost(item._id)}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="remove from favorites"
                        onClick={() => likePost(item._id)}
                      >
                        <FavoriteBorderIcon />
                      </IconButton>
                    )}
                    <CopyToClipboard
                      text={"https://blogcode.netlify.app" + location.pathname}
                      onCopy={onCopyText}
                    >
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                    </CopyToClipboard>
                  </CardActions>,
                  <span
                    className="likesText"
                    style={{ fontFamily: "lobster" }}
                    key={"likecount"}
                  >
                    {item.likes.length}
                    {item.likes.length > 1 ? " likes" : " like"}{" "}
                  </span>,
                  <div
                    style={{ margin: "10px", width: "80%" }}
                    key={"commentsView"}
                  >
                    {item.comments.map((record, index) => {
                      return (
                        <h5
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            margin: "2px",
                            height: "30px",
                          }}
                          key={index}
                        >
                          <div>
                            <span
                              style={{
                                fontWeight: "800",
                                paddingRight: "3px",
                              }}
                            >
                              {record.postedBy.name}
                            </span>
                            <span style={{ fontWeight: "100" }}>
                              {record.text}
                            </span>
                          </div>
                          <div>
                            {state &&
                              (state._id === item.postedBy._id ? (
                                state._id === record.postedBy._id ? (
                                  <IconButton
                                    style={{
                                      margin: "0px",
                                      height: "30px",
                                      width: "30px",
                                    }}
                                    className="deleteComment"
                                    color="secondary"
                                    onClick={() =>
                                      deleteComment(item._id, record._id)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                ) : (
                                  <IconButton
                                    style={{
                                      margin: "0px",
                                      height: "30px",
                                      width: "30px",
                                    }}
                                    color="secondary"
                                    aria-label="add to favorites"
                                    onClick={() =>
                                      deleteComment(item._id, record._id)
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                )
                              ) : state._id === record.postedBy._id ? (
                                <IconButton
                                  style={{
                                    margin: "0px",
                                    height: "30px",
                                    width: "30px",
                                  }}
                                  className="deleteComment"
                                  color="secondary"
                                  aria-label="add to favorites"
                                  onClick={() =>
                                    deleteComment(item._id, record._id)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              ) : (
                                ""
                              ))}
                          </div>
                        </h5>
                      );
                    })}
                  </div>,
                  <form
                    key={"commentSec"}
                    onSubmit={(e) => {
                      e.preventDefault();
                      comment(e.target[0].value, item._id);
                      e.target[0].value = "";
                    }}
                  >
                    <TextField
                      key={item._id}
                      className="card_comment"
                      label="comment here"
                      variant="filled"
                    />
                  </form>,
                ]
              : [
                  <CardActions disableSpacing key={"likeoff"}>
                    <IconButton
                      aria-label="remove from favorites"
                      onClick={() => likePost(item._id)}
                    >
                      <FavoriteBorderIcon />
                    </IconButton>

                    <CopyToClipboard
                      text={"https://blogcode.netlify.app" + location.pathname}
                      onCopy={onCopyText}
                    >
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                    </CopyToClipboard>
                  </CardActions>,
                  <span
                    className="likesText"
                    style={{ fontFamily: "lobster" }}
                    key={"likecount"}
                  >
                    {item.likes.length}
                    {item.likes.length > 1 ? " likes" : " like"}{" "}
                  </span>,
                ]}
            {/* <div className='title' style={{ fontFamily: 'Lemonada' }}>  Posted at:   <span className='DateText' style={{ fontFamily: 'lobster' }}> {item.createdAt} </span></div> */}
            {/* {'http://localhost:3000/' + location.pathname} */}
          </div>
        );
      })}
    </div>
  );
}

export default BlogPost;
