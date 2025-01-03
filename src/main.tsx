// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################
import React from 'react';
import ReactDOM from 'react-dom/client';

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################
import App from './App';

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
