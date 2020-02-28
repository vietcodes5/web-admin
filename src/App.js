import React,{Component} from 'react'
import firebase from 'firebase/app'

import Login from './templates/Login'
import Admin from './templates/Admin'



class App extends Component {
  constructor(){
    super()
    this.state = {
      currentPage : ''
    }
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(user){
        this.setState({
          currentPage: <Admin/>
        })
      }else{
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
