/*
	The Main Entry Point
	--------------------
*/

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import { App } from './App';
import { ThemeProvider } from './context';
import './styles/globals.css';


ChartJS.register(ArcElement, Tooltip, Legend);

const root = createRoot(document.getElementById('root'));
root.render(
	<StrictMode>
		<ThemeProvider>
			<App />
		</ThemeProvider>
	</StrictMode>
);
