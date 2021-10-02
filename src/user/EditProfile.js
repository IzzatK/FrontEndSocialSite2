import React, {Component} from 'react';
import {isAuthenticated} from '../auth/index'
import {read, update, updateUser} from './apiUser'
import {Redirect} from 'react-router-dom'
import DefaultProfile from '../imgs/useravatar.png'





class EditProfile extends Component {

    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            redirectToProfile: false,
            error: "",
            loading: false,
            fileSize: 0,
            about: ""

        }
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if(data.error) {
                this.setState({redirectToProfile: true})

              
            }
            else {
               this.setState({id: data._id, name: data.name, email: data.email, about: data.about })
               //  //this.setState({userId: this.props.match.params.userId,
                    //                   name: this.props.match.params.name})
            //    this.getUserId()

            }
        })
    }

    signupForm = (name, email, password, about) => {
        return <form action>
<div className="form-group">
            <label className="text-muted">Profile Photo</label>
            <input onChange={this.handleChange("photo")} style={{border:"none"}} type="file" accept="image/*" className="form-control" />
        </div>
        
        <div className="form-group">
            <label className="text-muted">Name</label>
            <input onChange={this.handleChange("name")} type="text" className="form-control" value={name}/>
        </div>
        <div className="form-group">
            <label className="text-muted">Email</label>
            <input onChange={this.handleChange("email")} type="email" className="form-control" value={email}/>
        </div>
        <div className="form-group">
            <label className="text-muted">About</label>
            <textarea onChange={this.handleChange("about")} type="text" className="form-control" value={about}/>
        </div>
        <div className="form-group">
            <label className="text-muted">password</label>
            <input onChange={this.handleChange("password")} type="password" className="form-control" value={password}/>
        </div>
        <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update</button>
    </form>
    }

    // ? operand is used as if or else if statement, where the else if is seperated by :
    handleChange = (name) => (event) => {
        const value = name === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = name === 'photo' ? event.target.files[0].size : 0;
        this.userData.set(name, value)
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



        const userId = this.props.match.params.userId;
        const token = isAuthenticated().token;
        update(userId, token, this.userData).then(data => {
             if(data.error) this.setState({error: data.error})

           else updateUser(data, () => {
            this.setState({
                redirectToProfile: true
                })
           })
           
         })

    }
     
    }


//{`/user/${isAuthenticated().user._id}`}
    componentDidMount() {

        this.userData = new FormData();
        // console.log("user id for route params:", this.props.match.params.userId)
        const userId = this.props.match.params.userId;
        // const name2 = this.props.match.params.name;
        

        console.log("user id is" +"  " +userId)
        // console.log("name id is" +"  " +name2)

        this.init(userId);
        // this.setState({userId: this.props.match.params.userId})
    }

    isValid = () => {
        const {name, email, password, fileSize} = this.state;
        if(fileSize > 250000) {
            this.setState({error: "File size must be less than 250KB.", loading: false});
            return false;
        }

        if(name.length === 0) {
            this.setState({error: "Name is required", loading: false});
            return false;
        }
        //use regex to check for email@domain.com
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({error: "A valid Email is required", loading: false});
            return false;
        }
        if(password.length >= 1 && password.length <=5) {
            this.setState({error: "Password must be at least 6 characters long", loading: false});
            return false;
        }
        return true;

    }
    render() {
        const {id, name, email, password, redirectToProfile, error, loading, about} = this.state;

        if(redirectToProfile) {
           return <Redirect to ={`/user/${id}`}/>
        }
        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile;

        return  (
            <div className="container">
            <h2 className="mt-5 mb-5">Edit Profile</h2>
            <div className="alert alert-danger" style={{display: error ? "" : "none"}}>{error}</div>

            {loading ? <div className="jumbotron text-center">
                           <h2>Loading... if message persists then refresh webpage</h2>
                           </div>: ""}

            <img style={{height:"200px", width:"auto"}} className="img-thumbnail" src={photoUrl} onError={i => (i.target.src=`${DefaultProfile}`)} alt={name}/>

            {this.signupForm(name, email, password, about)}
            </div>
        )
    }
}
export default EditProfile;