// import React from 'react';
// import App from './App';
// import './index.css';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div id="container">
      <h1 id="h1">
        hello<span style={{ color: 'red' }}>world</span>
      </h1>
      <h2 id="h2">
        hello2<span style={{ color: 'green' }}>world2</span>
      </h2>
    </div>
  );
};
const element = <App />;
// console.log(element, ReactDOM);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(element);
