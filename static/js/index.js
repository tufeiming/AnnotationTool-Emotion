import React from 'react';
import ReactDOM from 'react-dom';
import Check from './components/Check';
import Label from './components/Label';

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.render(
        <React.StrictMode>
            <Check />
            <Label />
        </React.StrictMode>,
        rootElement
    );
}
