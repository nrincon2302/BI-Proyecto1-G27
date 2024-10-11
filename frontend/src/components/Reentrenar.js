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

    // Filtrar filas vacías o inválidas
    const filteredData = csvData.filter(row => row.texto_espanol && row.sdg);

    // Construir el JSON solo con datos válidos
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
    <Container fluid className="d-flex justify-content-center">
      <Row className="mt-5">
        <Col xs={12} className="text-center">
          <h2>Reentrenar el Modelo</h2>
        </Col>

        <Col xs={12} className="text-center">
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Cargar CSV con los datos de entrenamiento</Form.Label>
              <CSVReader
                onFileLoaded={handleFileLoad}
                parserOptions={{ header: true }}
                inputId="csv-input"
              />
            </Form.Group>

            <Button variant="primary" onClick={handleSubmit}>
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
