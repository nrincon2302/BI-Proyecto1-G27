import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Bar } from 'react-chartjs-2';
import CSVReader from 'react-csv-reader';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip);

const Predecir = () => {
  const [texts, setTexts] = useState([]); 
  const [predictions, setPredictions] = useState([]); 
  const [probabilities, setProbabilities] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const [showTextInputs, setShowTextInputs] = useState(false); 
  const [showCSVInput, setShowCSVInput] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const [emptyFields, setEmptyFields] = useState([]); 
  const [displayTexts, setDisplayTexts] = useState([]); 

  const genericReasons = {
    3: 'Tu texto ha sido clasificado en el ODS 3 (Salud y Bienestar). Esto significa que el contenido del texto está relacionado con aspectos que afectan la salud física o mental de las personas, y cómo mejorar su bienestar.',
    4: 'Tu texto ha sido clasificado en el ODS 4 (Educación de Calidad). Esto sugiere que el contenido está vinculado con la mejora de la educación, el acceso a oportunidades educativas o la igualdad en la educación.',
    5: 'Tu texto ha sido clasificado en el ODS 5 (Igualdad de Género). Esto implica que el contenido trata sobre temas relacionados con la igualdad entre géneros, el empoderamiento de las mujeres o la eliminación de la discriminación de género.'
  };

  // Nuevo estado para el índice de búsqueda
  const [searchIndex, setSearchIndex] = useState('');

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

    // Actualizar el estado de campos vacíos en tiempo real
    if (event.target.value.trim() === '') {
      setEmptyFields((prev) => [...prev, index]);
    } else {
      setEmptyFields((prev) => prev.filter((i) => i !== index));
    }
  };

  // Eliminar un texto
  const handleDeleteText = (index) => {
    const newTexts = texts.filter((_, i) => i !== index);
    setTexts(newTexts);
  };

  // Manejar carga de archivo CSV
  const handleCSVUpload = (data) => {
    const csvTexts = data.map(row => row[0]).filter(text => text.trim() !== ''); 
    setTexts(csvTexts);
  };

  // Enviar los textos al backend para la predicción
  const handlePredict = async () => {
    const savedIndex = currentIndex; 
  
    setErrorMessage(''); 
    let hasError = false;
    const newEmptyFields = [];

    // Verificar campos vacíos
    texts.forEach((text, index) => {
      if (text.trim() === '') {
        newEmptyFields.push(index);
        hasError = true;
      }
    });

    setEmptyFields(newEmptyFields);
  
    if (hasError) {
      setErrorMessage('Asegúrate de que todos los campos tengan un texto válido y no estén vacíos.');
      return;
    }
  
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
      setDisplayTexts([...texts]);
      setCurrentIndex(savedIndex); 
    } catch (error) {
      console.error('Error al realizar la predicción:', error);
    }
    setLoading(false);
  };

  // Manejar navegación entre resultados
  const handleNavigation = (direction) => {
    if (direction === 'next') {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, predictions.length - 1));
    } else if (direction === 'prev') {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  // Manejar cambio en el campo de búsqueda por índice
  const handleSearchIndexChange = (e) => {
    setSearchIndex(e.target.value);
  };

  // Manejar ir al índice especificado
  const handleGoToIndex = () => {
    const index = parseInt(searchIndex, 10);
    if (!isNaN(index) && index >= 1 && index <= predictions.length) {
      setCurrentIndex(index - 1);
    } else {
      alert(`Por favor, ingresa un número entre 1 y ${predictions.length}`);
    }
  };

  // Manejador para prevenir el comportamiento predeterminado del formulario
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevenir recarga de la página
    handleGoToIndex();  // Ejecutar la función para ir al índice especificado
  };

  // Imágenes de los ODS
  const imageURL = `https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-01-0${predictions[currentIndex]}.jpg`;

  return (
    <Container fluid className="predecir-container">
      <Row className="justify-content-center text-center mt-5">
        <Col xs={12}>
          <h1 className="banner" style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
            Herramienta de Predicción
          </h1>
        </Col>
      </Row>

      {/* Cuadro explicativo */}
      <Row className="justify-content-center">
        <Col xs={10} md={8} className="text-center mt-3">
          <div className="info-box">
            <h4>¿Cómo funciona la Predicción?</h4>
            <p>
            Este componente permite ingresar textos de manera manual o mediante un archivo CSV. 
            Los textos se envían al modelo de clasificación que predice a cuál de los Objetivos de Desarrollo Sostenible 
            (ODS) 3, 4 o 5 pertenecen, mostrando las probabilidades para cada una de estas categorías.
            </p>
          </div>
        </Col>
      </Row>

      {/* Botones para mostrar inputs */}
      <Row className="justify-content-center mt-4">
        <Col sm="8" className="text-center">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id="tooltip-add-text">
                Máximo se pueden agregar 5 textos por este método
              </Tooltip>
            }
          >
            <Button
              variant="primary"
              onClick={() => {
                setShowTextInputs(true);
                setShowCSVInput(false);
                addTextInput();
              }}
              className="action-btn"
              disabled={showCSVInput || texts.length >= 5}
            >
              Agregar texto
            </Button>
          </OverlayTrigger>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCSVInput(true);
              setShowTextInputs(false);
            }}
            className="action-btn"
          >
            Cargar CSV
          </Button>
        </Col>
      </Row>

      {/* Input manual de textos con numeración */}
      {showTextInputs && (
        <Row className="justify-content-center mt-4">
          {texts.map((text, index) => (
            <Col sm="8" key={index} className="mb-3 d-flex align-items-center">
              <div className="text-index">{index + 1}.</div>
              <Form.Control
                type="text"
                placeholder={`Texto ${index + 1}`}
                value={text}
                onChange={(e) => handleTextChange(index, e)}
                className={`text-input ${emptyFields.includes(index) ? 'is-invalid' : ''}`} 
              />
              <Button
                variant="danger"
                onClick={() => handleDeleteText(index)}
                className="delete-btn"
              >
                X
              </Button>
            </Col>
          ))}
        </Row>
      )}

      {/* Carga de archivo CSV */}
      {showCSVInput && (
        <Row className="justify-content-center mt-3">
          <Col sm="8" className="text-center">
            <CSVReader
              onFileLoaded={handleCSVUpload}
              parserOptions={{ header: false }}
              inputId="csv-input"
            />
          </Col>
        </Row>
      )}

      {/* Botón de predicción */}
      <Row className="justify-content-center mt-4">
        <Col sm="8" className="text-center">
          <Button
            variant="success"
            onClick={handlePredict}
            disabled={loading || texts.length === 0}
            className="action-btn"
          >
            {loading ? 'Prediciendo...' : 'Realizar Predicción'}
          </Button>
          {errorMessage && <div className="text-danger mt-2">{errorMessage}</div>}
        </Col>
      </Row>

      {/* Resultados de la predicción */}
      {predictions.length > 0 && (
        <Row className="justify-content-center mt-4">
          <hr className="custom-hr"/>
          <Col sm="12">
            {/* Título y campo de búsqueda centrados */}
            <Row className="align-items-center justify-content-center text-center">
              <Col xs={12} md="auto">
                <h3 className="resultados">
                  Resultados
                </h3>
              </Col>
              {/* Campo para buscar por índice */}
              <Col xs={12} md="auto">
                <Form onSubmit={handleSearchSubmit} className="d-flex align-items-center justify-content-center">
                  <Form.Label className="mr-2">Ir al resultado número:</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={predictions.length}
                    value={searchIndex}
                    onChange={handleSearchIndexChange}
                    style={{ width: '100px' }}
                  />
                  <Button variant="primary" onClick={handleGoToIndex} className="ml-2">Ir</Button>
                </Form>
              </Col>
            </Row>

            <Row className="justify-content-center mt-4">
              <Col xs="auto">
                <Button
                  className="nav-button"
                  onClick={() => handleNavigation('prev')}
                  disabled={currentIndex === 0} 
                  style={{ borderRadius: '50%', backgroundColor: 'black' }} 
                >
                  <span style={{ color: 'white' }}>&lt;</span>
                </Button>
              </Col>

              <Col xs={12} md={8}>
                <Row className="result-container">
                  <Col xs={12} md={6} className="mb-3">
                    <Bar
                      data={{
                        labels: ['ODS 3', 'ODS 4', 'ODS 5'], 
                        datasets: [
                          {
                            label: 'Probabilidad',
                            data: probabilities[currentIndex], 
                            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 1,
                          },
                        },
                      }}
                      className="chart-bar"
                    />
                  </Col>

                  <Col xs={12} md={6}>
                    <Card className="result-card">
                      <Card.Body>
                        <Row>
                          {/* Primera columna: Texto con scroll */}
                          <Col xs={6} style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            <h5>Texto {currentIndex + 1}:</h5>
                            <p>{displayTexts[currentIndex]}</p>
                          </Col>

                          {/* Segunda columna: Predicción e imagen del ODS */}
                          <Col xs={6} className="text-center">
                            <h5>Predicción:</h5>
                            <img 
                              src={imageURL} 
                              alt={`ODS ${predictions[currentIndex]}`} 
                              style={{ width: '200px', height: '200px' }}
                            />
                          </Col>
                        </Row>

                        {/* Texto genérico basado en la predicción */}
                        <Row className="mt-3">
                          <Col>
                            <p style={{ textAlign: 'justify' }}>
                              {genericReasons[predictions[currentIndex]]}
                            </p>
                          </Col>
                        </Row>

                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>

              <Col xs="auto">
                <Button
                  className="nav-button"
                  onClick={() => handleNavigation('next')}
                  disabled={currentIndex === predictions.length - 1} 
                  style={{ borderRadius: '50%', backgroundColor: 'black' }} 
                >
                  <span style={{ color: 'white' }}>&gt;</span>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Predecir;
