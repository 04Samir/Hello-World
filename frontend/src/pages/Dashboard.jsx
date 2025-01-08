/*
    The Dashboard
    -------------
*/

import React, { useLayoutEffect, useState } from 'react';
import { Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { Calendar } from 'react-calendar';

import { Base, CourseCard } from '../components';
import { useAuth } from '../context';


export const Dashboard = () => {
    const { user } = useAuth();

    const [selectedDate, setSelectedDate] = useState(null);
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Dummy Data
    const courses = [
        { name: 'Python', progress: Math.floor(Math.random() * 100), link: '/courses/Python' },
        { name: 'JavaScript', progress: Math.floor(Math.random() * 100), link: '/courses/JavaScript' },
        { name: 'SQL', progress: Math.floor(Math.random() * 100), link: '/courses/SQL' },
    ];
    const tasks = ['Task 1', 'Task 2', 'Task 3'];

    useLayoutEffect(() => {
        document.title = 'Dashboard | Hello World';
    }, []);

    const handleDateClick = (value, event) => {
        setSelectedDate(value);
        setShowModal(true);
    };

    const handleAddEvent = () => {
        const eventDescription = prompt('Enter Event Description:');
        if (eventDescription) {
            setEvents([...events, { date: selectedDate, description: eventDescription }]);
            setShowModal(false);
        }
    };
    
    const renderTileContent = ({ date, view }) => {
        if (view === 'month') {
            const hasEvent = events.some(event => event.date.getTime() === date.getTime());
            if (hasEvent) {
                return <p>🔵</p>
            }
        }
    };

    return (
        <Base>
            <Container>
                <h1 className='text-center mt-5'>Welcome, {user.display_name}!</h1>
            </Container>

            <Container className='my-4'>
                <h2 className='mb-3'>My Courses:</h2>
                <Row>
                    {courses.map((course) => (
                        <Col key={course.name} md={4}>
                            <CourseCard course={course} />
                        </Col>
                    ))}
                </Row>
            </Container>

            <Container className='my-4'>
                <h2 className='mb-3'>Calendar:</h2>
                <Row>
                    <Col>
                        <div className='calendar'>
                            <Calendar onClickDay={handleDateClick} tileContent={renderTileContent} />
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container className='my-4'>
                <h2 className='mb-3'>My Tasks:</h2>
                <Row>
                    <Col>
                        <ul className='list-group'>
                            {tasks.map((task, index) => (
                                <li key={index} className='list-group-item'>
                                    {task}
                                </li>
                            ))}
                        </ul>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Button onClick={handleAddEvent}>Add Event</Button>
                </Modal.Body>
            </Modal>
        </Base>
    );
};
