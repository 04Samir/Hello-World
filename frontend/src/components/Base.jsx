/*
    The Base Component
    ------------------
*/

import React from 'react';

import { Header } from './Header';
import { Footer } from './Footer';


export const Base = ({ children, search }) => {
    return (
        <>
            <Header search={search} />

            <main className='py-4'>
                {children}
            </main>

            <Footer />
        </>
    );
};
