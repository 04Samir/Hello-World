/*
    Search Results 
    --------------
*/

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Badge, Breadcrumb, Card, Container, Dropdown, Form } from 'react-bootstrap';

import { Base } from '../components';


export const Search = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');

    const [filterTypes, setFilterTypes] = useState([]);

    useLayoutEffect(() => {
        document.title = `Search Results: '${query}' | Hello World`;
    }, [query]);

    useEffect(() => {
        if (!query) {
            navigate('/');
        };
    }, [query, navigate]);

    const results = [
        {
            name: 'Python: Introduction to Programming',
            description: 'Learn the basics of programming with Python!',
            link: '/courses/python',
            type: 'course'
        },
        {
            name: 'Python: Functions & Modules',
            description: 'Learn to create and use functions and modules in Python!',
            link: '/courses/python/topics/functions-modules',
            type: 'topic'
        },
        {
            name: 'Python: Object-Oriented Programming',
            description: 'Learn the principles of object-oriented programming in Python!',
            link: '/courses/python/topics/oop',
            type: 'topic'
        },
        {
            name: 'Python: File Handling',
            description: 'Learn to read and write files in Python!',
            link: '/courses/python/topics/file-handling',
            type: 'topic'
        },
        {
            name: 'pythonicGuy',
            description: 'A Python enthusiast who loves to code!',
            link: '/users/pythonicGuy',
            type: 'user'
        }
    ];

    const updateFilterTypes = (type) => {
        if (filterTypes.includes(type)) {
            setFilterTypes(filterTypes.filter(filterType => filterType !== type));
        } else {
            setFilterTypes([...filterTypes, type]);
        }
    };

    const filteredResults = results.filter(result => filterTypes.length === 0 || filterTypes.includes(result.type));

    return (
        <Base search={query}>
            <Container className='mt-5'>
                <h2>Search Results for '{query}'</h2>
                <div className='d-flex align-items-center justify-content-between'>
                    {results.length} Results Found
                    {filteredResults.length > 0 && (
                        <Dropdown className='d-inline-block' autoClose='outside' variant='theme'>
                            <Dropdown.Toggle variant='theme' id='filter-dropdown'>
                                {`Filter by Type [${filterTypes.length}]`}
                            </Dropdown.Toggle>
                            <Dropdown.Menu align='end'>
                                <Form>
                                    {results.reduce((categories, result) => {
                                        if (!categories.includes(result.type)) {
                                            categories.push(result.type);
                                        }
                                        return categories;
                                    }, []).map(category => (
                                        <Dropdown.ItemText key={category} onClick={() => updateFilterTypes(category)}>
                                            <Form.Check
                                                type='checkbox'
                                                label={category.charAt(0).toUpperCase() + category.slice(1)}
                                                checked={filterTypes.includes(category)}
                                                onChange={() => updateFilterTypes(category)}
                                            />
                                        </Dropdown.ItemText>
                                    ))}
                                </Form>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </div>
                <hr className='text-theme' />

                {filteredResults.length !== 0 && (
                    filteredResults.map((result) => (
                        <Card key={result.name} className='mb-3 fancy'>
                            <Card.Body>
                                <Card.Title as={Link} to={result.link} className='d-flex align-items-center fs-5 fw-bold'>
                                    {result.name}
                                    <Badge bg='theme' className='ms-2'>
                                        {result.type.toUpperCase()}
                                    </Badge>
                                </Card.Title>

                                <Card.Subtitle className='mb-2'>
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
                            </Card.Body>
                        </Card>
                    ))
                )}
            </Container>
        </Base>
    );
};
