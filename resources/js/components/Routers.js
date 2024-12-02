import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";


import Login from "./Login";




export default function Routers() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                
                
                
            </Routes>
        </Router>
    );
}

if (document.getElementById('root')) {
    ReactDOM.render(<Routers />, document.getElementById('root'));
}
