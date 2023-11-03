import { db } from "./firebase.config"
import { useState, useEffect } from "react"
import {collection, onSnapshot, doc, addDoc, deleteDoc, setDoc , updateDoc} from "firebase/firestore"
import { ref,uploadBytes, getDownloadURL, put } from 'firebase/storage'
import { getStorage } from 'firebase/storage';
import { v4 } from 'uuid';

import CommentList from './editablelist.js';

function App() {

  const [recipes, setRecipes] = useState([])
  const [comments, setComments] = useState([])

  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: [],
    steps: []
  })
  const [popupActive, setPopupActive] = useState(false)

  const [popupTitle,setPopupTitle]=useState("")

  const [currentRecipe,setCurrentRecipe]=useState("")

  const [isInEditMode,setIsInEditMode]=useState(false)

  const recipesCollectionRef = collection(db,"recipes")
  const commentsCollectionRef = collection(db,"comments")

  const storage = getStorage();

  const [pictureUpload,setPictureUpload] = useState(null);

  useEffect(()=>{
      onSnapshot(recipesCollectionRef, snapshot => {
        setRecipes(snapshot.docs.map(doc => {
          return {
            id:doc.id,
            ...doc.data()
          }
        }))
      }
      )
      onSnapshot(commentsCollectionRef, snapshot => {
        setComments(snapshot.docs.map(doc => {
          return {
            id:doc.id,
            ...doc.data()
          }
        }))
      }
      )
    }, []
  )

  const handleView = id => {
    const recipesClone = [...recipes]

    recipesClone.forEach(async recipe => {
      const recipeRef = doc(db,"recipes",recipe.id)
      if (recipe.id === id) {
        await updateDoc(recipeRef,{viewing:!recipe.viewing});
      } else {
        await updateDoc(recipeRef,{viewing:false});
      }
    })

    setRecipes(recipesClone)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!form.title || !form.description || !form.ingredients || !form.steps) {
      alert("Please fill out all fields")
      return 
    }
    if (!isInEditMode) {
      

      if (pictureUpload!= null){
        const pictureRef = ref(storage,`${pictureUpload.name}`);
        uploadBytes(pictureRef,pictureUpload).then(async () => {
        var y = await getDownloadURL(pictureRef);
        var x = v4();
        addDoc(commentsCollectionRef,{recipeId:x,text:"############################################################", timestamp:9999999999999})
        await setDoc(doc(db, "recipes", x),{...form,viewing:false,picture:y});
        });
      } else {
        var x = v4();
        await setDoc(doc(db, "recipes", x),{...form,viewing:false,picture:""});
        addDoc(commentsCollectionRef,{recipeId:x,text:"############################################################", timestamp:9999999999999})
      }
      } 
    if (isInEditMode) {
      const recipeRef = doc(db,"recipes",currentRecipe)
      
      if (pictureUpload!= null){
        const pictureRef = ref(storage,`${pictureUpload.name}`);
        uploadBytes(pictureRef,pictureUpload).then(async () => {
        var y = await getDownloadURL(pictureRef);
        await updateDoc(recipeRef,{...form,picture:y});
        });
      } else {
        await updateDoc(recipeRef,form);
      }
      
      
    }

    setForm({
      title:"",
      description:"",
      ingredients:[],
      steps:[]
    })

    setPopupActive(false)
  }

  const handleIngredient = (e,i) => {
    const ingredientsClone = [...form.ingredients]

    ingredientsClone[i] = e.target.value
    
    setForm({
      ...form,
      ingredients:ingredientsClone
    })
  }

  const handleStep = (e,i) => {
    const stepsClone = [...form.steps]

    stepsClone[i] = e.target.value
    
    setForm({
      ...form,
      steps:stepsClone
    })
  }

  const handleIngredientCount = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, ""]
    })
  }

  const handleStepCount = () => {
    setForm({
      ...form,
      steps: [...form.steps, ""]
    })
  }

  const handleCancel = () => {setPopupActive(false)
    setForm({
    title:"",
    description:"",
    ingredients:[],
    steps:[]
  })
}

                                                                    

  const removeRecipe = async id => {
    deleteDoc(doc(db,"recipes",id))
    for (var i=0; i<comments.length; i++) {
      if (comments[i].recipeId === id) {
        await deleteDoc(doc(db,"comments",comments[i].id))
      }
    }
  }

  let urlPenImg = new URL("grapes.jpg",import.meta.url);
  let urlEyeImg = new URL("tomato.png",import.meta.url);
  let urlRecycleImg = new URL("lemon.jpg",import.meta.url);
  let urlAddImg = new URL("add.png",import.meta.url);
  let urlPlaceHolder = new URL("placeholder.png",import.meta.url);
  let urlPlusImg = new URL("plus.png",import.meta.url);
  let urlUploadImg = new URL("upload.png",import.meta.url);
  let urlCancelImg = new URL("cancel.png",import.meta.url);

  return (
    <> 

    <div className="App">
      <p style={{display:"block",marginLeft:"auto",
    marginRight:"auto",backgroundColor:"rgba(27,17,19,0.85)",fontSize:32,width:"80vw",marginBottom:30,color:"#feae00"}}>S. and J. Moon-Gangloff's recipes list</p>

      <img className="imgBtn" src={urlAddImg} style={{height:70,width:70}} type="button" onClick ={()=> {
            setPopupActive(!popupActive)
            setPopupTitle("Add recipe")
          }}/>

      <div className="recipes">
        <ol>
        { recipes.map((recipe,i) => (<li className="recipe" style={{display:"block",marginLeft:"auto",
    marginRight:"auto",backgroundColor:"rgba(27,17,19,0.75)",width:"80vw"}} key={recipe.id}>
          
          <table style={{width:"100%"}}>
            <tr>
              <td style={{width:"47.5%",position:"relative"}}>
          <div style={{position:"absolute",top:"0"}}>
          <p className="recipeTitle" style={{color:"#feae00"}}>{recipe.title}</p>
          <p dangerouslySetInnerHTML={{ __html: recipe.description }} style={{color:"#bdbb65",fontStyle:"italic"}}></p>
          <br/>
          <p style={{fontWeight:"bold"}}>Ingredients:</p>
          <br/>
              <div style={{display:"flex",flexWrap:"wrap",fontStyle:"italic"}}>{recipe.ingredients.map((ingredient,i) => (
                <div key={i}>{ingredient} &nbsp; - &nbsp;</div>
              ))}
              </div>
          
          </div>
              </td>
              <td style={{width:"42.5%"}}>
                <img src={(recipe.picture !== "") ? new URL(recipe.picture,import.meta.url) : urlPlaceHolder} style={{width:"100%",height:"300px",verticalAlign:"bottom"}}/>
              </td>
              <td style={{width:"10%"}}>

          <div className = "buttons" style={{width:"100%",height:"100%",textAlign:"center"}}>
            <ul style={{display:"inline-block",textAlign:"left",height:"100%"}}>
              <li><img className="imgBtn" src={urlEyeImg} style={{height:60,width:60,borderRadius:50,border:"3px solid red"}} onClick={() => handleView(recipe.id)}/></li>
            <li><img className="imgBtn" src={urlPenImg} style={{height:60,width:60,borderRadius:50,border:"3px solid red"}} onClick={() => {setForm({title:recipe.title,description:recipe.description,ingredients:recipe.ingredients,steps:recipe.steps}) 
                                    setPopupTitle("Edit recipe")
                                    setPopupActive(!popupActive)
                                    setCurrentRecipe(recipe.id)
                                    setIsInEditMode(true)
                                    }}/> </li>
            <li><img className="imgBtn" src={urlRecycleImg} style={{height:60,width:60,borderRadius:50,border:"3px solid red"}} onClick={() => {if (window.confirm('Are you sure you wish to delete this recipe?')) removeRecipe(recipe.id)}}/> </li>
          </ul>
          </div>
              </td>

          </tr>

          </table>


          { recipe.viewing && <div>

            <h4>Steps</h4>
            <ol>
              {recipe.steps.map((step,i) => (
                <li key={i}><span style={{color:"#feae00"}}>{i+". "}</span><span>{ step }</span></li>
              ))}
            </ol>

            <h4>Comments</h4>
            
            
            <CommentList recipeId={recipe.id} comments={comments}/>
            
          </div>}

          
        </li>))}
        </ol>
      </div>

      { popupActive && <div className ="popup">
              <div className="popup-inner">
                <h2>{popupTitle}</h2>

                <form onSubmit = {handleSubmit}> 

                  <div className="form-group">
                    <label style={{textAlign:"center"}}>---------- Title ----------</label> 
                    <input 
                      type="text" 
                      value={form.title} 
                      onChange = {e => setForm({...form,title:e.target.value})}/>
                  </div>

                  <div className="form-group">
                    <label style={{textAlign:"center"}}>----- Description -----</label> 
                    <textarea
                      type="text" 
                      value={form.description} 
                      onChange = {e => setForm({...form,description:e.target.value})}/>
                  </div>

                  <div className="form-group">
                    <label style={{textAlign:"center"}}>----- Ingredients ----- </label> 
                    {
                      form.ingredients.map((ingredient,i) => (
                        <textarea
                      type="text" 
                      key={i}
                      value={ingredient} 
                      onChange = {e => handleIngredient(e,i)}/>
                      ))
                    }

                    <img type="button" src={urlPlusImg} style={{display:"block", marginLeft:"auto",
  marginRight:"auto",width:"30px",height:"3Opx"}} onClick ={handleIngredientCount}/>
                    
                  </div>

                  <div className="form-group">
                    <label style={{textAlign:"center"}}>---------- Steps ----------</label> 
                    {
                      form.steps.map((step,i) => (
                        <textarea
                      type="textarea" 
                      key={i}
                      value={step} 
                      onChange = {e => handleStep(e,i)}/>
                      ))
                    }

<img type="button" src={urlPlusImg} style={{display:"block", marginLeft:"auto",
  marginRight:"auto",width:"30px",height:"3Opx"}} onClick ={handleStepCount}/>
                    
                  </div>

                  <div className="form-group">
                    <label style={{textAlign:"center"}}>---------- Picture ----------</label> 
                   
<input type='file' onChange={(e) => {setPictureUpload(e.target.files[0])}}/> 
                  </div>

                  <div className="buttons" style={{display:"flex"}}>
                    <button type="submit"><img src={urlUploadImg} style={{width:"40px",height:"40px"}}/></button>
                    <button type="button" class="remove" onClick={handleCancel}><img src={urlCancelImg} style={{width:"30px",height:"30px"}}/></button>
                  </div>

                </form>
              </div>
        </div>}
    </div>

    </>
  );
}

export default App;