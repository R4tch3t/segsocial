import React from 'react';
import {Helmet} from "react-helmet";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; 
import cookie from "react-cookies";


export default class entrar extends React.Component {
    constructor(props) {
      super(props);
      if (cookie.load("pass") !== undefined) {
        /*this.comprobarU(
          cookie.load("nombre"),
          cookie.load("pass")
        );*/
        const idRol = cookie.load("idRol")
        if (idRol === "0") {
          this.props.history.push("/inicio");
        } else if (idRol === "1") {
          this.props.history.push("/inicioAdmin");
        }
      }
      this.idUsuario = React.createRef();
      this.pass = React.createRef();
      
    }
    
    saveCookies(idUsuario, nombre, correo, edad, idRol, pass) {
        cookie.save("idUsuario", idUsuario, { path: "/" });
        cookie.save("nombre", nombre, { path: "/" });
        cookie.save("correo", correo, { path: "/" });
        cookie.save("edad", edad, { path: "/" });
        cookie.save("idRol", idRol, { path: "/" });
        cookie.save("pass", pass, { path: "/" });
    }

    entrar = () => {
      this.comprobarU(
        this.idUsuario.current.value,
        this.pass.current.value
      );
    }

    entrarKey = (e) => {
      if(e.which===13){ 
        this.comprobarU(
          this.idUsuario.current.value,
          this.pass.current.value
        );
     }
    }

    comprobarU = async (idUsuario, pass) => {
      try {
        // console.log(this.nombre)
      //  console.log(this.nombre.current.value);

      // const sendUri = 'http://35.239.230.74:3011/'
        const sendUri = "http://localhost:3012/";
      // const nombre = this.nombre.current.value;
      // const pass = this.pass.current.value;

        const bodyJSON = {
          idUsuario: idUsuario,
          pass: pass
        };
        const response = await fetch(sendUri, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bodyJSON)
        });
        const responseJson = await response.json().then(r => {
        //  console.log(`Response1: ${r[0].idUsuario}`)
        //  console.log(`Response1: ${idUsuario}`)
          if (
            r[0] !== undefined &&
            (`${r[0].idUsuario}` === `${idUsuario}`)
          ) {
          // cookie.save("nombre", nombre, { path: "/" });
            // cookie.save("nombre", nombre, { path: "/entrar" });
            //cookie.save("pass", pass, { path: "/" });
            // cookie.save("pass", pass, { path: "/entrar" });
            
            this.saveCookies(idUsuario, r[0].nombre, r[0].correo, r[0].edad, r[0].idRol, pass)
            if(r[0].idRol===0){
              this.props.history.push("/inicio");
            }else if(r[0].idRol===1){
              this.props.history.push("/inicioAdmin");
            }
            /*confirmAlert({
  title: "Comprobación con éxito",
  message: "El usuario se ha comprobado con éxito.",
  buttons: [
    {
      label: "Aceptar",
      onClick: () => {
        this.props.history.push("/inicio");
      }
    }
  ]
});*/
          } else if (r.error.name === "error01") {
            confirmAlert({
              title: "¡Error!",
              message: "La contraseña es incorrecta.",
              buttons: [
                {
                  label: "Aceptar",
                  onClick: () => {
                    //  this.props.history.push("/entrar");
                  }
                }
              ]
            });
          } else if (r.error.name === "error02") {
            confirmAlert({
              title: "¡Error!",
              message: "N° de empleado no registrado.",
              buttons: [
                {
                  label: "Aceptar",
                  onClick: () => {
                    //  this.props.history.push("/entrar");
                  }
                },
                {
                  label: "Registrarse",
                  onClick: () => {
                    this.props.history.push("/registro");
                  }
                }
              ]
            });
          }
        });
      } catch (e) {
        console.log(`Error: ${e}`);
      }
    };

    render() {
      return (
        <>
          <Helmet>
            <title>Seguridad Social</title>
            <meta name="description" content="Helmet application" />
          </Helmet>
          <div className="App">
            <header className="App-header">
              <h1> ACCESO AL SISTEMA </h1>

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
                        <td className="login loginM">N° de empleado:</td>
                        <td>
                          <input
                            ref={this.idUsuario}
                            onKeyUp={this.entrarKey}
                            className="form-control"
                            type="number"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "left" }}>Contraseña:</td>
                        <td>
                          <input
                            ref={this.pass}
                            onKeyUp={this.entrarKey}
                            className="form-control"
                            type="password"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

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
                    <button className="btn btn-success" onClick={this.entrar}>
                      ENTRAR
                    </button>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      alignItems: "flex-start",
                      justifyContent: "flex-end"
                    }}
                  >
                    <Link to="/registro" className="link">
                      <button to="/registro" className="btn btn-primary">
                        REGISTRO
                      </button>
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

