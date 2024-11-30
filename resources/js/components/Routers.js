import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";


import Home from "./Home";
import Login from "./Login";
import Register from "./Register";



export default function Routers() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
            </Routes>
        </Router>
    );
}

if (document.getElementById('root')) {
    ReactDOM.render(<Routers />, document.getElementById('root'));
}
