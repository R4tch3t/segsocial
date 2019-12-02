import React from 'react';
import {Helmet} from "react-helmet";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import cookie from "react-cookies";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; 


export default class registro extends React.Component {
  constructor(props){
    super(props)
    this.nombre = React.createRef()
    this.correo = React.createRef()
    this.edad = React.createRef()
    this.pass = React.createRef()
    this.newPass = React.createRef()
    this.CVE_ID = React.createRef()
    this.regB = React.createRef()

    if (cookie.load("pass") === undefined || cookie.load("pass") === null) {
      this.removeCookies();
      this.props.history.push("/");
    }
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
    const cookiePass = cookie.load("pass")
    const correo = this.correo.current.value.toLowerCase()
    const splitA = correo.split("@")
    if (splitA.length > 1) {
      const splitB = splitA[1].split(".")
      if(this.CVE_ID.current.value !== ''&&
      this.nombre.current.value !== '' &&
      this.correo.current.value !== '' &&
      this.edad.current.value !== '' &&
      this.pass.current.value === cookiePass &&
      !isNaN(this.edad.current.value) &&
      splitB[1] === "com") {
        this.regB.current.disabled = false
        this.regB.current.onmouseup = this.actualizar
      }else{
        this.regB.current.disabled = true
      }
    }
  }

  removeCookies() {
    cookie.remove("idUsuario");
    cookie.remove("nombre");
    cookie.remove("correo");
    cookie.remove("edad");
    cookie.remove("idRol");
    cookie.remove("pass");
  }

  saveCookies(idUsuario, nombre, correo, edad, idRol, pass) {
        cookie.save("idUsuario", idUsuario, { path: "/" });
        cookie.save("nombre", nombre, { path: "/" });
        cookie.save("correo", correo, { path: "/" });
        cookie.save("edad", edad, { path: "/" });
        cookie.save("idRol", idRol, { path: "/" });
        cookie.save("pass", pass, { path: "/" });
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

  actualizar = async () => {
    try {
    // console.log(this.nombre)
    //  console.log(this.nombre.current.value)

        //const sendUri = 'http://35.239.230.74:3010/'
        const sendUri = 'http://localhost:3016/'
        const CVE_ID = this.CVE_ID.current.value
        const nombre = this.nombre.current.value
        const correo = this.correo.current.value
        const edad = this.edad.current.value
        const pass = this.newPass.current.value
        
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
          if(r[0]!==undefined&&`${r[0].idUsuario}`===`${CVE_ID}`){
          this.removeCookies()
          this.saveCookies(CVE_ID, r[0].nombre, r[0].correo, r[0].edad, r[0].idRol, r[0].pass)
          confirmAlert({
            title: "Edición con éxito",
            message: "El usuario se ha actualizado con éxito.",
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
    const idUsuario = cookie.load("idUsuario")
    const nombre = cookie.load("nombre")
    const correo = cookie.load("correo")
    const edad = cookie.load("edad")
            return (
              <>
                <Helmet>
                  <title>Actualizar registro</title>
                  <meta name="description" content="Helmet application" />
                </Helmet>
                <div className="App">
                  <header className="App-header">
                    <h1> EDITAR DATOS </h1>

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
                                <input ref={this.CVE_ID} type="number" defaultValue={idUsuario} readOnly />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: "left" }}>Nombre:</td>
                              <td>
                                <input ref={this.nombre} 
                                onKeyUp = {this.validarDatos}
                                onMouseUp = {this.validarDatos}
                                type="text" defaultValue={nombre} />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: "left" }}>Correo:</td>
                              <td>
                                <input ref={this.correo}
                                onKeyUp = {this.validarDatos}
                                onMouseUp = {this.validarDatos}
                                type="text" defaultValue={correo} />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: "left" }}>Edad:</td>
                              <td>
                                <input ref={this.edad}
                                onKeyUp = {this.validarDatos}
                                onMouseUp = {this.validarDatos}
                                type="number" defaultValue={edad} />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: "left" }}>Contraseña:</td>
                              <td>
                                <input ref={this.pass}
                                onKeyUp = {this.validarDatos}
                                onMouseUp = {this.validarDatos}
                                type="password" />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ textAlign: "left" }}>Nueva contraseña:</td>
                              <td>
                                <input ref={this.newPass}
                                onKeyUp = {this.validarDatos}
                                onMouseUp = {this.validarDatos}
                                type="password" />
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
                          <Link to="/" className="link">
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

