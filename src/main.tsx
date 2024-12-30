// ##########################################################################
// #                                 IMPORT NPM                             #
// ##########################################################################
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// ##########################################################################
// #                           IMPORT Components                            #
// ##########################################################################
import App from './App';
import { store, persistor } from './content/store/store';

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={<p>Loading...</p>} persistor={persistor}></PersistGate>
        </Provider>
        <App />
    </React.StrictMode>
);
