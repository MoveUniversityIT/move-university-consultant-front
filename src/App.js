import React from 'react';
import Router from "@/appcore/routes/Router";
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import "antd/dist/reset.css";
import "./App.css";

dayjs.locale('ko');

function App() {
    return (
        <div className="App">
            <Router/>
        </div>
    );
}

export default App;
