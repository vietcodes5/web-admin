import React,{Component} from 'react';

import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

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
      if (user){
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
      <ThemeProvider theme={theme}>
        {this.state.currentPage}
      </ThemeProvider>
    )
  }
}

export default App
