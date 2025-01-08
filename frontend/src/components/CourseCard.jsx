/*
    Course Card Component
    ---------------------
*/

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, ProgressBar } from 'react-bootstrap';


export const CourseCard = ({ course, children }) => {
    return (
        <Card as={Link} to={course.link}>
            <Card.Body>
                <Card.Title>{course.name}</Card.Title>
                {course.progress && (
                    <ProgressBar now={course.progress} label={`${course.progress}%`} />
                )}
                {children}
            </Card.Body>
        </Card>
    );
};
