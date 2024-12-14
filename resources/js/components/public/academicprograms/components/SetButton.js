import React from "react";
import { Button } from "antd";

const SetButton = ({ onClick }) => {
    return (
        <Button
            type="primary"
            onClick={onClick}
            style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
            }}
        >
            Set
        </Button>
    );
};

export default SetButton;
