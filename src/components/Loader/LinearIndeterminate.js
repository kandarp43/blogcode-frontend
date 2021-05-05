import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { NotifyContext } from "../../App";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function LinearIndeterminate() {
  const classes = useStyles();
  const { loading } = useContext(NotifyContext);

  return (
    <div className={classes.root}>
      <LinearProgress
        color="secondary"
        style={{ height: "5px" }}
        hidden={loading}
      />
    </div>
  );
}
