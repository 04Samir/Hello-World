/*
    The Footer Component
    --------------------
*/

import React from 'react';


export const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className={`bg-transparent text-center p-3`}>
            <p className='mb-0 mt-5'>
                <b>
                    &copy; {year} Hello World - All Rights Reserved.
                </b>
            </p>
        </footer>
    );
};
