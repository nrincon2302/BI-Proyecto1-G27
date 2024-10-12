import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import banner from '../images/rueda-nombres.png';

const Inicio = () => {
  const [show, setShow] = useState(false);

  // Funciones para abrir y cerrar el modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container className="inicio" style={{ marginBottom: 50 }}>
      <Row className="justify-content-center">
        <Col sm="8" className="text-center">
          <h1 className="banner">¡Bienvenido al Clasificador de ODS!</h1>
        </Col>
        <hr className="custom-hr" />
        
        {/* Imagen de la rueda ODS con el botón superpuesto */}
        <Col sm="5" className="robot-image" style={{ position: 'relative', marginBottom: '50px' }}>
          <Image src={banner} alt="Clasificador" fluid />
          
          {/* Botón superpuesto y redondo en el centro de la imagen */}
          <Button
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
              backgroundColor: '#343a40',  // Fondo oscuro (oscuro bootstrap)
              color: '#f8f9fa',  // Letras claras (blanco bootstrap)
              border: 'none',
              animation: 'pulse 1.5s infinite', // Añadida la animación
              boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)' // Sombra para destacar el botón
            }}
          >
            ¡Bienvenido!
          </Button>
        </Col>
      </Row>

      {/* Modal de bienvenida */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Bienvenido al Clasificador de ODS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Aquí puedes clasificar documentos de acuerdo a los Objetivos de Desarrollo Sostenible (ODS) 3, 4 y 5.
            Usa las pestañas de la parte superior para navegar entre las opciones de Predicción y Reentrenamiento.
            También puedes conocer datos más técnicos del modelo actual y otras recomendaciones en la pestaña de Métricas.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Estilos CSS para la animación */}
      <style type="text/css">
        {`
          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(1);
              box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            }
            50% {
              transform: translate(-50%, -50%) scale(1.1);
              box-shadow: 0 0 25px rgba(52, 58, 64, 0.5); // Sombra al hacer pulse
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            }
          }
        `}
      </style>
    </Container>
  );
};

export default Inicio;
