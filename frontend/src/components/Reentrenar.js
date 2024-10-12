import React, { useState } from 'react';
import CSVReader from 'react-csv-reader';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const Reentrenar = () => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [message, setMessage] = useState('');
  const [evaluationMessage, setEvaluationMessage] = useState(''); // Nuevo estado

  const handleFileLoad = (data) => {
    setCsvData(data);
  };

  const handleSubmit = () => {
    if (csvData.length === 0) {
      alert('Por favor, cargue un archivo CSV');
      return;
    }

    const filteredData = csvData.filter(row => row.Textos_espanol && row.sdg);
    const textos = filteredData.map(row => row.Textos_espanol);
    const etiquetas = filteredData.map(row => parseInt(row.sdg));

    const jsonData = {
      Textos_espanol: textos,
      sdg: etiquetas
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
      console.log('Respuesta del servidor', data);
      setLoading(false);
      setMessage(data.message);
      setMetrics(data.metrics);

      // Evaluar métricas y establecer mensajes individuales
      const precision = parseFloat(data.metrics.precision);
      const recall = parseFloat(data.metrics.recall);
      const f1_score = parseFloat(data.metrics.f1_score);

      let precisionComment = '';
      let recallComment = '';
      let f1ScoreComment = '';

      // Evaluar precisión
  if (precision >= 0.8 && precision <= 1) {
    precisionComment = 'La precisión del modelo es muy alta, lo que significa que está clasificando correctamente la mayoría de los textos proporcionados. Esto es ideal si la prioridad es minimizar los falsos positivos, ya que se asegura que las predicciones positivas son realmente relevantes en la mayoría de los casos.';
  } else if (precision >= 0.5 && precision < 0.8) {
    precisionComment = 'La precisión del modelo es aceptable, pero aún hay margen para mejorar. Aunque identifica una buena cantidad de predicciones correctas, podrías encontrar algunos falsos positivos. Para ciertos casos, esto podría ser suficiente, pero si se requiere una precisión más estricta, se deberían ajustar los parámetros o entrenar con más datos.';
  } else {
    precisionComment = 'La precisión es baja, lo que significa que el modelo está clasificando incorrectamente muchos de los textos como positivos cuando no lo son. Esto indica que hay un alto riesgo de falsos positivos, lo que podría causar problemas si se utilizan las predicciones para tomar decisiones importantes. Sería recomendable mejorar el conjunto de datos o ajustar el modelo para aumentar su precisión.';
  }

  // Evaluar recall
  if (recall >= 0.8 && recall <= 1) {
    recallComment = 'El recall del modelo es muy alto, lo que indica que el modelo está capturando la mayoría de los casos positivos reales. Esto es útil si es importante no dejar pasar casos relevantes, aunque a veces puede aumentar la cantidad de falsos positivos.';
  } else if (recall >= 0.5 && recall < 0.8) {
    recallComment = 'El recall es aceptable, lo que significa que el modelo está capturando una cantidad razonable de casos positivos reales, pero todavía podría mejorar en algunos aspectos. Podrías perder algunos casos importantes, pero en la mayoría de los casos estará capturando lo relevante.';
  } else {
    recallComment = 'El recall es bajo, lo que significa que el modelo no está identificando suficientes casos positivos reales. Esto podría ser problemático si es crucial identificar todos los casos relevantes. En este caso, el modelo necesita ser ajustado para mejorar su capacidad de capturar más casos positivos.';
  }

  // Evaluar F1-score
  if (f1_score >= 0.8 && f1_score <= 1) {
    f1ScoreComment = 'El F1-score es muy bueno, lo que significa que el modelo ha encontrado un buen equilibrio entre precisión y recall. Esto es ideal para aplicaciones donde tanto minimizar falsos positivos como identificar la mayoría de los casos positivos es crucial.';
  } else if (f1_score >= 0.5 && f1_score < 0.8) {
    f1ScoreComment = 'El F1-score es aceptable, lo que indica que el modelo tiene un balance decente entre precisión y recall. Sin embargo, podría haber margen de mejora si se requiere un rendimiento más equilibrado entre identificar todos los casos relevantes y minimizar los falsos positivos.';
  } else {
    f1ScoreComment = 'El F1-score es bajo, lo que indica que el modelo está teniendo problemas para equilibrar la precisión y el recall. Esto podría ser una señal de que el modelo está fallando en varias áreas, y sería necesario revisar tanto el conjunto de datos como los parámetros del modelo para mejorar su rendimiento.';
  }

  // Determinar comentario final sobre el modelo
  let finalComment = '';

  if (precision >= 0.8 && recall >= 0.8 && f1_score >= 0.8) {
    finalComment = 'El modelo es muy confiable para la mayoría de los escenarios de uso, ya que tiene una alta precisión y recall. Esto significa que puedes confiar en sus predicciones con poca preocupación por errores graves.';
  } else if (precision >= 0.5 && recall >= 0.5 && f1_score >= 0.5) {
    finalComment = 'El modelo es confiable, pero debería usarse con precaución, especialmente en contextos donde los errores podrían tener un impacto considerable. Si bien no es perfecto, puede ofrecer resultados útiles en muchas aplicaciones.';
  } else {
    finalComment = 'El modelo es poco confiable y podría no ser adecuado para tomar decisiones importantes sin realizar más mejoras. Se recomienda revisar el conjunto de datos, ajustar los hiperparámetros o considerar otro enfoque de modelado.';
  }

  // Construir mensaje de evaluación completo
  //const evalMessage = `El modelo presenta las siguientes métricas:  ${precisionComment},  - ${recallComment},   ${f1ScoreComment}, por lo tanto, ${finalComment}`;
  const evalMessage = `${finalComment}`;
  setEvaluationMessage(evalMessage);

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

            {/* Mostrar mensaje de evaluación en una card */}
            <Card className="mt-4 mx-auto" style={{ maxWidth: '600px', textAlign: 'justify' }}>
              <Card.Body>
                <Card.Title>Evaluación del modelo:</Card.Title>
                <Card.Text>{evaluationMessage}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Reentrenar;
