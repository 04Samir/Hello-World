/*
    Courses Page
    ------------
*/

import React, { useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Breadcrumb, Button, Card, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

import { Base } from '../components';


export const Courses = () => {
    const [selectedCourse, setSelectedCourse] = useState();
    const [selectedFilter, setSelectedFilter] = useState('a-z');

    // Dummy Data
    const courses = [
        {
            name: 'Python: Introduction to Programming',
            description: 'Learn the basics of programming with Python!',
            link: '/courses/python',
            language: 'Python',
            topics: [
                {
                    name: 'Functions & Modules',
                    description: 'Learn to create and use functions and modules in Python!',
                    link: '/courses/python/topics/functions-modules'
                },
                {
                    name: 'Object-Oriented Programming',
                    description: 'Learn the principles of object-oriented programming in Python!',
                    link: '/courses/python/topics/oop'
                },
                {
                    name: 'File Handling',
                    description: 'Learn to read and write files in Python!',
                    link: '/courses/python/topics/file-handling'
                }
            ]
        },
        {
            name: 'Java: Introduction to Programming',
            description: 'Learn the basics of programming with Java!',
            link: '/courses/java',
            language: 'Java',
            topics: [
                {
                    name: 'Functions & Objects',
                    description: 'Learn to create and use functions and objects in Java!',
                    link: '/courses/java/topics/functions-objects'
                },
                {
                    name: 'Object-Oriented Programming',
                    description: 'Learn the principles of object-oriented programming in Java!',
                    link: '/courses/java/topics/oop'
                },
                {
                    name: 'File Handling',
                    description: 'Learn to read and write files in Java!',
                    link: '/courses/java/topics/file-handling'
                }
            ]
        },
        {
            name: 'Node.JS: Introduction to Back-End Development',
            description: 'Learn the basics of back-end development with Node.JS!',
            link: '/courses/nodejs',
            language: 'Node.JS',
            topics: [
                {
                    name: 'Express.JS',
                    description: 'Learn to create and use Express.JS in Node.JS!',
                    link: '/courses/nodejs/topics/expressjs'
                },
                {
                    name: 'MongoDB',
                    description: 'Learn to create and use MongoDB in Node.JS!',
                    link: '/courses/nodejs/topics/mongodb'
                },
                {
                    name: 'File Handling',
                    description: 'Learn to read and write files in Node.JS!',
                    link: '/courses/nodejs/topics/file-handling'
                }
            ]
        },
        {
            name: 'SQL: Introduction to Databases',
            description: 'Learn the basics of databases and SQL!',
            link: '/courses/sql',
            language: 'SQL',
            topics: [
                {
                    name: 'Creating Databases',
                    description: 'Learn to create and manage databases in SQL!',
                    link: '/courses/sql/topics/creating-databases'
                },
                {
                    name: 'Querying Databases',
                    description: 'Learn to query and manipulate databases in SQL!',
                    link: '/courses/sql/topics/querying-databases'
                },
                {
                    name: 'Database Management',
                    description: 'Learn to manage databases in SQL!',
                    link: '/courses/sql/topics/database-management'
                }
            ]
        }
    ];

    useLayoutEffect(() => {
        document.title = 'All Courses | Hello World';
    }, []);

    const handleCourseClick = (index) => {
        setSelectedCourse(selectedCourse === index ? null : index);
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };

    const filteredResults = courses.sort((a, b) => {
        if (selectedFilter === 'a-z') {
            return a.name.localeCompare(b.name);
        } else if (selectedFilter === 'z-a') {
            return b.name.localeCompare(a.name);
        } else {
            return 0;
        }
    });

    return (
        <Base>
            <Container className='mt-5'>
                <h2>List of Courses</h2>
                <div className='d-flex align-items-center justify-content-between'>
                    Browse through Our Collection of {courses.length} Courses!
                    {filteredResults.length > 0 && (
                        <Dropdown className='d-inline-block' autoClose='outside' variant='theme'>
                            <Dropdown.Toggle variant='theme' id='filter-dropdown'>
                                Sorted By: {selectedFilter === 'a-z' ? 'A to Z' : 'Z to A'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu align='end'>
                                <Form>
                                    <Dropdown.ItemText onClick={() => handleFilterChange('a-z')}>
                                        <Form.Check
                                            type='radio'
                                            label='A to Z'
                                            checked={selectedFilter === 'a-z'}
                                            onChange={() => handleFilterChange('a-z')}
                                        />
                                    </Dropdown.ItemText>
                                    <Dropdown.ItemText onClick={() => handleFilterChange('z-a')}>
                                        <Form.Check
                                            type='radio'
                                            label='Z to A'
                                            checked={selectedFilter === 'z-a'}
                                            onChange={() => handleFilterChange('z-a')}
                                        />
                                    </Dropdown.ItemText>
                                </Form>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>
                <hr className='text-theme' />
                {filteredResults.length !== 0 && (
                    <Row xs={1} md={2} lg={2}>
                        {filteredResults.map((result, index) => (
                            <Col key={result.name} className='mb-3'>
                                <Card>
                                    <Card.Body className='course-card'>
                                        <Card.Title className='d-flex align-items-center fs-5 fw-bold'>
                                            {result.name}
                                        </Card.Title>
                                        <Card.Subtitle className='mb-2 text-muted'>
                                            <Breadcrumb className='fs-6'>
                                                {result.link.split('/').filter(part => part !== '').map((linkPart, i, parts) => (
                                                    <Breadcrumb.Item href={parts.slice(0, i + 1).join('/')} key={i}>
                                                        {linkPart}
                                                    </Breadcrumb.Item>
                                                ))}
                                            </Breadcrumb>
                                        </Card.Subtitle>
                                        <Card.Text className='lead'>
                                            {result.description}
                                        </Card.Text>
                                        <Accordion activeKey={selectedCourse === index ? '0' : undefined} onClick={() => handleCourseClick(index)}>
                                            <Accordion.Item eventKey='0'>
                                                <Accordion.Header className='fs-6'>
                                                    Click to See the Key Topics Covered
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    {result.topics.map((topic, topicIndex) => (
                                                        <Card
                                                            key={topic.name}
                                                            className={`fancy${topicIndex !== result.topics.length - 1 ? ' mb-3' : ''}`}
                                                            as={Link}
                                                            to={topic.link}
                                                        >                                                            <Card.Body>
                                                                <Card.Title className='d-flex align-items-center fs-5 fw-bold'>
                                                                    {topic.name}
                                                                </Card.Title>
                                                                <Card.Text className='fs-6'>
                                                                    {topic.description}
                                                                </Card.Text>
                                                            </Card.Body>
                                                        </Card>
                                                    ))}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                        <Button variant='theme' as={Link} to={result.link} className='mt-3 w-100 fw-bold'>
                                            View Course Details
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </Base>
    );
};
