/*
    The Log-In Page
    ---------------
*/

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button, Col, Container, FloatingLabel, Form, Row, Spinner } from 'react-bootstrap';

import { Base } from '../components';
import { useAuth } from '../context';
import { Fetch } from '../utilities';


export const LogIn = () => {
    const { user, login } = useAuth();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState('');

    useLayoutEffect(() => {
        document.title = 'Log-In | Hello World';
    }, []);

    useEffect(() => {
        if (redirect) {
            setWarning('You Need to be Logged-In to Access that Page!');
        };

        if (user) {
            navigate(redirect ? redirect : '/dashboard');
        };
    }, [user, navigate, redirect]);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        const data = await Fetch('POST', '/log-in', null, {
            username: username,
            password: password,
        });

        if (!data) {
            setError('Login Failed - Please Try Again!');
        } else if (data?.error) {
            setError(`Login Failed - ${data.code}: ${data.error.message}!`);
        } else {
            try {
                await login(data.token);
            } catch (error) {
                setError('Login Failed - Please Try Again!');
            };
        };
        setLoading(false);
    };

    return (
        <Base>
            <Container>
                <Row className='justify-content-md-center mt-5'>
                    <Col md={6}>
                        <h2 className='text-center mb-4'>Log-In</h2>

                        {warning &&
                            <div className='alert alert-warning fw-bold' role='alert'>
                                {warning}
                            </div>
                        }
                        <Form onSubmit={handleLogin}>
                            <Form.Group controlId='formBasicUsername' className='mb-3'>
                                <FloatingLabel
                                    controlId='floatingUsername'
                                    label='Username'
                                >
                                    <Form.Control
                                        type='text'
                                        placeholder='username'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group controlId='formBasicPassword' className='mb-3'>
                                <FloatingLabel
                                    controlId='floatingPassword'
                                    label='Password'
                                >
                                    <Form.Control
                                        type='password'
                                        placeholder='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Button variant='theme' type='submit' className='w-100 mb-3 fw-bold' disabled={loading}>
                                {loading ? (
                                    <Spinner
                                        as='span'
                                        animation='border'
                                        size='sm'
                                        role='status'
                                        aria-hidden='true'
                                    />
                                ) : (
                                    'Log-In'
                                )}
                            </Button>
                        </Form>

                        {error && <p className='mb-0 text-center text-danger fw-bold'>{error}</p>}

                        <p className='text-center'>
                            No Account?{' '}
                            {redirect ? (
                                <Link to={`/sign-up?redirect=${redirect}`}>Sign-Up Here!</Link>
                            ) : (
                                <Link to='/sign-up'>Sign-Up Here!</Link>
                            )}
                        </p>
                    </Col>
                </Row>
            </Container>
        </Base>
    );
};
