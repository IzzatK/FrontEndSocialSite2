import React, {Component} from 'react';
import {isAuthenticated} from '../auth/index'
import {Redirect, Link} from 'react-router-dom';
import {read} from './apiUser'
import DefaultProfile from '../imgs/useravatar.png'
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs'
import {listByUser} from '../post/apiPost'

//profile component is shown below
class Profile extends Component {

    constructor() {
        super()
        this.state = {
            user: {following: [], followers: []},
            redirectToSignin: false,
            following: false,
            error: '',
            posts: []
            
        }
    }

    // read = (userId, token) => {
    //     return fetch(`${process.env.REACT_APP_API_URL}/user/${isAuthenticated().user._id}`, {
    //         method: "GET",
    //         headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json",
    //             Authorization : `Bearer ${isAuthenticated().token}`
    //         }
    //     }).then(response => {
    //         return response.json()
    //     }).catch(err => console.log(err))
    // }

    // getUserId = () => {
    //     const {name,email,createdDate} = this.state;

    //     const user = {
    //         name,
    //         email,
    //         createdDate
    //     }

    //     console.log(user.name);
    // }

    //check follow

    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            //one id has many other ids (followers) and vice versa 
            return follower._id === jwt.user._id
        })
        return match;
    }
//creating function in parent component to update the state of following props
    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token
        const profileId = this.state.user._id;
        console.log(profileId);
        callApi(userId, token, this.state.user._id).then(data => {
            if(data.error) {
                this.setState({error:data.error})
            }
            else {
                this.setState({user: data, following: !this.state.following})
            }
        })

    }

    loadPosts = userId => {
        const token = isAuthenticated().token
        listByUser(userId, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } 
            else {
                this.setState({posts: data})

            }
        })
        
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => {
            if(typeof data !== 'undefined' && data.error) {
                this.setState({redirectToSignin: true})

              
            }
            else {
                let following = this.checkFollow(data);
               this.setState({user: data, following})
               this.loadPosts(data._id)
               //  //this.setState({userId: this.props.match.params.userId,
                    //                   name: this.props.match.params.name})
            //    this.getUserId()

            }
        })
    }


//{`/user/${isAuthenticated().user._id}`}
    componentDidMount() {
        // console.log("user id for route params:", this.props.match.params.userId)
        const userId = this.props.match.params.userId;
        // const name2 = this.props.match.params.name;
        

        console.log("user id is" +"  " +userId)
        // console.log("name id is" +"  " +name2)

        this.init(userId);
        // this.setState({userId: this.props.match.params.userId})
    }

    //route of user ID can be made as props from react-router-dom module

    componentWillReceiveProps(props) {
        const userId = props.match.params.userId;
        this.init(userId);

    }

    



    render() {

        const {redirectToSignin, user, posts} = this.state;
        if(redirectToSignin) return <Redirect to="/signin" />
        const photoUrl = user._id ? `${process.env.REACT_APP_API_URL}/user/photo/${user._id}?${new Date().getTime()}` : DefaultProfile;


        return (
            <div className="container">
                              <h2 className="mt-5 mb-5">Profile</h2>

           <div className="row">
           <div className="col-md-4">

           <img style={{height:"200px", width:"auto"}} className="img-thumbnail" src={photoUrl} onError={i => (i.target.src=`${DefaultProfile}`)}alt={user.name}/>

           
              </div>
              <div className="col-md-8">
              <div className="lead mt-2">
                    
                    <p>Hello {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
    
                    </div>
                  {isAuthenticated().user && isAuthenticated().user._id === user._id ? (
                      <div className="d-inline-block mt-5">
                          <Link className="btn btn-raised btn-info mr-1" to={`/post/create`}>
                                Create Post
                            </Link>
                            <Link className="btn btn-raised btn-success mr-1" to={`/user/edit/${user._id}`}>
                                Edit Profile
                            </Link>
                            <DeleteUser userId={user._id}/>
                          </div>
                  ) : (<FollowProfileButton following = {this.state.following} onButtonClick={this.clickFollowButton}/>)}
              </div>
           </div>
           <div className="row">
               <div className="col-md-12 mt-5 mb-5">
                   <hr/>
                   <p className="lead">{user.about}</p>
                   <hr/>
                   <ProfileTabs followers ={user.followers} following = {user.following} posts={posts}/>

               </div>

           </div>
            </div>
        )
    }
}

export default Profile;