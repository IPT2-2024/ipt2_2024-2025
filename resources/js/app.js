import React from "react";
import ReactDOM from "react-dom";
import HeaderBody from "./components/public/superadmindashboard/maindashboard/headerbody";
import SidebarBody from "./components/public/superadmindashboard/maindashboard/sidebarbody";
import "./bootstrap";

const App = () => {
    return (
        <div className="d-flex">
            {/* Sidebar */}
            <SidebarBody />

            {/* Main Content */}
            <div className="flex-grow-1">
                {/* Header */}
                <HeaderBody />

                {/* Main Content Placeholder */}
                <div className="p-3">
                    <h1>Main Content Area</h1>
                </div>
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
