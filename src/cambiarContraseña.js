import React from 'react';
import {Helmet} from "react-helmet";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import cookie from "react-cookies";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; 


export default class registro extends React.Component {
  constructor(props){
    super(props)
    this.pass = React.createRef()
    this.newPass = React.createRef()
    this.newPassC = React.createRef()
    this.regB = React.createRef()

    if (cookie.load("pass") === undefined || cookie.load("pass") === null) {
      this.removeCookies();
      this.props.history.push("/");
    }
  } 


  validarDatos = ()=>{
    const cookiePass = cookie.load("pass")
    const newPass = this.newPass.current.value
    const newPassC = this.newPassC.current.value
    if(this.pass.current.value === cookiePass &&
       newPass !== '' && newPass === newPassC
    ) {
      this.regB.current.disabled = false
      this.regB.current.onmouseup = this.actualizar
    }else{
      this.regB.current.disabled = true
    }
    
  }

  removeCookies() {
    cookie.remove("pass", { path: "/" });
  }

  saveCookies(pass) {
        cookie.save("pass", pass, { path: "/" });
    }


  actualizar = async () => {
    try {
    // console.log(this.nombre)
    //  console.log(this.nombre.current.value)

        //const sendUri = 'http://35.239.230.74:3010/'
        const sendUri = 'http://localhost:3017/'
        const pass = this.newPass.current.value
        const CVE_ID = cookie.load("idUsuario")

        const bodyJSON = {
          idUsuario: CVE_ID,
          pass: pass
        };
        const response = await fetch(sendUri, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyJSON)
        })
        const responseJson = await response.json().then(r => {
          //console.log(`Response1: ${r}`)
          if(r[0]!==undefined&&`${r[0].idUsuario}`===`${CVE_ID}`){
          this.removeCookies()
          this.saveCookies(r[0].pass)
          confirmAlert({
            title: "Edición con éxito",
            message: "La contraseña se actualizó correctamente.",
            buttons: [
              {
                label: "Aceptar",
                onClick: () => {
                  this.props.history.push('/')
                }
              }
              
            ]
          });

          } else if (r.error.name === 'error01') {
            confirmAlert({
              title: "¡Error!",
              message: "N° de empleado NO éxiste.",
              buttons: [{
                label: "Aceptar",
                onClick: () => {
                    this.props.history.push("/");
                }
              }]
            });
          } 
        })
        

    } catch (e) {
        console.log(`Error: ${e}`)
    }
};

  render(){
            return (
              <>
                <Helmet>
                  <title>Actualizar registro</title>
                  <meta name="description" content="Helmet application" />
                </Helmet>
                <div className="App">
                  <header className="App-header">
                    <h1> ACTUALIZAR CONTRASEÑA </h1>

                    <div
                      style={{
                        borderWidth: 1,
                        borderStyle: "solid",
                        padding: 15,
                        borderRadius: 5
                      }}
                    >
                      <div>
                        <table style={{ width: "100%" }}>
                          <tbody>
                            
                            <tr>
                              <td style={{ textAlign: "left" }}>Contraseña actual:</td>
                              <td>
                                <input ref={this.pass}
                                onKeyUp = {this.validarDatos}
                                onMouseUp = {this.validarDatos}
                                type="password"
                                className="form-control" />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: "left" }}>Nueva contraseña:</td>
                              <td>
                                <input ref={this.newPass}
                                onKeyUp = {this.validarDatos}
                                onMouseUp = {this.validarDatos}
                                type="password"
                                className="form-control" />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: "left" }}>Confirmar contraseña:</td>
                              <td>
                                <input ref={this.newPassC}
                                onKeyUp = {this.validarDatos}
                                onMouseUp = {this.validarDatos}
                                type="password"
                                className="form-control" />
                              </td>
                            </tr>

                          </tbody>
                        </table>
                      </div>
                      <br />
                      <div
                        style={{
                          display: "flex",
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flex: 1,
                            alignItems: "flex-start",
                            justifyContent: "flex-end"
                          }}
                        >
                          <button ref={this.regB}
                          className="btn btn-success"
                          onMouseUp={this.actualizar} 
                          disabled>ACTUALIZAR</button>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flex: 1,
                            alignItems: "flex-start",
                            justifyContent: "flex-end"
                          }}
                        >
                          <Link to="/editar" className="link">
                            <button className="btn btn-danger" onClick={this.cancelar} >CANCELAR</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </header>
                </div>
              </>
            );
          }
}

