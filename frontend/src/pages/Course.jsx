/*
    Course Page
    -----------
*/

import React, { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Breadcrumb, Card, Col, Container, ListGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import { Base } from '../components';
import { useAuth } from '../context';
import { IconGetter } from '../utilities';


export const Course = () => {
    const { user } = useAuth();

    // Dummy Data
    const courseDetails = {
        title: 'Python: Introduction to Programming',
        description: `Are you new to the world of programming and eager to kickstart your journey? Look no further! Our Python for Beginners course is the perfect starting point for aspiring developers like you.
      
        Python is not only one of the most popular programming languages today but also one of the most beginner-friendly. With its simple and intuitive syntax, Python is an excellent choice for those taking their first steps into the world of coding.
        
        In this comprehensive course, we'll take you through the foundational concepts of Python programming from scratch. You'll learn everything from basic syntax and data types to more advanced topics like functions, loops, and object-oriented programming.`,
        language: 'python',
        icon: IconGetter.GetFaIcon('Python'),
    };

    const courseCategories = [
        {
            name: 'Functions',
            description: 'Learn how to write functions in Python.',
            icon: IconGetter.GetFaIcon('Python'),
            topics: [
                {
                    title: 'Introduction to Functions',
                    description: 'Learn what are functions and how to write them.',
                    link: '/courses/python/topics/functions/introduction-to-functions',
                },
                {
                    title: 'Function Arguments',
                    description: 'Learn how to pass arguments to functions.',
                    link: '/courses/python/topics/functions/function-arguments',
                },
                {
                    title: 'Return Statement',
                    description: 'Learn how to use the return statement.',
                    link: '/courses/python/topics/functions/return-statement',
                },
            ],
        },
        {
            name: 'Loops',
            description: 'Learn how to use loops in Python.',
            icon: IconGetter.GetFaIcon('Python'),
            topics: [
                {
                    title: 'Introduction to Loops',
                    description: 'Learn what are loops and how to use them.',
                },
                {
                    title: 'For Loop',
                    description: 'Learn how to use the for loop.',
                },
                {
                    title: 'While Loop',
                    description: 'Learn how to use the while loop.',
                },
            ],
        },
        {
            name: 'Data Structures',
            description: 'Learn about different data structures in Python.',
            icon: IconGetter.GetFaIcon('Python'),
            topics: [
                {
                    title: 'Lists',
                    description: 'Learn how to use lists in Python.',
                },
                {
                    title: 'Tuples',
                    description: 'Learn how to use tuples in Python.',
                },
                {
                    title: 'Dictionaries',
                    description: 'Learn how to use dictionaries in Python.',
                },
            ],
        },
    ];

    const [selectedCategory, setSelectedCategory] = useState(courseCategories[0].name);

    const addLineBreaks = (text) => {
        return text.split('\n').map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>);
    };

    useLayoutEffect(() => {
        document.title = `${courseDetails.title} | Hello World`;
    }, [courseDetails.title]);

    return (
        <Base>
            <Container className='mt-5'>
                <Card className='mb-4'>
                    <Card.Body>
                        <Card.Title className='d-flex align-items-center' as='h2'>
                            <Badge bg='theme' className='me-3'>
                                {courseDetails.icon}
                            </Badge>
                            {courseDetails.title}
                        </Card.Title>
                        <hr />
                        <Card.Text className='mt-3 fs-6'>
                            {addLineBreaks(courseDetails.description)}
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Row>
                    <Col md={3}>
                        <Card className='mb-4'>
                            <Card.Header as='h4'>
                                {courseDetails.language.charAt(0).toUpperCase() + courseDetails.language.slice(1)}: Course Index
                            </Card.Header>
                            <Card.Body>
                                <ListGroup>
                                    {courseCategories.map((category, index) => (
                                        <ListGroup.Item
                                            key={index}
                                            action
                                            active={selectedCategory === category.name}
                                            onClick={() => setSelectedCategory(category.name)}
                                            variant='theme'
                                        >
                                            {IconGetter.GetFaIcon('RegCircleCheck', { className: 'me-2 text-muted' })}
                                            {category.name}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                            <Card.Footer>
                                <Breadcrumb className='mb-0'>
                                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/courses' }}>
                                        courses
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item active>
                                        {courseDetails.language}
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col md={9}>
                        <Card>
                            <Card.Header as='h4'>
                                {selectedCategory}
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {courseCategories.find((category) => category.name === selectedCategory).description}
                                </Card.Text>
                                <hr />
                                <ListGroup>
                                    {courseCategories.find((category) => category.name === selectedCategory).topics.map((topic, index) => (
                                        user ? (
                                            <ListGroup.Item key={index} as={Link} to={topic.link} className='fancy d-flex align-items-center'>
                                                {IconGetter.GetFaIcon('RegCircleCheck', { className: 'me-2 text-muted' })}
                                                {topic.title}
                                            </ListGroup.Item>
                                        ) : (
                                            <OverlayTrigger
                                                key={index}
                                                placement='right'
                                                overlay={
                                                    <Tooltip id={`tooltip-${index}`} className='fw-bold'>
                                                        Log-In to<br />Save your Progress!
                                                    </Tooltip>
                                                }
                                            >
                                                <ListGroup.Item key={index} as={Link} to={topic.link} className='fancy d-flex align-items-center'>
                                                    {IconGetter.GetFaIcon('RegCircleCheck', { className: 'me-2 text-muted' })}
                                                    {topic.title}
                                                </ListGroup.Item>
                                            </OverlayTrigger>
                                        )
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Base>
    );
};
