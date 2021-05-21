import React, { useEffect,  useState } from "react";
import "./App.css";
import Post from "./Post";
import { auth, db } from "./firebase";
import { Button, Modal } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openLog, setOpenLog] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openUpload, setOpenUpload] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User has logged in
        setUser(authUser);
      } else {
        // user is logged out
        setUser(null);
      }
    });

    return () => {
      // Perform some cleanup Actions
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((val, i) => {
          let id = val.id
          return ({id, data: val.data()});
        })
      );
    });
  }, []);

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err.message));
    setOpen(false);
    setEmail("");
    setPassword("");
  };

  const LogIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((err) => alert(err.message));

    setOpenLog(false);
    setEmail("");
    setPassword("");
  };

  return (
    <>
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            className="app__modal"
          >
            <form className="app__form">
              <center>
                <img
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  className="app__headerImage"
                  alt="logo"
                />
                <input
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={signUp}>signUp</button>
              </center>
            </form>
          </Modal>

          <Modal
            open={openLog}
            onClose={() => setOpenLog(false)}
            className="app__modal"
          >
            <form className="app__form">
              <center>
                <img
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  className="app__headerImage"
                  alt="logo"
                />
                <input
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={LogIn}>Log In</button>
              </center>
            </form>
          </Modal>
      <div className="app">
        {/* Caption Input */}
        {/* File Picker */}
        {/* Post Button */}

        <div className="app__header">
          <img
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            className="app__headerImage"
            alt="logo"
          />

          {user ? (
            <div className="app__leftHead">
              <Button onClick={() => auth.signOut()}>LogOut</Button>
              <h4>{user.displayName}</h4>
            </div>
          ) : (
            <div className="app__leftHead">
              <Button onClick={() => setOpenLog(true)}>LogIn</Button>
              <Button onClick={() => setOpen(true)}>SignIn</Button>
            </div>
          )}
      </div>

        <div className="app__post">
          {
            posts.map(({id, data}, i)=>(
              <Post
                username={data.username}
                imageSrc={data.imageSrc}
                caption={data.caption}
                user={user}
                postId={id}
                key={i}
              />
            ))
          }          
        </div>

        <Modal
          open={openUpload}
          onClose={() => setOpenUpload(false)}
          className="uploadModal"
        >
          {user?.displayName ? (
            <ImageUpload username={user.displayName} open={setOpenUpload}/>
          ) : (
            <h3>LogIn First </h3>
          )}
        </Modal>
        <div className="uploadDiv">
          <button onClick={() => setOpenUpload(true)}>+</button>
        </div>
      </div>
    </>
  );
};

export default App;
