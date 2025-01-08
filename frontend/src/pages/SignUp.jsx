/*
    The Sign-Up Page
    ----------------
*/

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button, Col, Container, FloatingLabel, Form, Row, Spinner } from 'react-bootstrap';

import { Base } from '../components';
import { useAuth } from '../context';
import { Fetch } from '../utilities';


export const SignUp = () => {
    const { user, login } = useAuth();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState('');

    useLayoutEffect(() => {
        document.title = 'Sign-Up | Hello World';
    }, []);

    useEffect(() => {
        if (redirect) {
            setWarning('You Need to be Logged-In to Access that Page!');
        };

        if (user) {
            navigate(redirect ? redirect : '/dashboard');
        };
    }, [user, navigate, redirect]);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords Do Not Match!');
            return;
        };

        setError('');
        setLoading(true);

        const data = await Fetch('POST', '/sign-up', null, {
            username: username,
            password: password,
        });

        if (!data) {
            setError('Sign-Up Failed - Please Try Again!');
        } else if (data?.error) {
            setError(`Sign-Up Failed - ${data.code}: ${data.error.message}!`);
        } else {
            try {
                await login(data.token);
            } catch (error) {
                setError('Sign-Up Failed - Please Try Again!');
            };
        };
        setLoading(false);
    };

    return (
        <Base>
            <Container>
                <Row className='justify-content-md-center mt-5'>
                    <Col md={6}>
                        <h2 className='text-center mb-4'>Sign-Up</h2>

                        {warning &&
                            <div className='alert alert-warning fw-bold' role='alert'>
                                {warning}
                            </div>
                        }
                        <Form onSubmit={handleSignUp}>
                            <Form.Group controlId='username' className='mb-3'>
                                <FloatingLabel
                                    controlId='floatingUsername'
                                    label='Username'
                                >
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter your Username'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group controlId='password' className='mb-3'>
                                <FloatingLabel
                                    controlId='floatingPassword'
                                    label='Password'
                                >
                                    <Form.Control
                                        type='password'
                                        placeholder='Password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </FloatingLabel>
                            </Form.Group>

                            <Form.Group controlId='passwordConfirm' className='mb-3'>
                                <FloatingLabel
                                    controlId='floatingPasswordConfirm'
                                    label='Confirm Password'
                                >
                                    <Form.Control
                                        type='password'
                                        placeholder='Confirm Password'
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    'Sign-Up'
                                )}
                            </Button>
                        </Form>

                        {error && <p className='mb-0 text-center text-danger fw-bold'>{error}</p>}

                        <p className='text-center'>
                            Already Have an Account?
                            {redirect ? (
                                <Link to={`/log-in?redirect=${redirect}`}> Login Here!</Link>
                            ) : (
                                <Link to='/log-in'> Login Here!</Link>
                            )}
                        </p>
                    </Col>
                </Row>
            </Container>
        </Base>
    );
};
