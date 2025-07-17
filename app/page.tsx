import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

const stylebox1 = {
  display: "flex",
  justifycontent: "center",
  aligitems: "center",
  height: "50vh",
  width: "50vh",
  padding: "10px",
};

const buttonstyle = {
  padding: "10px",
};

export default function PaginaInicio() {
  return (
    <>
      <div>
        <h2>Inicio de sesión.</h2>
        <div style={stylebox1}>
          <form>
            <div className="form-group">
              <label htmlFor="Ingresa un email">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                placeholder="ejemplo@tucorreo.com"
              />
              <small id="emailHelp" className="form-text text-muted">
                Tu información no la compartiremos con nadie.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Contraseña"
              ></input>
            </div>
            <div className="form-group form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
              ></input>
              <label className="form-check-label" htmlFor="exampleCheck1">
                Recordar
              </label>
            </div>

            <Link href="/login" style={buttonstyle}>
              <button type="submit" className="btn btn-primary">
                Acceder
              </button>
            </Link>
            <Link href="#" style={buttonstyle}>
              <button type="button" className="btn btn-primary">
                Registrarse
              </button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
