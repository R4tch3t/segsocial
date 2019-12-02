import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import {Helmet} from "react-helmet";
import entrar from './entrar';
import registro from './registro';
import inicio from "./inicio";
import inicioAdmin from "./inicioAdmin";
import editar from "./editar";
import './App.css';
import './inicio.css';
import './bootstrap.css';

export default class App extends React.Component {
 
  render(){
    
            return (
              <>
              <Helmet>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
              </Helmet>
              <BrowserRouter>
                <div>
                  
                    <Switch>
                      <Route
                        path="/"
                        exact component={entrar} />
                      <Route
                        path="/entrar"
                        exact component={entrar} />
                      <Route
                        path="/registro"
                        exact component={registro} />
                      <Route
                        path="/inicio"
                        exact component={inicio} />  
                        <Route
                        path="/inicioAdmin"
                        exact component={inicioAdmin} />
                        <Route
                        path="/editar"
                        exact component={editar} />  
                    </Switch>

                </div>
              </BrowserRouter>
              </>
            );
          }
}

