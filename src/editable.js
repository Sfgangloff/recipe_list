import { db } from "./firebase.config"
import { relativeTimeRounding } from 'moment';
import React, { Component, createRef } from 'react';
import {collection, doc, addDoc, getDoc, setDoc, updateDoc, deleteDoc} from "firebase/firestore"
import { v4 } from 'uuid';

class Comment extends Component {

  constructor(props) {
    super(props)

    this.state = {
        id:this.props.id,
        text:this.props.text,
        recipeId:this.props.recipeId,
        isInEditMode:false, 
        addComment:this.props.addComment,
        removeComment:this.props.removeComment
      }

    this.selfRef = React.createRef()


    this.changeEditMode = this.changeEditMode.bind(this)
    this.renderEditView = this.renderEditView.bind(this)
    this.renderDefaultView = this.renderDefaultView.bind(this)
    this.updateComponentValue = this.updateComponentValue.bind(this)
  
}


changeEditMode() {
  this.setState(
    {
      isInEditMode:!this.state.isInEditMode
    }
  )
}



updateComponentValue = async (e) => {
  const commentsCollectionRef = collection(db,"comments")
  const commentRef = doc(db,"comments",this.state.id)
  const initialValue = this.state.text
  //const newValue = this.refs.theTextInput.value
  const newValue = this.selfRef.current.value

  if (e.key === "Enter") {
    if (initialValue === "############################################################") {
      if (newValue !== initialValue && newValue !=="") {
        this.state.addComment(newValue)
        //var x = v4();
        //const timestamp = Date.now()
        //await setDoc(doc(db, "comments", x),{recipeId:this.state.recipeId,text:newValue,timestamp:timestamp})
      }
    } 
    else {
      if (newValue !== "") {
        this.setState({text:newValue})
        await updateDoc(doc(db, "comments", this.state.id),{text:newValue})
      } else {
        this.state.removeComment(this.state.id)
        //await deleteDoc(doc(db,"comments",this.state.id))
      }
      }
    this.setState({
    isInEditMode:false
  })
    
  }
}


renderEditView() {
  return <div>
    <input type="text" 
           defaultValue={this.state.text}
           //ref="theTextInput" 
           ref = {this.selfRef} onKeyPress={this.updateComponentValue}/>
  </div>
}

renderDefaultView() {
  return <div onDoubleClick = {this.changeEditMode}> 
  {this.state.text}
</div>
}

  render() {
    return this.state.isInEditMode ? 
     this.renderEditView() : this.renderDefaultView()
    
  }
}

export default Comment;