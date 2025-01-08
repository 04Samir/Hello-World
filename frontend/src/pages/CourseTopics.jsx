/*
    Topics Page
    -----------
*/

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


export const CourseTopics = () => {
    const { course } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        navigate(`/courses/${course}`);
    }, [course, navigate]);

    return null;
};
