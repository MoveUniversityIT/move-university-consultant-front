import React from "react";
import {Button, Card, Divider} from "antd";

const LeftSidebar = ({resetForm, savedEntries, loadSavedEntry, deleteEntry}) => {
    return (
        <>
            <Button type="primary" onClick={resetForm} style={{marginBottom: '10px'}}>
                새로 만들기
            </Button>

            <Divider>저장된 목록</Divider>
            {savedEntries.length > 0 ? (
                savedEntries.map((entry, index) => (
                    <Card key={index} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', cursor: 'pointer'}}>
                        <div onClick={() => loadSavedEntry(entry)}>
                            <p>상차지: {entry.loadLocation}</p>
                            <p>하차지: {entry.unloadLocation}</p>
                            <p>이사 종류: {entry.moveType?.value}</p>
                        </div>

                        <Button type="danger" onClick={() => deleteEntry(entry.id)}>
                            삭제
                        </Button>
                    </Card>
                ))
            ) : (
                <p>저장된 정보가 없습니다.</p>
            )}
        </>
    )
}


export default LeftSidebar;