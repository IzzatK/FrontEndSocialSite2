import React, {Component} from 'react';
import {isAuthenticated} from '../auth/index'
import {create} from './apiPost'
import {Redirect} from 'react-router-dom'
import DefaultProfile from '../imgs/useravatar.png'
import { stubFalse } from 'lodash-es';





class NewPost extends Component {

    constructor() {
        super();
        this.state = {
         title: "",
         body: "",
         photo: "",
         error: "",
         user : {

         },
         fileSize: 0,
         loading: false,
         redirectToProfile: false

        }
    }

   

    newPostForm = (title, body) => {
        return <form action>
<div className="form-group">
            <label className="text-muted">Post Photo</label>
            <input onChange={this.handleChange("photo")} style={{border:"none"}} type="file" accept="image/*" className="form-control" />
        </div>
        
        <div className="form-group">
            <label className="text-muted">Title</label>
            <input onChange={this.handleChange("title")} type="text" className="form-control" value={title}/>
        </div>
      
        <div className="form-group">
            <label className="text-muted">Body</label>
            <textarea onChange={this.handleChange("body")} type="text" className="form-control" value={body}/>
        </div>
       
        <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Create Post</button>
    </form>
    }

    // ? operand is used as if or else if statement, where the else if is seperated by :
    handleChange = (name) => (event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = name === 'photo' ? event.target.files[0].size : 0;
        this.postData.set(name, value)
       // this.setState({error: ""});
        this.setState({[name]: value, fileSize});
        

    }

    // //   // console.log(user);
    // fetch("http://localhost:8080/signup", {
    //     method: "POST",
    //     headers :{
    //         Accept: "application/json",
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(user)
    // }).then(response => {
    //     return response.json()
    // }).catch(err => console.log(err))

    //button usually refreshes web browser page on default

    clickSubmit = event => {
        event.preventDefault()
        this.setState({loading: true})

    if(this.isValid()) {



        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        create(userId, token, this.postData).then(data => {
             if(data.error) this.setState({error: data.error})
                else {
                    this.setState({loading: false, title: "", body: "", redirectToProfile: true, photo: ""})
                    console.log(data);
                }
        //    else updateUser(data, () => {
        //     this.setState({
        //         redirectToProfile: true
        //         })
        //    })
           
         })

    }
     
    }


//{`/user/${isAuthenticated().user._id}`}
    componentDidMount() {

        this.postData = new FormData();
       this.setState({user: isAuthenticated().user})
    }

    isValid = () => {
        const {title, body, fileSize} = this.state;
        if(fileSize > 250000) {
            this.setState({error: "File size must be less than 250KB.", loading: false});
            return false;
        }

        if(title.length === 0 || body.length === 0) {
            this.setState({error: "All fields are required", loading: false});
            return false;
        }
      
     
        return true;

    }
    render() {
        const {title, body, photo, user, error, loading, redirectToProfile} = this.state;

         if(redirectToProfile) {
           return <Redirect to ={`/user/${user._id}`}/>
         }

        return  (
            <div className="container">
            <h2 className="mt-5 mb-5">Create a new post</h2>
            <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{error}</div>

            {loading ? <div className="jumbotron text-center">
                           <h2>Loading... if message persists then refresh webpage</h2>
                           </div>: ""}


            {this.newPostForm(title, body)}
            </div>
        )
    }
}
export default NewPost;