import React, { useContext, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ReactQuill from "react-quill";
import Compressor from "compressorjs";
import "./signin.css";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import { NotifyContext } from "../../App";
import { UserContext } from "../../App";

const useStyles = makeStyles((theme) => ({
  contain: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    marginTop: theme.spacing(4),
    width: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // justifyContent: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Createpost() {
  const classes = useStyles();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  // eslint-disable-next-line
  const [image, setImage] = useState("");
  const [disable, setDisable] = useState(false);
  const history = useHistory();
  const { url } = useContext(UserContext);
  // eslint-disable-next-line
  const { dispatchNotification, dispatchLoad } = useContext(NotifyContext);
  useEffect(() => {
    dispatchLoad({ type: "LOADOFF" });
  }, [dispatchLoad]);
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ size: [] }],
        [{ font: [] }],
        [{ color: [] }, { background: [] }],
        ["bold", "italic", "underline", "strike"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [{ align: [] }],
        [{ script: "sub" }, { script: "super" }],
        ["blockquote", "code-block"],
        ["link"],
        ["clean"],
      ],
      // handlers: {
      //     'image': () => compressImg()
      // }
    },
  };

  const formats = [
    "header",
    "size",
    "font",
    "color",
    "background",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "script",
    "blockquote",
    "code-block",
    "link",
    "clean",
  ];
  // eslint-disable-next-line
  const compressImg = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const compressState = await fileCompress(file);

      if (compressState.success) {
        setImage(compressState.file);
      }
    };
  };
  const fileCompress = (file) => {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        file: "File",
        quality: 0.5,
        success(file) {
          return resolve({
            success: true,
            file: file,
          });
        },
        error(err) {
          return resolve({
            success: false,
            message: err,
          });
        },
      });
    });
  };
  // const postDetails = () => {
  //     const data = new FormData()
  //     data.append("file", image)
  //     data.append("upload_preset", "newgram-app")
  //     data.append("cloud_name", "newgram")
  //     // https://res.cloudinary.com/demo/image/upload/w_250,h_250,c_fit/sample.jpg
  //     const urlapi = "https://api.cloudinary.com/v1_1/newgram/image/upload/"
  //     fetch(urlapi, {
  //         method: "post",
  //         body: data
  //     }).then(res => res.json())
  //         .then(data => {
  //         }).catch(err => console.log(err))

  // }
  // function errorHandling(data)

  function finalPost() {
    setDisable(true);
    dispatchLoad({ type: "LOAD" });
    var time =
      moment().format("D") +
      " " +
      moment().format("MMMM") +
      " " +
      moment().format("YYYY") +
      " " +
      moment().format("h:mm:ss a");
    fetch(url + "/createpost", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        title,
        body,
        createdAt: time,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        result(data);
      })
      .catch((err) => console.log(err + "here"));
  }
  function result(data) {
    if (data.error) {
      setDisable(false);
      dispatchLoad({ type: "LOADOFF" });
      return dispatchNotification({
        type: "NOTIFY",
        payload: data.error,
        snacktype: "error",
        duration: 3000,
      });
    } else {
      dispatchNotification({
        type: "NOTIFY",
        payload: "posted successfully",
        snacktype: "success",
        duration: 3000,
      });
      setDisable(false);
      dispatchLoad({ type: "LOADOFF" });
      history.push("/");
    }
  }

  return (
    // <Container className={classes.cont} component="main" maxWidth="xs">
    <div className={classes.contain}>
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          New Post
        </Typography>
        <form className={classes.form} validate="true" autoComplete="off">
          <TextField
            color="secondary"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            id="title"
            label="Title"
            name="title"
          />
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            placeholder={"type something here...."}
            value={body}
            onChange={(e) => setBody(e)}
          />

          <Button
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => finalPost()}
            className={classes.submit}
            disabled={disable}
          >
            Create Post
          </Button>
        </form>
      </div>
    </div>
    // </Container>
  );
}

export default Createpost;

//  <input accept="image/*" style={{ display: "none" }} id="icon-button-file" type="file" onChange={(e) => {
//                         setImage(e.target.files[0])
//                         if (imgcancel) {
//                             setImagename(e.target.files[0].name)
//                             setImgcancel(false)
//                         }
//                         else {
//                             setImagename('')
//                             setImgcancel(true)
//                         }
//                     }} />
