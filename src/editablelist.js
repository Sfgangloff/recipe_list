import { db } from "./firebase.config"
import { relativeTimeRounding } from 'moment';
import React, { Component, createRef } from 'react';
import {collection, doc, addDoc, getDoc, setDoc, updateDoc, deleteDoc} from "firebase/firestore"
import { v4 } from 'uuid';

import Comment from './editable.js';

class CommentList extends Component {

  constructor(props) {
    super(props)
    this.state = {
        recipeId:this.props.recipeId,
        comments:this.props.comments
      }


    this.addComment = this.addComment.bind(this)
    this.removeComment = this.removeComment.bind(this)
  
}


addComment= async (text) => {
  var x = v4();
  const timestamp = Date.now()
  const comments = this.state.comments
  comments.push({id:x,recipeId:this.state.recipeId,text:text,timestamp:timestamp})
  comments.sort((a, b) =>
      a.timestamp < b.timestamp ? -1 : 1,
      )
  this.setState({comments:comments})
  await setDoc(doc(db, "comments", x),{recipeId:this.state.recipeId,text:text,timestamp:timestamp})
  
}

removeComment = async (id) => {
  const comments = this.state.comments
  for(var i = 0; i < comments.length; i++){ 
    
    if ( comments[i].id === id) { 

        comments.splice(i, 1)
        
    }
    console.log(comments)
  }
  comments.sort((a, b) =>
      a.timestamp < b.timestamp ? -1 : 1,
      )
    await deleteDoc(doc(db,"comments",id))
    this.setState({comments:comments})
  }



  render() {
     return  <ol>{this.state.comments.sort((a, b) =>
      a.timestamp < b.timestamp ? -1 : 1,
      ).map((comment,i) => (
               <li key={i}> {(comment.recipeId === this.state.recipeId) ? 
               <Comment id={comment.id} 
                        text={comment.text} 
                        recipeId={comment.recipeId} 
                        addComment={this.addComment} 
                        removeComment={this.removeComment}/>   : <div></div>} </li>
                     ))}
           </ol>
    
  }
}

export default CommentList;