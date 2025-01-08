/*
    Topic Quiz Results Page
    -----------------------
*/

import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Base } from '../components';


export const CourseTopicQuizResults = () => {
    const { topic } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Dummy Data
    const questions = useMemo(() => [
        {
            question: 'What is the capital of France?',
            answers: ['Paris', 'London', 'Berlin', 'Madrid'],
            correctAnswer: 'Paris',
            userAnswer: 'London',
        },
        {
            question: 'What is the capital of Germany?',
            answers: ['Paris', 'London', 'Berlin', 'Madrid'],
            correctAnswer: 'Berlin',
            userAnswer: 'Berlin',
        },
        {
            question: 'What is the capital of Spain?',
            answers: ['Paris', 'London', 'Berlin', 'Madrid'],
            correctAnswer: 'Madrid',
            userAnswer: 'Madrid',
        },
    ], []);

    const [currentQuestion, setCurrentQuestion] = useState(0);

    useLayoutEffect(() => {
        document.title = `${topic} Quiz | Hello World`;
    }, [topic]);

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prevQuestion) => prevQuestion + 1);
        };
        if (currentQuestion === questions.length - 1) {
            navigate(location.pathname.replace('quiz/results', ''), { replace: true });
        };
    };

    const handlePrevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prevQuestion) => prevQuestion - 1);
        };
    };

    const renderAnswerStatus = (questionIndex) => {
        const question = questions[questionIndex];

        if (question.userAnswer === question.correctAnswer) {
            return <span style={{ color: 'green' }}>&#10004;</span>;
        } else {
            return <span style={{ color: 'red' }}>&#10008;</span>;
        };
    };

    return (
        <Base>
            <Container className='py-4'>
                <Row>
                    <Col md={3}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ marginRight: '10px' }}>
                                <b>
                                    Quiz Result: { Math.floor((questions.filter((q) => q.userAnswer === q.correctAnswer).length / questions.length) * 100) }%
                                </b>
                            </span>
                        </div>
                        <ListGroup>
                            {questions.map((q, index) => (
                                <ListGroup.Item
                                    key={q.question}
                                    action
                                    active={index === currentQuestion}
                                    onClick={() => setCurrentQuestion(index)}
                                >
                                    Question {index + 1} {renderAnswerStatus(index)}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={9}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{questions[currentQuestion].question}</Card.Title>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {questions[currentQuestion].answers.map((answer, index) => (
                                        <li key={index} style={{ marginBottom: '8px' }}>
                                            <label>
                                                <input
                                                    type='radio'
                                                    value={answer}
                                                    checked={questions[currentQuestion].userAnswer === answer}
                                                />
                                                {` ${answer}`} {questions[currentQuestion].userAnswer === answer && renderAnswerStatus(currentQuestion)}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </Card.Body>
                            <Card.Footer>
                                <Button variant='secondary' onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
                                    Previous Question
                                </Button>
                                <Button variant='theme' onClick={handleNextQuestion} style={{ marginLeft: '10px' }}>
                                    {currentQuestion === questions.length - 1 ? 'Close Review' : 'Next Question'}
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Base>
    );
};
