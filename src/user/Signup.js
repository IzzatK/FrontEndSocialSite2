import React, {Component} from 'react';
import {Link} from 'react-router-dom'


//below one can see using open: false variable how to conditonally render components

class Signup extends Component {

    constructor() {
        super()
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false
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

    clickSubmit = event => {
        event.preventDefault()
        const {name, email, password} = this.state;

        const user = {
            name,
            email,
            password
        }
        this.signup(user).then(data => {
            if(data.error) this.setState({error: data.error})

            else this.setState({
                error: "",
                name: "",
                email: "",
                password: "",
                open: true
            })
        })
     
    }

    signup = (user) => {
          return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
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

    signupForm = (name, email, password) => {
        return <form action>
        <div className="form-group">
            <label className="text-muted">Name</label>
            <input onChange={this.handleChange("name")} type="text" className="form-control" value={name}/>
        </div>
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
//conditional styling below in the alert-primary div. if open is true, execute first statement "", else execute 
//display "none"

    render() {
        const {name, email, password, error, open} = this.state
        return (
            <div className ="container">
                <h2 className="mt-5 mb-5">Signup</h2>

                <div className="alert alert-primary" style={{display: error ? "" : "none"}}>
                    {error}
                </div>

                
                <div className="alert alert-info" style={{display: open ? "" : "none"}}>
                    New Account is successfully created. Please <Link to="/signin">Sign In</Link> 
                </div>

               {this.signupForm(name, email, password)}
               
            </div>
        )
    }
}

export default Signup;