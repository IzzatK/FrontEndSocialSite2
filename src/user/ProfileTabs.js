import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import DefaultProfile from '../imgs/useravatar.png'

class ProfileTabs extends Component {
    //create
    render() {
        const {following, followers, posts} = this.props
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <h2 className="text-primary">Followers</h2>
                        <hr/>
                        {followers.map((person,i)=> {
                            return <div key={i}>
                                    <div><Link to={`/user/${person._id}`}>
                                        <img style={{borderRadius: "50%", border:'1px solid black'}}className="float-left mr-2" height="30px" width="30px" src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`} onError={i => (i.target.src=`${DefaultProfile}`)} alt={person.name}/><div><p className="lead">{person.name}</p></div></Link>
                                        </div>
                                        
                                
                            </div>
                        })}
                    </div>
                    <div className="col-md-4">
                        <h2 className="text-primary">Following</h2>
                        <hr/>
                        {following.map((person,i)=> {
                            return <div key={i}>
                                    <div><Link to={`/user/${person._id}`}>
                                        <img style={{borderRadius: "50%", border:'1px solid black'}}className="float-left mr-2" height="30px" width="30px" src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`} onError={i => (i.target.src=`${DefaultProfile}`)} alt={person.name}/><div><p className="lead">{person.name}</p></div></Link>
                                        </div>
                                        
                                
                            </div>
                        })}
                    </div>
                    <div className="col-md-4">
                    <h2 className="text-primary">Posts</h2>
                        <hr/>
                        {posts.map((post,i)=> {
                            return <div key={i}>
                                    <div><Link to={`/post/${post._id}`}>
                                        <div><p className="lead">{post.title}</p></div></Link>
                                        </div>
                                        
                                
                            </div>
                        })}
                    </div>
                 </div>

            
                   
            </div>
        )
    }
}

export default ProfileTabs;