/*
    User Profile
    ------------
*/

import React, { useLayoutEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Col, Container, Image, Nav, ProgressBar, Row, Tab } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';

import { Base } from '../components';
import { useTheme } from '../context';
import { IconGetter } from '../utilities';


export const Profile = () => {
    const { currentTheme } = useTheme();

    const { username } = useParams();

    // Dummy Data
    const PlaceHolder = '/icons/placeholder.jpg';

    const user = {
        image: '/icons/placeholder-user.jpg',
        displayName: username,
        username: username,
        joinedAt: 'January 2022',
        rank: '21',
        bio: 'Example Bio',
        location: 'United Kingdom',
        badges: [
            {
                name: 'Badge 1',
                icon: PlaceHolder,
                dateEarned: 'January 2024',
            },
            {
                name: 'Badge 2',
                icon: PlaceHolder,
                dateEarned: 'December 2023',
            },
            {
                name: 'Badge 3',
                icon: PlaceHolder,
                dateEarned: 'November 2023',
            },
            {
                name: 'Badge 4',
                icon: PlaceHolder,
                dateEarned: 'October 2023',
            },
            {
                name: 'Badge 5',
                icon: PlaceHolder,
                dateEarned: 'September 2023',
            },
            {
                name: 'Badge 6',
                icon: PlaceHolder,
                dateEarned: 'August 2023',
            },
            {
                name: 'Badge 7',
                icon: PlaceHolder,
                dateEarned: 'July 2023',
            },
            {
                name: 'Badge 8',
                icon: PlaceHolder,
                dateEarned: 'June 2023',
            },
        ],
    };

    const userLanguages = [
        { name: 'Python', courses: Math.max(1, Math.floor(Math.random() * 100)) },
        { name: 'JavaScript', courses: Math.max(1, Math.floor(Math.random() * 100)) },
        { name: 'Java', courses: Math.max(1, Math.floor(Math.random() * 100)) },
        { name: 'C++', courses: Math.max(1, Math.floor(Math.random() * 100)) },        
    ];

    const getRandomColours = (existingColors) => {
        const hueDifferenceThreshold = 30;
        let attempts = 0;
        const lightness = currentTheme === 'light' ? 50 : 75;
        const bd_colour = currentTheme === 'light' ? 'black' : 'white';
    
        const isDifferentEnough = (random) => {
            return existingColors.every(existingColor => {
                if (existingColor) {
                    const existingHue = parseInt(existingColor.substring(4, existingColor.indexOf(',')));
                    return Math.abs(random - existingHue) > hueDifferenceThreshold;
                }
                return true;
            });
        };
    
        let random;
        while (attempts < 100) {
            random = Math.floor(Math.random() * 360);
    
            if (isDifferentEnough(random)) {
                return [`hsl(${random}, 100%, ${lightness}%)`, bd_colour];
            }
            attempts++;
        }
    
        return [`hsl(${random}, 100%, ${lightness}%)`, bd_colour];
    };

    const existingColors = userLanguages.map(language => language.bg_color);
    userLanguages.forEach((language) => {
        language.percentage = Math.floor((language.courses / userLanguages.reduce((acc, cur) => acc + cur.courses, 0)) * 100);
        [language.bg_color, language.bd_colour] = getRandomColours(existingColors);
        existingColors.push(language.bg_color);
    });

    const userCurrentCourses = [
        { name: 'Course 1', progress: Math.floor(Math.random() * 100), link: '/courses/Course-1', started: '10 Days Ago', lastActive: '2 Days Ago' },
        { name: 'Course 2', progress: Math.floor(Math.random() * 100), link: '/courses/Course-2', started: '5 Days Ago', lastActive: 'Yesterday' },
        { name: 'Course 3', progress: Math.floor(Math.random() * 100), link: '/courses/Course-3', started: 'Yesterday', lastActive: '1 Hour Ago' },
    ];

    const userCompletedCourses = [
        { name: 'Course 4', link: '/courses/Course-4', started: '2 Months Ago', completed: '1 Month Ago' },
        { name: 'Course 5', link: '/courses/Course-5', started: '3 Months Ago', completed: '2 Months Ago' },
        { name: 'Course 6', link: '/courses/Course-6', started: '4 Months Ago', completed: '3 Months Ago' },
    ];

    useLayoutEffect(() => {
        document.title = `@${username} | Hello World`;
    }, [username]);

    return (
        <Base>
            <Container className='mt-4'>
                <Row>
                    <Col md={3}>
                        <Card>
                            <Card.Body>
                                <Card.Img
                                    src={user.image}
                                    className='mb-3'
                                    style={{ width: '100%', height: '100%', margin: 'auto' }}
                                    draggable='false'
                                />
                                <Card.Title className='mb-1 fw-bold'>{user.displayName}</Card.Title>
                                <Card.Subtitle className='mb-2 text-muted'>@{user.username}</Card.Subtitle>
                                <hr />
                                <div className='mb-2 text-center'>
                                    <Card.Subtitle className='fs-5 my-3'>
                                        <i>'{user.bio}'</i>
                                    </Card.Subtitle>
                                </div>
                                <hr />
                                <div className='d-flex align-items-center mb-2'>
                                    {IconGetter.GetBsIcon('Award', { className: 'me-2' })}
                                    <Card.Subtitle className='mb-0'>Ranked #{user.rank}</Card.Subtitle>
                                </div>
                                <div className='d-flex align-items-center mb-2'>
                                    {IconGetter.GetBsIcon('GeoAlt', { className: 'me-2' })}
                                    <Card.Subtitle className='mb-0'>{user.location}</Card.Subtitle>
                                </div>
                                <div className='d-flex align-items-center mb-2'>
                                    {IconGetter.GetBsIcon('Clock', { className: 'me-2' })}
                                    <Card.Subtitle className='mb-0'>Joined In {user.joinedAt}</Card.Subtitle>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={9}>
                        <Row className='mb-3 g-3'>
                            <Col md={6}>
                                <Card style={{ height: '25rem' }}>
                                    <Card.Header>
                                        <Card.Title className='fw-bold'>Languages</Card.Title>
                                    </Card.Header>
                                    <Card.Body className='d-flex align-items-center justify-content-center overflow-auto'>
                                        <div style={{ width: '200px', height: '200px' }}>
                                            <Doughnut
                                                data={{
                                                    labels: userLanguages.map((language) => language.name),
                                                    datasets: [{
                                                        data: userLanguages.map((language) => language.courses),
                                                        backgroundColor: userLanguages.map((language) => language.bg_color),
                                                        borderColor: userLanguages.map((language) => language.bd_colour),
                                                        borderWidth: 1,
                                                    }],
                                                }}
                                                options={{
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    plugins: {
                                                        legend: {
                                                            display: false,
                                                        },
                                                        tooltip: {
                                                            backgroundColor: currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
                                                            titleColor: currentTheme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                                                            titleFont: {
                                                                family: 'Euclid Circular A, sans-serif',
                                                                weight: 'bold',
                                                                size: 16,
                                                            },
                                                            bodyColor: currentTheme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                                                            bodyFont: {
                                                                family: 'Roboto Mono, monospace',
                                                                weight: 'bold',
                                                                size: 14,
                                                            },
                                                            boxPadding: 5,
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                        <div className='ms-3 w-100'>
                                            {userLanguages.map((language) => (
                                                <div key={language.name} className='mb-3 d-flex flex-column'>
                                                    <div className='d-flex justify-content-between'>
                                                        <span className='fw-bold'>{language.name}</span>
                                                        <small>{`${language.courses} Courses`}</small>
                                                    </div>
                                                    <ProgressBar
                                                        className='align-self-stretch'
                                                    >
                                                        <ProgressBar
                                                            now={language.percentage}
                                                            label={`${language.percentage}%`}
                                                            style={{
                                                                backgroundColor: language.bg_color,
                                                                textShadow: `0 0 5px ${currentTheme === 'dark' ? 'black' : 'white'}`,
                                                                color: currentTheme === 'dark' ? 'white' : 'black',
                                                            }}
                                                        />
                                                    </ProgressBar>

                                                </div>
                                            ))}
                                        </div>
                                    </Card.Body>
                                    <Card.Footer>
                                        * Based on {userLanguages.reduce((acc, cur) => acc + cur.courses, 0)} Completed Courses
                                    </Card.Footer>
                                </Card>
                            </Col>
                            <Col md={6}>
                                <Card style={{ height: '25rem' }}>
                                    <Card.Header>
                                        <Card.Title className='fw-bold'>Badges</Card.Title>
                                    </Card.Header>
                                    <Card.Body className='overflow-auto'>
                                        {user.badges.map((badge) => (
                                            <Card key={badge.name} className='mt-1 fancy' style={{ height: '5rem' }}>
                                                <Card.Body className='d-flex'>
                                                    <Image src={badge.icon} rounded style={{ height: '3rem', width: '3rem' }} />
                                                    <div className='flex-grow-1'>
                                                        <Card.Text className='ms-2 mb-0 fw-bold'>{badge.name}</Card.Text>
                                                        <Card.Text className='ms-2 mb-0 text-muted'>{badge.dateEarned}</Card.Text>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </Card.Body>
                                    <Card.Footer>
                                        * {user.badges.length} Badges Earned
                                    </Card.Footer>
                                </Card>
                            </Col>

                        </Row>

                        <Card>
                            <Tab.Container id='course-tabs' defaultActiveKey='current' transition={false}>
                                <Card.Header>
                                    <Nav variant='tabs'>
                                        <Nav.Item className='fw-bold'>
                                            <Nav.Link eventKey='current'>
                                                {IconGetter.GetBsIcon('Book', { className: 'me-2', size: '1.5rem' })} Current Courses
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item className='fw-bold'>
                                            <Nav.Link eventKey='completed'>
                                                {IconGetter.GetBsIcon('ListCheck', { className: 'me-2', size: '1.5rem' })} Completed Courses
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                <Card.Body>
                                    <Tab.Content>
                                        <Tab.Pane eventKey='current'>
                                            {userCurrentCourses.map((course) => (
                                                <Card key={course.name} className='mb-3' as={Link} to={course.link}>
                                                    <Card.Body>
                                                        <Card.Title className='d-flex align-items-center fs-5 fw-bold'>
                                                            {course.name}
                                                        </Card.Title>

                                                        <Card.Subtitle className='mb-2 text-muted'>
                                                            Started {course.started} • Last Active {course.lastActive}
                                                        </Card.Subtitle>

                                                        <ProgressBar now={course.progress} label={`${course.progress}%`} className='mb-2' />

                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </Tab.Pane>
                                        <Tab.Pane eventKey='completed'>
                                            {userCompletedCourses.map((course) => (
                                                <Card key={course.name} className='mb-3 fancy' as={Link} to={course.link}>
                                                    <Card.Body>
                                                        <Card.Title className='d-flex align-items-center fs-5 fw-bold'>
                                                            {course.name}
                                                        </Card.Title>

                                                        <Card.Subtitle className='mb-2 text-muted'>
                                                            Started {course.started} • Completed {course.completed}
                                                        </Card.Subtitle>
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Card.Body>
                            </Tab.Container>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Base>
    );
};
