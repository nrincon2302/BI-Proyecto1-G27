import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'

import logo from '..//images/ODS - logo.png'

const Header = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="/"> 
        <img
            src= {logo}  // Asegúrate de que esta ruta sea correcta
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
          />
           ODS App 
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/model">Métricas</Nav.Link>
          <Nav.Link href="/predict">Predecir</Nav.Link>
          <Nav.Link href="/retrain">Reentrenar</Nav.Link>
        </Nav>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Grupo 27 - BI
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header