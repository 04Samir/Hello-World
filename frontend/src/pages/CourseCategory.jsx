/*
    Category Page
    -------------
*/

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


export const CourseCategory = () => {
    const { category } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getCategoryInfo = async (c) => {
            const categoryInfo = {
                id: 1,
                name: 'Python Functions',
                description: 'Learn how to write functions in Python.',
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
            };
            navigate(categoryInfo.topics[0].link);
        };
        getCategoryInfo(category);
    }, [category, navigate]);

    return null;
};
