import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {isAuthenticated} from '../auth/index'

const isActive = (history, path) => {
    if(history.location.pathname === path) return {color: "#ff9000"}
    else return{color: "#40E0D0"}
}

export const signout = (next) => {
    if(typeof window !== "undefined") localStorage.removeItem("jwt");
    next();
    return fetch("http://localhost:8080/signout", {
        method: "GET"
    }).then(response => {
        window.alert("you've logged out");
        console.log('signout', response);
        return response.json();
    }).catch(err => console.log(err))

}




//write style after the style {} curly braces using a comma, and some more {} curly braces to enclose the CSS markup

const Menu = ({history}) => ( 
    <div className="container">
       <ul className="nav nav-tabs bg-secondary">
           <li className="nav-item">
               <Link style={isActive(history, "/")} id="linktext"className="nav-link" to="/">Home</Link>
           </li>
           
           <li className="nav-item">
               <Link style={isActive(history, "/users")} id="linktext"className="nav-link" to="/users">Users</Link>
           </li>

           <li className="nav-item">
               <span className="nav-link"><Link to={`/post/create`} style={isActive(history, `/post/create`)}>Create Post</Link></span>
           </li>

         {!isAuthenticated() && (
             <>
               <li className="nav-item">
               <Link style={isActive(history, "/signin")} className="nav-link" to="/signin">Sign In</Link>
           </li>
           <li className="nav-item">
               <Link style={isActive(history, "/signup")} className="nav-link" to="/signup">Sign Up</Link>
           </li>
           </>
         )}

<li className="nav-item">
               <span className="nav-link"><Link to={`/findpeople`} style={isActive(history, `/findpeople`)}>Find People</Link></span>
           </li>
          

           {isAuthenticated() && (<><li className="nav-item">
               <span style={{color:"#40E0D0"}}onClick={() => signout(() => history.push('/'))} className="nav-link" to="/signout">Sign Out</span>
           </li>
           <li className="nav-item">
               <span className="nav-link"><Link to={`/user/${isAuthenticated().user._id}`} style={isActive(history, `/user/${isAuthenticated().user._id}`)}>{`${isAuthenticated().user.name}'s profile`}</Link></span>
           </li></>)}
           {/*JSON.stringify(props.history)*/}
          
       </ul>
    </div>
);

export default withRouter(Menu);