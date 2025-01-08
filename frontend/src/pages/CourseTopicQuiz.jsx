/*
    Topic Quiz Page
    ---------------
*/

import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Button, Card, Col, Container, ListGroup, ProgressBar, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Base } from '../components';


export const CourseTopicQuiz = () => {
    const { topic } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Dummy Data
    const questions = useMemo(() => [
        {
            question: 'What is the capital of France?',
            answers: ['Paris', 'London', 'Berlin', 'Madrid'],
            correctAnswer: 'Paris',
        },
        {
            question: 'What is the capital of Germany?',
            answers: ['Paris', 'London', 'Berlin', 'Madrid'],
            correctAnswer: 'Berlin',
        },
        {
            question: 'What is the capital of Spain?',
            answers: ['Paris', 'London', 'Berlin', 'Madrid'],
            correctAnswer: 'Madrid',
        },
    ], []);

    const questionsAnwered = useMemo(() => questions.map(
        (q) => ({ question: q.question, selectedAnswer: '' })
    ), [questions]);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [timer, setTimer] = useState(60); // ( In Seconds ) - Will be Set from API

    const shuffledAnswers = useMemo(() => {
        const shuffleArray = (array) => {
            const shuffledArray = array.slice();
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
            return shuffledArray;
        };

        return questions.map((q) => ({
            question: q.question,
            answers: shuffleArray(q.answers),
        }));
    }, [questions]);

    useLayoutEffect(() => {
        document.title = `${topic} Quiz | Hello World`;
    }, [topic]);

    const handleAnswerSelect = (answer) => {
        questionsAnwered[currentQuestion].selectedAnswer = answer;
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prevQuestion) => prevQuestion + 1);
            setSelectedAnswer(questionsAnwered[currentQuestion + 1].selectedAnswer || '');
        };
        if (currentQuestion === questions.length - 1) {
            navigate(location.pathname + '/results', { replace: true });
        };
    };

    const handlePrevQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prevQuestion) => prevQuestion - 1);
            setSelectedAnswer(questionsAnwered[currentQuestion - 1].selectedAnswer || '');
        };
    };

    useEffect(() => {
        setSelectedAnswer(questionsAnwered[currentQuestion].selectedAnswer);
    }, [currentQuestion, questionsAnwered]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (timer === 0) {
            alert('Time is Up!'); // Raplce with API-Calls
            navigate(location.pathname + '/results', { replace: true });
        };
    }, [timer, navigate, location.pathname]);


    return (
        <Base>
            <Container className='py-4'>
                <Row>
                    <Col md={3}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ marginRight: '10px' }}>Time Left: {timer}s</span>
                            <ProgressBar striped now={(timer / 60) * 100} variant='danger' style={{ flex: 1, backgroundColor: '#90232E' }} />
                        </div>
                        <ListGroup>
                            {questions.map((q, index) => (
                                <ListGroup.Item
                                    key={index}
                                    action
                                    active={index === currentQuestion}
                                    onClick={() => setCurrentQuestion(index)}
                                >
                                    Question {index + 1}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col md={9}>
                        <Card>
                            <Card.Body>
                                <Card.Title>{questions[currentQuestion].question}</Card.Title>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {shuffledAnswers[currentQuestion].answers.map((answer, index) => (
                                        <li key={index} style={{ marginBottom: '8px' }}>
                                            <label>
                                                <input
                                                    type='radio'
                                                    value={answer}
                                                    checked={selectedAnswer === answer}
                                                    onChange={() => handleAnswerSelect(answer)}
                                                />
                                                {` ${answer}`}
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
                                    {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Base>
    );
};
