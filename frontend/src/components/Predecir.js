import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Bar } from 'react-chartjs-2';
import CSVReader from 'react-csv-reader';

const Predecir = () => {
  const [texts, setTexts] = useState(['']); // Textos ingresados manualmente
  const [predictions, setPredictions] = useState([]); // Predicciones obtenidas del endpoint
  const [probabilities, setProbabilities] = useState([]); // Probabilidades obtenidas del endpoint
  const [loading, setLoading] = useState(false);

  // Agregar una nueva caja de texto (máximo 5)
  const addTextInput = () => {
    if (texts.length < 5) {
      setTexts([...texts, '']);
    }
  };

  // Manejar cambios en las cajas de texto
  const handleTextChange = (index, event) => {
    const newTexts = [...texts];
    newTexts[index] = event.target.value;
    setTexts(newTexts);
  };

  // Manejar carga de archivo CSV
  const handleCSVUpload = (data) => {
    const csvTexts = data.map(row => row[0]); // Asumiendo que el texto está en la primera columna del CSV
    setTexts(csvTexts);
  };

  // Enviar los textos al backend para la predicción
  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Textos_espanol: texts,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Error al realizar la predicción');
      }

      const data = await response.json();
      setPredictions(data.predictions);
      setProbabilities(data.probabilities);
    } catch (error) {
      console.error('Error al realizar la predicción:', error);
    }
    setLoading(false);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col sm="8" className="text-center">
          <h2>Predicción de Clasificación ODS</h2>
        </Col>
      </Row>

      {/* Input manual de textos */}
      <Row className="justify-content-center">
        {texts.map((text, index) => (
          <Col sm="8" key={index} className="mb-3">
            <Form.Control
              type="text"
              placeholder={`Texto ${index + 1}`}
              value={text}
              onChange={(e) => handleTextChange(index, e)}
            />
          </Col>
        ))}
      </Row>
      <Row className="justify-content-center">
        <Col sm="8">
          <Button onClick={addTextInput} disabled={texts.length >= 5}>
            Agregar texto
          </Button>
        </Col>
      </Row>

      {/* Carga de archivo CSV */}
      <Row className="justify-content-center mt-3">
        <Col sm="8">
          <CSVReader onFileLoaded={handleCSVUpload} />
        </Col>
      </Row>

      {/* Botón de predicción */}
      <Row className="justify-content-center mt-3">
        <Col sm="8">
          <Button onClick={handlePredict} disabled={loading || texts.length === 0}>
            {loading ? 'Prediciendo...' : 'Realizar Predicción'}
          </Button>
        </Col>
      </Row>

      {/* Resultados de la predicción */}
      {predictions.length > 0 && (
        <Row className="justify-content-center mt-4">
          <Col sm="8">
            <h3>Resultados:</h3>
            {predictions.map((pred, index) => (
              <div key={index}>
                <h5>Texto {index + 1}: ODS Predicho - {pred}</h5>
                <Bar
                  data={{
                    labels: ['ODS 3', 'ODS 4', 'ODS 5'], // Etiquetas según los ODS predichos
                    datasets: [
                      {
                        label: 'Probabilidad',
                        data: probabilities[index], // Probabilidades del texto actual
                        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 1,
                      },
                    },
                  }}
                />
              </div>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Predecir;
