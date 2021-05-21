import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from 'firebase';

const Post = (props) => {

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  const numberOfComments = comments.length;
  // console.log(comments);
  
  let firstChar = props.username.charAt(0).toUpperCase();

  useEffect(()=>{
    let unsubscribe;
    if(props.postId){
      unsubscribe = db
        .collection("posts")
        .doc(props.postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot)=>{
          setComments(snapshot.docs.map((doc)=>doc.data()))
        })
    }
    return ()=>{unsubscribe()}
  }, [props.postId])

  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(props.postId).collection("comments").add({
      text: comment,
      username: props.user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    setComment('');

  }

  return (
    <>
      <div className="post">
        {/* post Header */}
        <div className="post__header">
          <Avatar className="post__avatar">{firstChar}</Avatar>
          <p className="post__username">{props.username}</p>
        </div>

        {/* Image */}
        <img className="post__image" src={props.imageSrc} alt="Post" />

        {/* UserNamr + Caption */}
        <div className="post__caption">
          <p>
            {" "}
            <b>{props.username}: </b>
            {props.caption}
          </p>
        </div>
        <small className='post__commentCount'>{numberOfComments} comments</small>
          <div className="post__comments">
        {
          comments.map((comment, i)=> {
            return (
              <p className="post__comment" key={i}>
                <strong>{comment.username}</strong>: {comment.text}
              </p>
            )
          })
        }
          </div>
          {
            props.user && (

        <form className="post__form" autoComplete="off">
          <input
            placeholder="Add a comment..."
            value={comment}
            className="post__input"
            type="text"
            onChange={(e)=>setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >Post</button>
        </form>
            )
          }
      </div>
    </>
  );
};

export default Post;
