import React from "react";
import {Button, Card, Divider} from "antd";


const LeftSidebar = ({resetForm, savedEntries, loadSavedEntry}) => {
    return (
        <div style={{width: '15%', padding: '20px', borderRight: '1px solid #ddd'}}>
            <Button type="primary" onClick={resetForm} style={{marginBottom: '10px'}}>
                새로 만들기
            </Button>

            <Divider>저장된 목록</Divider>
            {savedEntries.length > 0 ? (
                savedEntries.map((entry, index) => (
                    <Card key={index} onClick={() => loadSavedEntry(entry)}
                          style={{marginBottom: '10px', cursor: 'pointer'}}>
                        <p>상차지: {entry.loadLocation}</p>
                        <p>하차지: {entry.unloadLocation}</p>
                        <p>이사 종류: {entry.moveType?.value}</p>
                    </Card>
                ))
            ) : (
                <p>저장된 정보가 없습니다.</p>
            )}
        </div>
    )
}


export default LeftSidebar;