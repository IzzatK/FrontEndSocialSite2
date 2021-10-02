import React from 'react';
/*import ToDoApp from './components/todo/ToDoApp'  import Counter from './components/counter/Counter'
*/

//code for MainRouter goes here

import {Loading} from './components/practice/Loading'
import './bootstrap.css';
import './App.css';
import axios from 'axios';
import {BrowserRouter} from 'react-router-dom'
import MainRouter from './MainRouter'

const AppReact = () => (
     <BrowserRouter>
     <MainRouter />
     </BrowserRouter>           
)


/*import FirstComponent from './components/learning-examples/FirstComponent'
import SecondComponent from './components/learning-examples/SecondComponent'
import ThirdComponent from './components/learning-examples/ThirdComponent'*/



 //simple server code above
 //AppReact is a component that has ToDoApp inside of its render method
// class AppReact extends Component 
// {

//   // constructor(props) {
//   //   super(props)
  
//   //   this.state = {
//   //     users: [],
//   //     loading:false
//   //   }
//   //   //bind a function
//   //   this.handleSubmit = this.handleSubmit.bind(this);
    
//   // }
// // //accessor method below
// //   getUsers() {
// //     this.setState({
// //       loading:true
// //     })

// //     axios('https://api.randomuser.me/?nat=US&results=5').then(response => this.setState({
// //           users: [...this.state.users, ...response.data.results],
// //            loading:false
// //          }));
// //   }

// //   handleSubmit(e) {
// //     e.preventDefault();
// //     this.getUsers();
// //     console.log('more users loaded')
// //   }

// //   componentWillMount() {
// //     //if loading is not true then map the user's attributes, else print 'Loading'
// //     // axios('https://api.randomuser.me/?nat=US&results=5').then(response => console.log(response));
// //          this.getUsers();

// //   }
//   render(){
//     const {loading, users} = this.state
//     return(
//       <div className="App"> 
       

//     {/* <Counter/>*/}
//     {/*<ToDoApp/>*/}

    


    

//     </div>

//           );
//   }
// }

/*class LearningComponents extends Component
{
 render()
  {
    return   (
      <div className="LearningComponents">
      My Hello World
      <FirstComponent></FirstComponent>
      <SecondComponent></SecondComponent>
      <ThirdComponent></ThirdComponent>
      </div> );
  }
  }

//Class Component which is called as a nested or "child" component above
//We export these classes from a component folder as shown above
/*class FirstComponent extends Component {
  render() {
    return (
      <div className="firstComponent">
      First Component 
      </div>
    );
  }
}*/

/*class SecondComponent extends Component {
  render() {
    return (
      <div className="secondComponent">
      Second Component 
      </div>
    );
  }
} */



export default AppReact;