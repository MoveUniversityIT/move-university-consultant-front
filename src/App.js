import React from 'react';
const Consultant = React.lazy(() => import('@/component/Consultant'));

function App() {
    return (
        <div className="App">
            <Consultant />
        </div>
    );
}

export default App;
