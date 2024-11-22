import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./Public/Header";  // Import the Header component

export default function Routers() {
    return (
        <Router>
            <Routes>
                <Route path="/*" element={<Header />} />  {/* Add the Header component here, ensuring it loads for all routes */}
            </Routes>
        </Router>
    );
}

if (document.getElementById('root')) {
    ReactDOM.render(<Routers />, document.getElementById('root'));
}
