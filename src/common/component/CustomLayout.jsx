import React, {useEffect} from 'react';
import {Layout} from 'antd';
import {Outlet} from 'react-router-dom';
import CustomHeader from "@/common/component/CustomHeader";
import {useSelector} from "react-redux";
import {useGetNotice} from "@hook/useUser";

const CustomLayout = ({notices, setNotices}) => {
    const userId = useSelector((state) => state.login.userId);
    const {data: noticesData} = useGetNotice(userId);

    useEffect(() => {
        if (noticesData) {
            setNotices(noticesData);
        }
    }, [noticesData]);

    return (
        <Layout className="bg-gray-100 overflow-x-auto h-screen">
            <CustomHeader notices={notices}/>
            <Outlet/>
        </Layout>
    );
};

export default CustomLayout;
