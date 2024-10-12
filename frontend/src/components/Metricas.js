import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Row, Col } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import odsImage from '../images/ods-general.jpg';

const Metricas = () => {
    const [loading, setLoading] = useState(false);

    if (loading) {
        return (
            <div className="spinner-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>

            {/* Imagen de ODS antes del título */}
            <Row className="justify-content-center">
                <Col xs={10} md={8} className="text-center mt-3">
                    <img src={odsImage} alt="Objetivos de Desarrollo Sostenible" style={{ maxWidth: '100%', height: 'auto' }} />
                </Col>
            </Row>

            {/* Título principal */}
            <h1 style={{ textAlign: 'center' }}>¿De qué se trata este proyecto?</h1>
            
            {/* Cuadro explicativo */}
            <Row className="justify-content-center">
                <Col xs={15} md={8} className="mt-3">
                    <div className="info-box" style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9', textAlign: 'justify' }}>
                        <p>
                            Este proyecto tiene como objetivo analizar y clasificar automáticamente las opiniones de los ciudadanos en función de tres 
                            Objetivos de Desarrollo Sostenible (ODS): <strong>Salud y Bienestar (ODS 3)</strong>, <strong>Educación de Calidad (ODS 4)</strong>, y 
                            <strong>Igualdad de Género (ODS 5)</strong>. Utilizando modelos de analítica de textos, la herramienta procesa las opiniones en 
                            lenguaje natural y las asigna a uno de los tres ODS, lo que facilita la identificación de problemáticas y posibles soluciones.
                        </p>
                        <p>
                            En este proyecto, el equipo de desarrollo juega un papel clave: los científicos de datos son responsables de construir los modelos 
                            analíticos que clasifican las opiniones, mientras que los ingenieros de datos aseguran la correcta implementación y actualización de 
                            dichos modelos para garantizar su precisión y eficiencia. Además, los ingenieros de software desarrollan la aplicación web o móvil 
                            que permite a los usuarios interactuar con los resultados del modelo.
                        </p>
                        <p>
                            El resultado de este proceso es una aplicación web que permite a los usuarios finales enviar opiniones, ver cómo se clasifican en los 
                            ODS mencionados y tomar decisiones informadas basadas en los resultados. Los usuarios beneficiados son los siguientes:
                        </p>

                        {/* Tabla de actores */}
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Rol</th>
                                <th>Beneficio</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Ciudadanos</td>
                                <td>Sus opiniones serán analizadas automáticamente para identificar problemáticas relevantes relacionadas con los ODS 3, 4 y 5.</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Fondo de Poblaciones de las Naciones Unidas (UNFPA)</td>
                                <td>Obtiene un mecanismo eficiente para analizar grandes volúmenes de datos de opiniones ciudadanas, lo que agiliza la toma de decisiones para los ODS.</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Entidades Públicas Colaboradoras</td>
                                <td>Aseguran que el modelo cumpla con los estándares de calidad y privacidad de datos, lo que mejora la confianza en el análisis de opiniones.</td>
                            </tr>
                            <tr>
                                <th scope="row">4</th>
                                <td>Financiadores (UNFPA)</td>
                                <td>Proporciona los recursos financieros necesarios para el desarrollo y ejecución del proyecto, asegurando la continuidad del mismo.</td>
                            </tr>
                        </tbody>
                    </Table>


                    {/* Nuevo texto  después de la tabla */}
                    <div style={{ textAlign: 'justify' }}>
                        <p>
                            Con los siguientes actores, se determinó que la aplicación está dirigida especialmente a los ciudadanos y entidades públicas
                            involucradas en la evaluación de los Objetivos de Desarrollo Sostenible (ODS) 3, 4, y 5. La aplicación apoyaría el proceso de
                            análisis de las opiniones para mejorar la toma de decisiones y crear estrategias más eficaces para abordar temas relacionados
                            con la salud, educación, y la igualdad de género. Esta herramienta permite identificar áreas de mejora y reconocer prácticas
                            efectivas que deben mantenerse.
                        </p>
                        <p>
                            Tanto para las entidades públicas como para otras organizaciones, la aplicación puede ser útil, ya que ofrece un análisis claro y
                            automatizado de las opiniones, ayudando a saber qué tipo de problemas y oportunidades se asocian con cada ODS. Esto permite
                            agrupar las opiniones y definir prioridades de intervención, contribuyendo al desarrollo de políticas y estrategias que agreguen valor.
                        </p>
                    </div>
                    
                    
                    </div>

                            {/* Espacio al final de la página */}
                    <div style={{ marginBottom: '40px' }}>
                                {/* This empty div adds extra space at the bottom */}
                    </div>

                </Col>
            </Row>

            {/* Espacio al final de la página */}
            <div style={{ marginBottom: '80px' }}>
                        {/* This empty div adds extra space at the bottom */}
            </div>
            
            
        </div>
    );
};

export default Metricas;
