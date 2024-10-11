import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import banner from '..//images/ods_sin_nombre.jpg';

const Inicio = () => {
  const [show, setShow] = useState(false);

  // Funciones para abrir y cerrar el modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container className="inicio">
      <Row className="justify-content-center">
        <Col sm="8" className="text-center">
          <h1 className="banner">¡Bienvenido al Clasificador de ODS!</h1>
        </Col>
        <hr className="custom-hr" />
        
        {/* Imagen de la rueda ODS con el botón superpuesto */}
        <Col sm="5" className="robot-image" style={{ position: 'relative' }}>
          <Image src={banner} alt="Clasificador" fluid />
          
          {/* Botón superpuesto y redondo en el centro de la imagen */}
          <Button
            variant="primary"
            onClick={handleShow}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '150px',     // Ajusta el ancho del botón
              height: '150px',    // Ajusta el alto del botón
              borderRadius: '50%', // Hace que el botón sea redondo
              fontSize: '18px',    // Tamaño del texto dentro del botón
              display: 'flex',     // Centrar el texto dentro del botón
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            ¡Bienvenido!
          </Button>
        </Col>

      </Row>
      <hr className="custom-hr" />

      {/* Modal de bienvenida */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Bienvenido al Clasificador de ODS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Aquí puedes clasificar documentos de acuerdo a los Objetivos de Desarrollo Sostenible (ODS).
            Usa las pestañas de la parte superior para navegar entre las opciones de Predicción y Métricas.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Inicio;
