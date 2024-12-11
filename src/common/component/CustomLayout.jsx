import React from 'react';
import {Layout} from 'antd';
import {Outlet} from 'react-router-dom';
import CustomHeader from "@/common/component/CustomHeader";

const CustomLayout = ({notices}) => {
    return (
        <Layout className="bg-gray-100 overflow-x-auto h-screen">
            <CustomHeader notices={notices}/>
            <Outlet/>
        </Layout>
    );
};

export default CustomLayout;
