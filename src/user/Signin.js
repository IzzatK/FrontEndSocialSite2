import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import {isAuthenticated} from '../auth/index'
//import getuserid method from ../controllers/post


//below one can see using open: false variable how to conditonally render components

class Signin extends Component {

    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false
        }
    }

    handleChange = (name) => (event) => {
        this.setState({error: ""});
        this.setState({[name]: event.target.value});
        

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

    authenticate (jwt, next)  {
        if(typeof window !== "undefined") {
            localStorage.setItem("jwt", JSON.stringify(jwt))
            next();
        }

    }
    

    clickSubmit = event => {

          // if (isAuthenticated().user.name!==name) 
        // {window.alert("invalid user, error occured")}

        //if isAuthenticated().user.name!==user.name {window.alert("invalid user, error occured")}
        event.preventDefault()
        this.setState({loading: true});
        const {name, email, password} = this.state;

        const user = {
            name,
            email,
            password
        }
        this.signin(user).then(data => {
            if(data.error) this.setState({error: data.error, loading: false})
            // if(isAuthenticated().user.name !== this.props.match.params.userId) {console.log("error username not valid")}
            

           /* else if(data===undefined) {
                console.log("error");
            }
            */

          else{
              //authenticate and redirect
            this.authenticate(data, () => {
                this.setState({redirectToReferer: true})
                console.log(data.user.name);
                console.log(isAuthenticated().user.name);
                console.log(data);

            });



              }
        })
     
    }

    //`${process.env.REACT_APP_API_URL}/signin`

    signin = (user) => {
          return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
            method: "POST",
            headers :{
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }).then(response => {
            return response.json()
        }).catch(err => console.log(err))
    }

    signinForm = (email, password) => {
        return <form action>
        <div className="form-group">
            <label className="text-muted">Email</label>
            <input onChange={this.handleChange("email")} type="email" className="form-control" value={email}/>
        </div>
        <div className="form-group">
            <label className="text-muted">password</label>
            <input onChange={this.handleChange("password")} type="password" className="form-control" value={password}/>
        </div>
        <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
    </form>
    }
//conditional styling below in the alert-primary div

    render() {

        const {email, password, error, redirectToReferer, loading} = this.state

        if(redirectToReferer) {
            return <Redirect to="/" />
        }
        return (
            <div className ="container">
                <h2 className="mt-5 mb-5">SignIn</h2>

                <div className="alert alert-primary" style={{display: error ? "" : "none"}}>
                    {error}
                </div>

                {loading ? <div className="jumbotron text-center">
                           <h2>Loading...</h2>
                           </div>: ""}

               {this.signinForm(email, password)}
               
            </div>
        )
    }
}

export default Signin;