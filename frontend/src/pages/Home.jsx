/*
    The Home Page
    -------------
*/

import React, { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Badge, Card, Col, Container, Row } from 'react-bootstrap';

import { Base } from '../components';
import { IconGetter } from '../utilities';


export const Home = () => {
    const coursesContent = [
        {
            name: 'Python',
            description: "Embark on your coding journey with Python - a perfect beginner's language. Explore basic programming concepts, understand simple syntax, and start creating your own programs. This course lays the foundation for your exciting programming adventure.",
            link: '/courses/python',
            iconName: 'Python'
        },
        {
            name: 'Java',
            description: "Step into the world of programming with Java - a medium-friendly language known for its versatility. Learn fundamental coding principles, grasp the basics of object-oriented programming, and begin your hands-on exploration of Java applications.",
            link: '/courses/java',
            iconName: 'Java'
        },
        {
            name: 'Node.JS',
            description: "Start your coding adventure with Node.js - a friendly introduction for beginners. Understand the basics of server-side JavaScript, explore asynchronous programming, and get ready to build your first web applications. No prior coding experience required.",
            link: '/courses/nodejs',
            iconName: 'NodeJs'
        },
        {
            name: 'SQL',
            description: "Unlock the world of databases with SQL - a beginner's guide to managing data. Dive into the fundamental concepts of SQL, learn to craft simple queries, and gain the skills needed for effective data handling. Perfect for those taking their first steps in programming.",
            link: '/courses/sql',
            iconName: 'Database'
        },
    ];

    const whyUsContent = [
        {
            title: 'Easy Learning',
            description: 'Our courses are designed to make learning programming easy and enjoyable.',
            icon: IconGetter.GetFaIcon('GraduationCap', { size: '5em', color: '#ff7afb' })
        },
        {
            title: 'Detailed Courses',
            description: 'Created by experts, our courses cover all the essential programming concepts.',
            icon: IconGetter.GetFaIcon('Book', { size: '5em', color: '#ff8178' })
        },
        {
            title: 'Adaptability',
            description: 'Apply your skills to real-world projects to demonstrate your new skills.',
            icon: IconGetter.GetFaIcon('LaptopCode', { size: '5em', color: '#808fff' })
        },
        {
            title: 'Leaderboard',
            description: 'Compete with other students and earn points for completing courses and projects.',
            icon: IconGetter.GetFaIcon('Trophy', { size: '5em', color: '#fff87a' })
        },
        {
            title: 'Free Forever',
            description: 'All our courses are free, forever. No hidden fees or charges.',
            icon: IconGetter.GetFaIcon('DollarSign', { size: '5em', color: '#7dff78' })
        },
        {
            title: 'Mobile Friendly',
            description: 'Learn on the go with our mobile-friendly courses and projects.',
            icon: IconGetter.GetFaIcon('MobileScreenButton', { size: '5em', color: '#ffc278' })
        },
    ];

    const faqContent = [
        {
            question: 'What is Hello World?',
            answer: 'Hello World is a free platform for learning programming. We offer a range of beginner-friendly courses to help you get started with coding.'
        },
        {
            question: 'Do I Need Any Prior Experience?',
            answer: 'No, our courses are designed for complete beginners. You do not need any prior experience with programming.'
        },
        {
            question: 'How Do I Start Learning?',
            answer: 'Simply choose a course from our homepage and start learning. It\'s that easy!'
        },
    ];

    useLayoutEffect(() => {
        document.title = 'Hello World';
    }, []);

    return (
        <Base>
            <div className='text-center mt-3 mb-5'>
                <p className='display-6'><i>Welcome To</i></p>
                <h1 className='display-1'>Hello World</h1>
                <p className='lead'>Your Best Beginner-Friendly Programming Courses!</p>
            </div>
            <Container className='text-center'>
                <Row className='justify-content-center gx-3'>
                    {coursesContent.map((course) => (
                        <Col key={course.name} xs={12} sm={6} md={4} lg={3} className='mb-5'>
                            <Card as={Link} to={course.link} className='home-card h-100'>
                                <Card.Header className='d-flex align-items-center justify-content-between'>
                                    <Badge pill bg='theme'>
                                        {IconGetter.GetFaIcon(course.iconName, { size: '2em' })}
                                    </Badge>
                                    <Card.Text className='lead fw-bold'>
                                        <Badge bg='theme'>
                                            COURSE
                                        </Badge>
                                    </Card.Text>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title as='h2'>
                                        {course.name}
                                    </Card.Title>
                                    <Card.Text className='lead'>
                                        {course.description}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className='d-flex align-items-center justify-content-between lead fw-bold'>
                                    Start Learning
                                    {IconGetter.GetFaIcon('ArrowRight')}
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <h1 className='text-center my-5'>Why Us?</h1>
                <Row xs={1} md={3} className='gx-3 justify-content-center'>
                    {whyUsContent.map((item, index) => (
                        <Col key={index}>
                            <div className='why-us item p-3'>
                                <div className='why-us icon'>
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className='mt-3'>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>

                <h1 className='text-center my-5'>Frequently Asked Questions</h1>
                <Accordion className='mb-5 text-start' defaultActiveKey='0'>
                    {faqContent.map((item, index) => (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                            <Accordion.Header className='fs-4'>
                                {item.question}
                            </Accordion.Header>
                            <Accordion.Body className='fs-6'>
                                {item.answer}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Container>
        </Base>
    );
};
