import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const LoadingSpinner = ({ size = 24, tip = "Loading..." }) => {
    const antIcon = <LoadingOutlined style={{ fontSize: size }} spin />;

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Spin indicator={antIcon} tip={tip} />
        </div>
    );
};

export default LoadingSpinner;
