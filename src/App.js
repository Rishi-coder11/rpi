import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

function getModalStyle() {
  const name = "Rishi"
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const admin = 'rpispares@gmail.com'

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    });

    /*if (setUser === 'rpispares@gmail.com') {
      console.log("Admin")
    }*/ 

    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);

  /*useEffect(() => {
    if (setUser === 'rpispares@gmail.com') {
      console.log("Admin")
    }
  }, [setUser]);*/

  useEffect(() => {
    // this is where the code runs
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // every time a new post is added, this code fires...
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data()
          }))
        );
      });
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        });
      })
      .catch((error) => alert(error.message));
    setOpen(false);
    }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };



  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://lh3.googleusercontent.com/5mRmDJqER9chufbiagTb-Fuucbb7OzWwT6s6kLnNqsuSgQCDx4oWc-Uy6yStsy1PHXubSKE=s91"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://lh3.googleusercontent.com/5mRmDJqER9chufbiagTb-Fuucbb7OzWwT6s6kLnNqsuSgQCDx4oWc-Uy6yStsy1PHXubSKE=s91"
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://lh3.googleusercontent.com/5mRmDJqER9chufbiagTb-Fuucbb7OzWwT6s6kLnNqsuSgQCDx4oWc-Uy6yStsy1PHXubSKE=s91"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
      </div>

      {/*user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )*/}
      {user?.displayName? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to have admin. access to post</h3>
      )}
    </div>
  );
}

export default App;
