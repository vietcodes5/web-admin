import React,{Component} from 'react';
import firebase from 'firebase/app';

import Login from './layouts/Login';
import Admin from './layouts/Admin';
import "./App.css";



class App extends Component {
  constructor(){
    super()
    this.state = {
      currentPage : null,
    }
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        this.setState({
          currentPage: <Admin/>
        })
      } else {
        this.setState({
          currentPage: <Login/>
        })
      }
    })
  }
  render(){
    return (
      <div>
        {this.state.currentPage}
      </div>
    )
  }
}

export default App
