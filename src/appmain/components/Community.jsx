import React from 'react';
import Notice from "@component/Notice";

const Community = ({notices, setNotices}) => {
    return (
        <div className="pt-14 relative h-full">
            <div
                className="h-full grid gap-2 p-2 mx-auto overflow-x-auto"
                style={{
                    gridTemplateColumns: "1fr 1fr",
                }}
            >
                <Notice notices={notices} setNotices={setNotices}/>
            </div>
        </div>
    );
};

export default Community;
