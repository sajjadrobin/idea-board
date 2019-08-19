// @flow
import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom"

import Ideas from "./ideas";
import AddIdea from "./ideas/add";

class App extends Component<{}> {

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/add" component={AddIdea}/>
          <Route path="/" component={Ideas} />
          <Route render={()=><Redirect to="/"/>}/>
        </Switch>
      </Router>
    )
  }
}

export default App;
