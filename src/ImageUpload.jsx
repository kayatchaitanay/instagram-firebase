import React, { useState } from "react";
import { db, storage } from "./firebase";
import firebase from 'firebase';
import './ImageUploader.css'
import { Modal } from "@material-ui/core";

const ImageUpload = (props) => {

    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");
    const username = props.username;

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function....
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                alert(error.message);
            },
            ()=>{
                // Complete Function
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url=>{
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageSrc: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption("");
                        props.open(false)
                        setImage(null);
                    })
                },
                )
                setProgress(0);
                setCaption("");
                setImage(null);
    }

    const inputEvent = (e)=>{
        setCaption(e.target.value)
    }

  return (
    <>
        <Modal
            open={props.open}
            onClose={() => props.open(false)}
            className="imageUpload"
          >
    <div className='uploader'>
        <input
          type="text"
          placeholder="Enter a Caption..."
          onChange={inputEvent}
          value={caption}
          className="captionInput"
        />
        <progress value={progress} max="100" className="progressBar" />
        <input type="file" onChange={handleChange} className="filePicker" />
        <button onClick={handleUpload} className="uploadBtn">Upload</button>
        </div>
           
          </Modal>
    </>
  );
};

export default ImageUpload;


