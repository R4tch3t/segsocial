import React from 'react';
import {Helmet} from "react-helmet";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; 


export default class registro extends React.Component {
  constructor(){
    super()
    this.nombre = React.createRef()
    this.correo = React.createRef()
    this.edad = React.createRef()
    this.pass = React.createRef()
    this.passC = React.createRef()
    this.CVE_ID = React.createRef()
    this.regB = React.createRef()
  } 
  
  obtenerEdad = (str) => {
      const currentD = new Date()
      const y = currentD.getFullYear().toString().substring(2, 4)
      const fechaN = str.substring(4, 10);
      var a = parseInt(fechaN.substring(0, 2));
      a = a > parseInt(y) ? parseInt(`19${a}`) : parseInt(`20${a}`);
      const m = parseInt(fechaN.substring(2, 4));
      const d = parseInt(fechaN.substring(4, 6));
      return (currentD.getMonth() < m ||
        currentD.getMonth() == m && currentD.getDate() < d) ? currentD.getFullYear() - a - 1 : currentD.getFullYear() - a;
  }

  validarDatos = ()=>{

    const correo = this.correo.current.value.toLowerCase()
    const splitA = correo.split("@")
    const pass = this.pass.current.value
    const passC = this.passC.current.value
    if (splitA.length > 1) {
      const splitB = splitA[1].split(".")
      if(this.CVE_ID.current.value !== ''&&
      this.nombre.current.value !== '' &&
      this.correo.current.value !== '' &&
      this.edad.current.value !== '' &&
      pass !== '' && (pass === passC) &&
      !isNaN(this.edad.current.value) &&
      splitB[1] === "com") {
        this.regB.current.disabled = false
        this.regB.current.onmouseup = this.registrar
      }else{
        this.regB.current.disabled = true
      }
    }
  }


  getinfoReg = async() => {
    try{
    const sendUri = 'http://localhost:3010/'
    const CVE_ID = this.CVE_ID.current.value

    const bodyJSON = {
      CVE_ID: CVE_ID
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
      if (r[0] !== undefined) {
        
        this.nombre.current.value = r[0].n;
        this.edad.current.value = this.obtenerEdad(r[0].c);
        this.validarDatos()

      }
    })
    }catch(e){
      console.log(e)
    }
  }

  registrar = async () => {
    try {
    // console.log(this.nombre)
    //  console.log(this.nombre.current.value)

        //const sendUri = 'http://35.239.230.74:3010/'
        const sendUri = 'http://localhost:3011/'
        const CVE_ID = this.CVE_ID.current.value
        const nombre = this.nombre.current.value
        const correo = this.correo.current.value
        const edad = this.edad.current.value
        const pass = this.pass.current.value
        
        const bodyJSON = {
          idUsuario: CVE_ID,
          nombre: nombre,
          correo: correo,
          edad: edad,
          pass: pass,
          idRol: 0
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
          if(r[0]!==undefined&&r[0].correo===correo){
          
          confirmAlert({
            title: "Registro con éxito",
            message: "El usuario se ha registrado con éxito.",
            buttons: [
              {
                label: "Aceptar",
                onClick: () => {
                  this.props.history.push('/entrar')
                }
              }
              
            ]
          });

          } else if (r.error.name === 'error01') {
            confirmAlert({
              title: "¡Error!",
              message: "N° de empleado ya éxiste.",
              buttons: [{
                label: "Aceptar",
                onClick: () => {
                  //  this.props.history.push("/entrar");
                }
              }]
            });
          } else if (r.error.name === 'error02') {
            confirmAlert({
              title: "¡Error!",
              message: "Empleado no encontrado.",
              buttons: [{
                label: "Aceptar",
                onClick: () => {
                  //  this.props.history.push("/entrar");
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
                  <title>Registro de usuarios</title>
                  <meta name="description" content="Helmet application" />
                </Helmet>
                <div className="App">
                  <header className="App-header">
                    <h1> REGISTRO DE USUARIOS </h1>

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
                              <td style={{ textAlign: "left" }}>N° de empleado:</td>
                              <td>
                                <input ref={this.CVE_ID} type="number" onKeyUp = {this.getinfoReg} 
                                onMouseUp = {this.getinfoReg} className="form-control"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: "left" }}>Nombre:</td>
                              <td>
                                <input ref={this.nombre} 
                                onKeyUp = {this.validarDatos}
                                onMouseUp = {this.validarDatos}
                                type="text"
                                className="form-control" />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: "left" }}>Correo:</td>
                              <td>
                                <input ref={this.correo}
                                onKeyUp = {this.validarDatos}
                                onMouseUp = {this.validarDatos}
                                type="text"
                                className="form-control" />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: "left" }}>Edad:</td>
                              <td>
                                <input ref={this.edad}
                                onKeyUp = {this.validarDatos}
                                onMouseUp = {this.validarDatos}
                                type="number"
                                className="form-control" />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: "left" }}>Contraseña:</td>
                              <td>
                                <input ref={this.pass}
                                onKeyUp = {this.validarDatos}
                                onMouseUp = {this.validarDatos}
                                type="password"
                                className="form-control" />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: "left" }}>Confirmar contraseña:</td>
                              <td>
                                <input ref={this.passC}
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
                          className="btn btn-primary"
                          onMouseUp={this.registrar} 
                          disabled>REGISTRAR</button>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flex: 1,
                            alignItems: "flex-start",
                            justifyContent: "flex-end"
                          }}
                        >
                          <Link to="/entrar" className="link">
                            <button className="btn btn-danger">CANCELAR</button>
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

