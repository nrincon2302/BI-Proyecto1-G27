import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, ArcElement, Tooltip, Title } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, ArcElement, Tooltip, Title);

const Metricas = () => {
    const [selectedOds, setSelectedOds] = useState(null); // ODS seleccionado
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const urlDatos = "http://127.0.0.1:8000/model";
        fetch(urlDatos)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, []);

    // Manejar selección de ODS
    const handleSelectOds = (odsNumber) => {
        setSelectedOds(odsNumber);
    };

    const barData = {
        labels: data && data.words[selectedOds] ? data.words[selectedOds].map(item => item[0]) : [],
        datasets: [
            {
                label: 'Peso',
                data: data && data.words[selectedOds] ? data.words[selectedOds].map(item => item[1]) : [],
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                hoverBorderColor: 'rgba(75,192,192,1)',
            }
        ]
    };

    const barOptions = {
        indexAxis: 'y',
        maintainAspectRatio: false, 
    };

    const createPieData = (value) => ({
        datasets: [{
            data: [value * 100, 100 - value * 100],
            backgroundColor: ['rgba(75,192,192,0.4)', 'rgba(33,37,41,0.6)'],
            borderColor: ['rgba(75,192,192,1)', 'rgba(33,37,41,1)'],
            borderWidth: 1,
        }],
    });

    if (loading) {
        return (
            <div className="spinner-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Filtrar reseñas por estrellas</h1>
            <p style={{ textAlign: 'center' }}>En esta sección, puedes filtrar las reseñas por estrellas para ver las reseñas que tienen esa calificación específica. Si prefieres ver todas las reseñas sin importar la calificación, puedes hacer clic en el botón "Todos".</p>

            <div style={{ display: 'flex', justifyContent: 'space-around', paddingBottom: '20px' }}>
                {/* Tarjeta para ODS 3 */}
                <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px', width: '30%', textAlign: 'center' }}>
                    <img src="https://via.placeholder.com/150" alt="ODS 3" style={{ borderRadius: '10px', marginBottom: '10px' }} />
                    <h3>Salud y Bienestar</h3>
                    <p>Las reseñas de ODS 3 están relacionadas con mejorar la salud y el bienestar de los ciudadanos.</p>
                    <Button variant="primary" onClick={() => handleSelectOds('3')}>3 estrellas</Button>
                </div>

                {/* Tarjeta para ODS 4 */}
                <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px', width: '30%', textAlign: 'center' }}>
                    <img src="https://via.placeholder.com/150" alt="ODS 4" style={{ borderRadius: '10px', marginBottom: '10px' }} />
                    <h3>Educación de Calidad</h3>
                    <p>Las reseñas de ODS 4 están relacionadas con asegurar una educación de calidad para todos.</p>
                    <Button variant="primary" onClick={() => handleSelectOds('4')}>4 estrellas</Button>
                </div>

                {/* Tarjeta para ODS 5 */}
                <div style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '20px', width: '30%', textAlign: 'center' }}>
                    <img src="https://via.placeholder.com/150" alt="ODS 5" style={{ borderRadius: '10px', marginBottom: '10px' }} />
                    <h3>Igualdad de Género</h3>
                    <p>Las reseñas de ODS 5 están relacionadas con alcanzar la igualdad de género y empoderar a las mujeres.</p>
                    <Button variant="primary" onClick={() => handleSelectOds('5')}>5 estrellas</Button>
                </div>
            </div>

            {selectedOds && (
                <div style={{ marginTop: '20px' }}>
                    <h2 style={{ textAlign: 'center' }}>Resultados para ODS {selectedOds}</h2>
                    <div style={{ width: '100%', height: '400px' }}>
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Metricas;
