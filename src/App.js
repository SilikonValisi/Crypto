import React from 'react';
import './App.css';
import CryptoTableView from './CryptoTableView';
import SingleCoinDisplay from './SingleCoinDisplay'
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'
import io from 'socket.io-client';



function App() {
  const socket = io("wss://socket.cryptoindexseries.com");

  return (
    <Router>
          <div className="App">
      <Switch>
        <Route path="/" exact component={CryptoTableView} />
        <Route path="/coin/:symbol" render={(props) => <SingleCoinDisplay {...props} socket={socket} /> } />
        
      </Switch>
    </div>
    </Router>
  );
}

export default App;
