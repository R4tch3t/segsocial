import React from 'react';
import {Helmet} from "react-helmet";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";
import ReactDOM from 'react-dom';
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; 
import cookie from "react-cookies";
import userI from './icons/person.png';
import reload from './icons/ios-refresh.svg';
import search from './icons/search.png';


export default class entrar extends React.Component {
  state = {
    idUsuario: null,
    idQuincena: '',
    nombre: null,
    correo: null,
    edad: null,
    idRol: null,
    pass: null
  }
  page = []
  pageC=0
  trTotal = null
  constructor(props){
    super(props)
    this.nombre = React.createRef()
    this.pass = React.createRef()
    this.quincenas = React.createRef()
    if (cookie.load("pass") !== undefined && cookie.load("pass") !== null && `${cookie.load("idRol")}` === `1`) {
      this.state = { 
        idUsuario: cookie.load("idUsuario"),
        idQuincena: '', 
        nombre: cookie.load("nombre"),
        correo: cookie.load("correo"),
        idRol: cookie.load("idRol"),
        pass: cookie.load("pass") 
      };
      const { idUsuario } = this.state;
      const { pass } = this.state;
      
      this.comprobarU(idUsuario, pass);
    } else {
      this.removeCookies();
      this.props.history.push("/");
    }

  } 

  componentWillMount() {
    
  }

  removeCookies(){
    cookie.remove("idUsuario");
    cookie.remove("nombre");
    cookie.remove("correo");
    cookie.remove("edad");
    cookie.remove("idRol");
    cookie.remove("pass");
  }
  
  obtenerD = async (e) => {
   const qb = document.getElementById("quincenasB")
   const idUsuario = document.getElementById("nEmpleado").value;
   qb.innerHTML = e.descripcion
   document.getElementById('spinnerL').style.opacity = 1
   this.setState({idQuincena: e.idQuincena})
   this.createQT(idUsuario, e.idQuincena)
  }

  searchQ = async () => {
   const idUsuario = document.getElementById("nEmpleado").value;
   const {idQuincena} = this.state 
   document.getElementById('spinnerL').style.opacity = 1
   this.createQT(idUsuario, idQuincena)
  }
  
  nextPag = (e) => {
    const next = this.pageC + 5 
    if(next<this.page.length){
      this.paginar(this.pageC, next)
      const prevPag = document.getElementById("prevPag")
      prevPag.disabled = false
      prevPag.onmouseup = this.prevPag
    }else{
      this.paginar(this.pageC, this.page.length)
      e.target.disabled = true
    }
  }

  prevPag = (e) => {
    const prev = this.pageC - 10
    if (prev > 0) {
      this.paginar(prev, this.pageC-5)
      const nextPag = document.getElementById("nextPag")
      nextPag.disabled = false
      nextPag.onclick = this.nextPag
    } else {
      this.paginar(0, 5)
      e.target.disabled = true
    }
  }

  paginar = (i, f) => {
    const tboydQ = document.getElementById("tbodyQ")
    tboydQ.innerHTML = ''
    while(i<f){
      const e = this.page[i]
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");
      const td4 = document.createElement("td");
      const td5 = document.createElement("td");
      th.scope = 'row'
      td2.style.textAlign = 'left'
      th.style.verticalAlign = 'middle'
      td1.style.verticalAlign = 'middle'
      td2.style.verticalAlign = 'middle'
      td3.style.verticalAlign = 'middle'
      td4.style.verticalAlign = 'middle'
      td5.style.verticalAlign = 'middle'
      th.innerHTML = (i+1)
      td1.innerHTML = e.idEmpleado
      td2.innerHTML = e.NOMBRE
      td3.innerHTML = e.descripcion
      td4.innerHTML = e.desc_credito_fovisste
      td5.innerHTML = e.desc_seguro_de_daños_fovisste
      tr.appendChild(th)
      tr.appendChild(td1)
      tr.appendChild(td2)
      tr.appendChild(td3)
      tr.appendChild(td4)
      tr.appendChild(td5)
      tboydQ.appendChild(tr)
      i++
    }
    this.pageC = i
    tboydQ.appendChild(this.trTotal)

  }

  createQT = async (idUsuario,idQuincena) => {
      try {
        
        //const sendUri = 'http://35.239.230.74:3011/'
        const sendUri = "http://localhost:3015/";

        const bodyJSON = {
          idUsuario: idUsuario,
          idQuincena: idQuincena
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
          //console.log(`Response1: ${r}`)
          const tboydQ = document.getElementById("tbodyQ")
          tboydQ.innerHTML = ''
         // this.page = []
          if (r.data !== undefined && r.data.length > 0) {
            const nextPag = document.getElementById('nextPag')
            var totalC = 0.0
            var totalS = 0.0
            
            this.page = r.data
            r.data.forEach(e => {
              totalC += parseFloat(e.desc_credito_fovisste.toString().replace('.', '').replace(',', '.'))
              totalS += parseFloat(e.desc_seguro_de_daños_fovisste.toString().replace('.', '').replace(',', '.'))
            });

            this.trTotal = document.createElement("tr");
            const th = document.createElement("th");
            const td = document.createElement("td");
            const td2 = document.createElement("td");
            th.scope = 'row'
            th.colSpan = '4'
            th.innerHTML = 'TOTAL'
            td.innerHTML = totalC.toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            td2.innerHTML = totalS.toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            this.trTotal.appendChild(th)
            this.trTotal.appendChild(td)
            this.trTotal.appendChild(td2)
            if (r.data.length > 4) {
              nextPag.disabled = false
              nextPag.onclick = this.nextPag
              this.paginar(0, 5)
            }else{
              nextPag.disabled = true
              this.paginar(0, r.data.length)
            }
            
          } 
          document.getElementById('spinnerL').style.opacity = 0
          /*else if (r.error.name === "error01") {
            this.removeCookies()
            confirmAlert({
              title: "¡Error!",
              message: "La contraseña es incorrecta.",
              buttons: [{
                label: "Aceptar",
                onClick: () => {
                  this.props.history.push("/entrar");
                }
              }]
            });
          }*/ 
        });
      } catch (e) {
        console.log(`Error: ${e}`);
      }
  }

  obtenerQ = async (idUsuario,idQuincena) => {
      try {
        
        //const sendUri = 'http://35.239.230.74:3011/'
        const sendUri = "http://localhost:3015/";

        const bodyJSON = {
          idUsuario: idUsuario,
          idQuincena: idQuincena
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
        //  console.log(`Response1: ${r}`)
          
          if (r.quincenas!==undefined && r.quincenas.length>0 ) {
            const nextPag = document.getElementById('nextPag')
            var totalC = 0.0
            var totalS = 0.0
            const tboydQ = document.getElementById("tbodyQ")
            const quincenas = document.getElementById("quincenas")
            tboydQ.innerHTML = ''
            quincenas.innerHTML = ''
            
            r.quincenas.forEach(e => {
              const children = document.createElement("a");
              children.innerHTML = e.descripcion
              children.className = 'dropdown-item'
              children.id = e.idQuincena
              quincenas.appendChild(children)
              children.onmouseup = () => this.obtenerD(e)
            });

            this.page = r.data
            r.data.forEach(e => {
               totalC += parseFloat(e.desc_credito_fovisste.toString().replace('.', '').replace(',', '.'))
               totalS += parseFloat(e.desc_seguro_de_daños_fovisste.toString().replace('.', '').replace(',', '.'))
            });
 
            this.trTotal = document.createElement("tr");
            const th = document.createElement("th");
            const td = document.createElement("td");
            const td2 = document.createElement("td");
            th.scope = 'row'
            th.colSpan = '4'
            th.innerHTML = 'TOTAL'
            td.innerHTML = totalC.toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            td2.innerHTML = totalS.toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            this.trTotal.appendChild(th)
            this.trTotal.appendChild(td)
            this.trTotal.appendChild(td2)
            if (r.data.length > 4) {
              nextPag.disabled = false
              nextPag.onclick = this.nextPag
              this.paginar(0, 5)
            } else {
              nextPag.disabled = true
              this.paginar(0, r.data.length)
            }
            document.getElementById('spinnerL').style.opacity=0
          } /*else if (r.error.name === "error01") {
            this.removeCookies()
            confirmAlert({
              title: "¡Error!",
              message: "La contraseña es incorrecta.",
              buttons: [{
                label: "Aceptar",
                onClick: () => {
                  this.props.history.push("/entrar");
                }
              }]
            });
          }*/ 
        });
      } catch (e) {
        console.log(`Error: ${e}`);
      }
  }

  comprobarU = async (idUsuario, pass) => {
        try {

          //const sendUri = 'http://35.239.230.74:3011/'
          const sendUri = "http://localhost:3012/";
        
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
            //console.log(`Response1: ${r}`)
            if (
              r[0] !== undefined &&
              (`${r[0].idUsuario}` === `${idUsuario}`)
            ) {

              if (`${r[0].idRol}`===`0`) {
                this.salir()
              }else{
                this.obtenerQ('','')
              }

            } else if (r.error.name === "error01") {
              this.removeCookies()
              confirmAlert({
                title: "¡Error!",
                message: "La contraseña es incorrecta.",
                buttons: [
                  {
                    label: "Aceptar",
                    onClick: () => {
                        this.props.history.push("/entrar");
                    }
                  }
                ]
              });
            } else if (r.error.name === "error02") {
              this.removeCookies();
              confirmAlert({
                title: "¡Error!",
                message: "N° de empleado NO registrado.",
                buttons: [
                  {
                    label: "Aceptar",
                    onClick: () => {
                        this.props.history.push("/entrar");
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

  reloadQ = () =>{
    const qb = document.getElementById("quincenasB")
    qb.innerHTML = 'Quincenas'
    document.getElementById("nEmpleado").value = '';
    document.getElementById('spinnerL').style.opacity = 1
    this.setState({idQuincena: ''})
    this.obtenerQ('', '')
  }

  salir = () => {
    try {
      this.removeCookies();
      this.props.history.push("/entrar")
    } catch (e) {
        console.log(`Error: ${e}`)
    }
  };

  editar = () => {
    try {
      this.props.history.push("/editar")
    } catch (e) {
      console.log(`Error: ${e}`)
    }
  };

  render(){
    const { idUsuario } = this.state;
    const { nombre } = this.state;
    const { correo } = this.state;
            return (
              <>
                <Helmet>
                  <title>Seguridad social</title>
                  <meta name="description" content="Helmet application" />
                  
                </Helmet>
                <div className="inicio">
                  <header className="inicio-header">
                    <div
                      style={{
                        position: 'relative',
                        borderWidth: 1,
                        borderStyle: "solid",
                        padding: 15,
                        borderRadius: 5,
                        right: 0,
                        width: '100%'
                      }}
                    >
                      <h1 > BIENVENIDO AL SISTEMA </h1>
                      <div
                        style={{
                          position: 'absolute',
                          left: 5,
                          top: 25
                        }}
                      >
                        <img src={userI} width='30' height='30' /> 
                        {' '}<div className="dropdown" style={{display: 'inline-block'}} >
                          <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                            Administrador
                          </button>
                          <div className="dropdown-menu">
                            <a className="dropdown-item" href="/inicio">Usuario</a>
                          </div>
                        </div>
                         
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          display: "flex",
                          flex: 1,
                          alignItems: "flex-start",
                          justifyContent: "flex-end",
                          right: 5,
                          top: 25
                        }}
                      >
                        <button className="btn btn-danger" onClick={this.salir}>
                          Salir
                        </button>
                      </div>
                    </div>
                    
                    <div>
                    <table className="table table-borderless table-dark" style={{textAlign: 'left'}} >
                      <tbody>
                        <tr>
                          <th scope="row">N° de empleado:</th>
                          <td>{idUsuario}</td>
                        </tr>
                        <tr>
                          <th scope="row">Nombre:</th>
                          <td>{nombre}</td>
                        </tr>
                        <tr>
                          <th scope="row">Correo:</th>
                          <td>{correo}</td>
                        </tr>
                        <tr>
                          <th scope="row"></th>
                          <td>
                            <button id='editar' onClick = {this.editar} className="btn btn-info" >
                              {`Editar`}
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    </div>

                    <div
                      style={{
                        position: 'relative',
                      //  borderWidth: 1,
                      //  borderStyle: "solid",
                        padding: 15,
                        borderRadius: 5,
                        right: 0,
                        width: '100%'
                      }}
                    > 
                    <div
                        style={{
                          position: 'absolute',
                          left: 5,
                          top: 25
                        }}
                      >
                        <div className="dropdown">
                          <button id='quincenasB' type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown">
                            Quincenas
                          </button>
                          < div id='quincenas' ref={this.quincenas} className = "dropdown-menu" >
                          </div>
                        </div>
                        
                      </div>
                      <div style={{
                          position: 'absolute',
                          right: 5,
                          top: 25
                        }} >
                      <button className="btn btn-warning" onClick={this.reloadQ}>
                          <img src={reload} width='30' height='30' />
                      </button>
                      </div>
                      <div>
                        <input id='nEmpleado' type="number" placeholder="N° de empleado" style={{height: 40, borderRadius: 5}} />
                        <button className="btn btn-info" style={{marginTop: -5}} onClick={this.searchQ}>
                            <img src={search} width='30' height='30' />
                        </button>
                      </div>
                    </div>
                    <div id='spinnerL' className="spinner-border text-info"></div>

                    <div
                      style={{
                        position: 'relative',
                      //  borderWidth: 1,
                      //  borderStyle: "solid",
                        padding: 15,
                        borderRadius: 5,
                        right: 0,
                        width: '100%'
                      }}
                    > 
                    <div style={{
                          position: 'absolute',
                          right: 5,
                          top: 20
                        }} >
                      <button id='nextPag' className="btn btn-success" disabled>
                         {`Siguiente >`}
                      </button>
                    </div>
                    <div style={{
                          position: 'absolute',
                          left: 5,
                          top: 20
                        }} >
                      <button id='prevPag' className="btn btn-success" disabled>
                          {`< Anterior`}
                      </button>
                    </div>
                    </div>
                    <br/>

                    <div>

                       <table className="table table-bordered table-dark">
                        <thead>
                          <tr>
                            <th rowSpan="2" style={{verticalAlign: 'middle' }} >#</th>
                            <th rowSpan="2" style={{verticalAlign: 'middle' }} >N° DE EMPLEADO</th>
                            <th rowSpan="2" style={{verticalAlign: 'middle' }} >NOMBRE</th>
                            <th rowSpan="2" style={{verticalAlign: 'middle' }} >QUINCENA</th>
                            <th colSpan="2" style={{verticalAlign: 'middle' }} >DESCUENTO</th>
                          </tr>
                          <tr>
                            <th scope="row" style={{verticalAlign: 'middle' }} >CREDITO FOVISSTE</th>
                            <th scope="row" style={{verticalAlign: 'middle' }} >SEGURO DE DAÑOS FOVISSTE</th>
                          </tr>
                        </thead>
                        <tbody id='tbodyQ' >
                          
                        </tbody>
                      </table> 

                    </div>

                  </header>
                </div>
              </>
            );
  }
}

