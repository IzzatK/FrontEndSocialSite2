import React, {Component} from 'react'
import './Counter.css'
import PropTypes from 'prop-types'

class Counter extends Component{


    increment  (by)  { //update state to counter++
         // console.log('increment');
        // this.state.counter++;
       //console.log(`increment from parent - ${by}`)
              this.setState((prevState)=>{
                             
                               return {counter: prevState.counter + by}
                              //secondCounter: this.state.secondCounter +1
         });
  }
  decrement  (by)  { //update state to counter++
     // console.log('increment');
   // this.state.counter++;
    //console.log(`increment from parent - ${by}`)
          this.setState((prevState)=>{
                         
                           return {counter: prevState.counter - by}
                           //secondCounter: this.state.secondCounter +1
    });
 }
resetcount(){
    this.setState({counter: 0});
        //secondCounter: this.state.secondCounter +1

}

    constructor(){
        super();
         this.state = {
             counter : 0
         } 
         this.increment = this.increment.bind(this);
         this.decrement = this.decrement.bind(this);
        this.resetcount = this.resetcount.bind(this);
    }

    render() 
  {
    return   (
     <div className="counter">
     <CounterButton by ={1} incrementMethod={this.increment} decrementMethod={this.decrement}/>
     <CounterButton by={5} incrementMethod={this.increment} decrementMethod={this.decrement}/>
     <CounterButton by={10} incrementMethod={this.increment} decrementMethod={this.decrement}/>
     <span className="count">{this.state.counter}</span>
     <div><button className="reset" onClick={this.resetcount}>Reset</button></div>
     </div>
             );
  }
}


 class CounterButton extends Component {

    //define the initial state in a constructor
    //state => counter

   constructor(){
        super();
        // this.state = {
        //     counter : 0
        // } 
        // this.increment = this.increment.bind(this);
        // this.decrement = this.decrement.bind(this);
    }
    render  ()  {   //can use the below const to style the counter inline, just set style = {style}>this.state.counter 
                   //let || const style = {fontSize:"50px",  padding:"15px 30px"}  //can create an arrow function 
                    
                   return (
                    <div className="Counter">
   
                    <button onClick={() => this.props.incrementMethod(this.props.by)}>+{this.props.by}</button>
                    <button onClick={() =>this.props.decrementMethod(this.props.by)}>-{this.props.by}</button>
                   {/* <span className="count">{this.state.counter}</span> */}
                    
                     </div>
                   )
    }
    // increment  ()  
    // { //update state to counter+
    //    // console.log('increment');
    //   // this.state.counter++;
    //         this.setState({ 
    //                          counter: this.state.counter + this.props.by
    //                      });
    //  this.props.incrementMethod(this.props.by);
    // }
    // decrement  ()  
    // {
    //         this.setState({ 
    //                          counter: this.state.counter - this.props.by
    //                      });
    //  this.props.decrementMethod(this.props.by);
    // }
 }
 CounterButton.defaultProps = {
     by : 1,
 }

 CounterButton.propTypes = {
     by : PropTypes.number 
 }
export default Counter;
