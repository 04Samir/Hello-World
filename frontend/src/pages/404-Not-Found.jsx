/*
    404 Not Found Page
    ------------------
*/

import React, { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Row } from 'react-bootstrap';


export const NotFound = () => {
    useLayoutEffect(() => {
        document.title = '404 Not Found | Hello World';
    }, []);
    
    return (
        <Container className='mt-5 text-center'>
            <Row>
                <Col>
                    <h1 className='display-4'>404 Not Found</h1>
                    <p className='lead mt-4'>
                        Oops! The Page You are Looking For does Not Exist!
                        <br />
                        Return to the Home Page or Check your URL
                    </p>
                    <Button variant='theme' as={Link} to='/' className='fw-bold mt-3'>
                        Go Home
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};
