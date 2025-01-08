/*
    The Header Component
    --------------------
*/

import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, ButtonGroup, Container, Dropdown, Form, FormControl, Nav, Navbar } from 'react-bootstrap';

import { useAuth, useTheme } from '../context';
import { IconGetter } from '../utilities';


export const Header = ({ search }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [scrolling, setScrolling] = useState(false);

    const { currentTheme, toggleTheme } = useTheme();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const searchQuery = e.target.elements.search.value.trim();
        if (searchQuery) {
            navigate(`/search?query=${searchQuery}`);
        };
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolling(true);
            } else {
                setScrolling(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
   
    return (
        <Navbar sticky='top' className={`${scrolling ? 'scrolled' : 'default'} py-3`}>
            <Container>
                <Navbar.Brand as={Link} to='/' className='fs-3'>
                    Hello World!
                </Navbar.Brand>
                <Nav className='me-auto'>
                    <Form onSubmit={handleSearchSubmit}>
                        <FormControl
                            type='search'
                            name='search'
                            placeholder='Search'
                            defaultValue={search || ''}
                            aria-label='Search'
                            className='fs-6'
                            required
                        />
                    </Form>
                </Nav>
                <Nav>
                    <Button variant='theme' className='me-2 fw-bold' as={Link} to='/courses'>COURSES</Button>
                    {user ? (
                        <Dropdown>
                            <Dropdown.Toggle variant='outline-theme' id='dropdown-basic' className='fw-bold'>
                                {user.username.toUpperCase()}
                            </Dropdown.Toggle>

                            <Dropdown.Menu align='end'>
                                <Dropdown.Item as={Link} to='/dashboard'>Dashboard</Dropdown.Item>
                                <Dropdown.Item as={Link} to={`/users/${user.username}`}>Profile</Dropdown.Item>
                                <Dropdown.Item as={Link} to='/settings'>Settings</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item as={Link} to='/log-out'>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <ButtonGroup>
                            <Button variant='outline-theme' className='fw-bold' as={Link} to='/log-in'>LOG-IN</Button>
                            <Button variant='outline-theme' className='fw-bold' as={Link} to='/sign-up'>SIGN-UP</Button>
                        </ButtonGroup>
                    )}
                    <Button
                        variant='theme'
                        className='ms-2'
                        aria-label={`Toggle ${currentTheme === 'dark' ? 'Light' : 'Dark'} Theme`}
                        onClick={toggleTheme}
                    >
                        {currentTheme === 'dark' ? IconGetter.GetBsIcon('SunFill') : IconGetter.GetBsIcon('MoonFill')}
                    </Button>
                </Nav>
            </Container>
        </Navbar>
    );
};
