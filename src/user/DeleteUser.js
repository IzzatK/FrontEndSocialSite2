import {remove} from './apiUser'
import React, {Component} from 'react';
import {isAuthenticated} from '../auth/index'
import {signout} from '../components/Menu'
import {Redirect} from 'react-router-dom';

 class DeleteUser extends Component {

    state = {
        redirect: false
    }

    deleteConfirmed = () => {
        let answer = window.confirm("Are you sure you want to delete your account?");
        if(answer) {
            this.deleteAccount();
        }    
    }

    deleteAccount = () => {
        console.log("delete account method");
        const token = isAuthenticated().token;
        const userId = this.props.userId;
        remove(userId, token)
        .then(data=> {
            if(data.error) {
                console.log(data.error)
            } else {
                //signout user then redirect
                signout(() => console.log("user is deleted and signed out"))
                this.setState({redirect: true})
            }
        })
    }

    render() {
        if(this.state.redirect) {
            return <Redirect to="/"/>
        }
        return (
            <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">Delete Profile</button>

        )
    }
}

export default DeleteUser