/*
    Topic Page
    ---------
*/

import React, { useLayoutEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Accordion, Breadcrumb, Button, Card, Col, Container, ListGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';

import { Base } from '../components';
import { useAuth } from '../context';
import { IconGetter } from '../utilities';


export const CourseTopic = () => {
    const navigate = useNavigate();

    const { user } = useAuth();

    // Dummy Data
    const courseDetails = {
        title: 'Python: Introduction to Programming',
        language: 'python',
        icon: IconGetter.GetFaIcon('Python'),
    };

    const courseCategories = [
        {
            id: 1,
            name: 'Functions',
            description: 'Learn how to write functions in Python.',
            icon: IconGetter.GetFaIcon('Python'),
            topics: [
                {
                    id: 1,
                    title: 'Introduction to Functions',
                    description: 'Learn what are functions and how to write them.',
                    link: '/courses/python/topics/functions/introduction-to-functions',
                },
                {
                    id: 2,
                    title: 'Function Arguments',
                    description: 'Learn how to pass arguments to functions.',
                    link: '/courses/python/topics/functions/function-arguments',
                },
                {
                    id: 3,
                    title: 'Return Statement',
                    description: 'Learn how to use the return statement.',
                    link: '/courses/python/topics/functions/return-statement',
                },
            ],
        },
        {
            id: 2,
            name: 'Loops',
            description: 'Learn how to use loops in Python.',
            icon: IconGetter.GetFaIcon('Python'),
            topics: [
                {
                    id: 1,
                    title: 'Introduction to Loops',
                    description: 'Learn what are loops and how to use them.',
                    link: '/courses/python/topics/loops/introduction-to-loops',
                },
                {
                    id: 2,
                    title: 'For Loop',
                    description: 'Learn how to use the for loop.',
                    link: '/courses/python/topics/loops/for-loop',
                },
                {
                    id: 3,
                    title: 'While Loop',
                    description: 'Learn how to use the while loop.',
                    link: '/courses/python/topics/loops/while-loop',
                },
            ],
        },
        {
            id: 3,
            name: 'Data Structures',
            description: 'Learn about different data structures in Python.',
            icon: IconGetter.GetFaIcon('Python'),
            topics: [
                {
                    id: 1,
                    title: 'Lists',
                    description: 'Learn how to use lists in Python.',
                    link: '/courses/python/topics/data-structures/lists',
                },
                {
                    id: 2,
                    title: 'Tuples',
                    description: 'Learn how to use tuples in Python.',
                    link: '/courses/python/topics/data-structures/tuples',
                },
                {
                    id: 3,
                    title: 'Dictionaries',
                    description: 'Learn how to use dictionaries in Python.',
                    link: '/courses/python/topics/data-structures/dictionaries',
                },
            ],
        },
    ];

    const courseTopicInfo = {
        id: 1,
        category_id: 1,
        title: 'Introduction to Functions',
        description: 'Learn what are functions and how to write them.',
        content: `A function is a block of code that only runs when it is called. `,
        category: 'functions',
    };

    const courseTopicQuiz = {
        link: '/courses/python/topics/functions/quiz',
    };

    const addLineBreaks = (text) => {
        return text.split('\n').map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>);
    };

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(activeCategory === categoryId.toString() ? null : categoryId.toString());
    };

    useLayoutEffect(() => {
        document.title = `${courseTopicInfo.title} - ${courseDetails.title} | Hello World`;
    }, [courseTopicInfo.title, courseDetails.title]);

    const [activeCategory, setActiveCategory] = useState(courseTopicInfo.category_id.toString());

    return (
        <Base>
            <Container className='mt-5'>
                <Row>
                    <Col md={3}>
                        <Card className='mb-4'>
                            <Card.Header as='h4'>
                                {courseDetails.language.charAt(0).toUpperCase() + courseDetails.language.slice(1)}: Course Index
                            </Card.Header>
                            <Card.Body>
                                <Accordion activeKey={activeCategory} onClick={(e) => e.preventDefault()}>
                                    {courseCategories.map((category) => (
                                        <Accordion.Item eventKey={category.id.toString()} key={category.id}>
                                            <Accordion.Header
                                                className='fs-6'
                                                onClick={() => handleCategoryClick(category.id)}
                                            >
                                                {IconGetter.GetFaIcon('RegCircleCheck', { className: 'me-2 text-muted' })}
                                                {category.name}
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <ListGroup>
                                                    {category.topics.map((topic) => (
                                                        <ListGroup.Item
                                                            as={Link}
                                                            to={topic.link}
                                                            key={topic.id}
                                                            action
                                                            active={topic.id === courseTopicInfo.id && category.id.toString() === courseTopicInfo.category_id.toString()}
                                                            variant='theme'
                                                            className='fancy d-flex align-items-center'
                                                        >
                                                            {IconGetter.GetFaIcon('RegCircleCheck', { className: 'me-2 text-muted' })}
                                                            {topic.title}
                                                        </ListGroup.Item>
                                                    ))}
                                                </ListGroup>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </Card.Body>
                            <Card.Footer>
                                <Breadcrumb>
                                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/courses' }}>
                                        courses
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        {courseDetails.language}
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item active>
                                        {courseTopicInfo.category}
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col md={9}>
                        <Card>
                            <Card.Header as='h4'>
                                {courseTopicInfo.title}
                            </Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {addLineBreaks(courseTopicInfo.description)}

                                    {user ? (
                                        <OverlayTrigger
                                            placement='top'
                                            overlay={<Tooltip>Take the quiz</Tooltip>}
                                        >
                                            <Button
                                                as={Link}
                                                to={courseTopicQuiz.link}
                                                className='mt-2 w-100 fw-bold'
                                                variant='theme'
                                            >
                                                Attempt Quiz
                                            </Button>
                                        </OverlayTrigger>
                                    ) : (
                                        <OverlayTrigger
                                            placement='top'
                                            overlay={<Tooltip>Log-In to<br /> Take the Quiz</Tooltip>}
                                        >
                                            <Button
                                                onClick={() => navigate(`/log-in?redirect=${courseTopicQuiz.link}`)}
                                                className='mt-2 w-100 fw-bold'
                                                variant='theme'
                                            >
                                                Attempt Quiz
                                            </Button>
                                        </OverlayTrigger>
                                    )}
                                </Card.Text>
                                <hr />
                                <Card.Text>
                                    {addLineBreaks(courseTopicInfo.content)}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Base>
    );
};
