import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Reentrenar = () => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileLoad = (data) => {
    setCsvData(data);
  };

  const handleSubmit = () => {
    if (csvData.length === 0) {
      alert('Por favor, cargue un archivo CSV');
      return;
    }

    const filteredData = csvData.filter(row => row.texto_espanol && row.sdg);
    const textos = filteredData.map(row => row.texto_espanol);
    const etiquetas = filteredData.map(row => parseInt(row.sdg));

    const jsonData = {
      textos: textos,
      etiquetas: etiquetas
    };

    console.log('Datos a enviar:', jsonData);

    setLoading(true);

    fetch('http://localhost:8000/reentrenamiento/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(data => {
      setLoading(false);
      setMessage(data.message);
      setMetrics(data.metrics);
    })
    .catch((error) => {
      setLoading(false);
      console.error('Error durante el reentrenamiento:', error);
    });
  };

  return (
    <Container fluid className="inicio" style={{marginBottom:100}}>
      <Row className="justify-content-center text-center mt-5">
        <Col xs={12}>
          <h1 className="banner" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
            ¡Reentrenar el Modelo!
          </h1>
        </Col>

        {/* Cuadro explicativo */}
        <Col xs={10} md={8} className="text-center mt-3">
          <div 
            style={{
              border: '2px solid #6c757d', 
              borderRadius: '15px', 
              padding: '20px', 
              backgroundColor: '#f8f9fa',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              fontSize: '1.1rem',
              lineHeight: '1.6',
            }}
          >
            <h4 style={{ fontWeight: 'bold' }}>¿Qué es el Reentrenamiento?</h4>
            <p>
              Al realizar este proceso, se van a añadir nuevos datos proporcionados en un archivo CSV
              para generar un nuevo modelo de clasificación que sustituirá el modelo actual. Los nuevos
              datos que se proporcionen se agregarán a los que ya se tenían para volver a entrenar el modelo.
              <strong> Se conservan iguales los hiperparámetros del modelo anterior</strong>.
            </p>
          </div>
        </Col>
      </Row>

      {/* Formulario para cargar CSV y botón de reentrenar */}
      <Row className="justify-content-center">
        <Col xs={12} className="text-center mt-5">
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label style={{ fontSize: '1.25rem' }}>Cargar CSV con los nuevos datos para reentrenar el modelo</Form.Label>
              <CSVReader
                onFileLoaded={handleFileLoad}
                parserOptions={{ header: true }}
                inputId="csv-input"
              />
            </Form.Group>

            <Button
              variant="success"
              onClick={handleSubmit}
              style={{
                padding: '10px 25px',
                fontSize: '1.25rem',
                borderRadius: '10px',
              }}
            >
              Reentrenar Modelo
            </Button>
          </Form>
        </Col>

        {loading && (
          <Col xs={12} className="text-center mt-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Reentrenando...</span>
            </Spinner>
          </Col>
        )}

        {message && (
          <Col xs={12} className="text-center mt-3">
            <h3>{message}</h3>
          </Col>
        )}

        {metrics && (
          <Col xs={12} className="text-center mt-3">
            <h4>Métricas de desempeño del nuevo modelo:</h4>
            <Table striped bordered hover className="mx-auto" style={{ maxWidth: '400px' }}>
              <thead>
                <tr>
                  <th>Precisión</th>
                  <th>Recall</th>
                  <th>F1 Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{metrics.precision}</td>
                  <td>{metrics.recall}</td>
                  <td>{metrics.f1_score}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Reentrenar;
