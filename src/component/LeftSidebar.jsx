import React from "react";
import {Button, Card, Menu, Typography} from "antd";
import Sider from "antd/es/layout/Sider";
import {PlusOutlined} from "@ant-design/icons";
import {Content, Header} from "antd/es/layout/layout";

const {Title, Text} = Typography;

const LeftSidebar = ({resetForm, savedEntries, loadSavedEntry, deleteEntry}) => {
    return (
        <Sider width={180} className="sidebar">
            <Header className="header">
                <Title level={3} className="header-title">
                    저장 정보
                </Title>
            </Header>

            <Content className="content" style={{height: "100vh"}}>
                <div className="form-container" style={{height: "100vh"}}>
                    <Button type="primary" className="new-info-btn" icon={<PlusOutlined/>}
                            onClick={resetForm}>
                        새로 만들기
                    </Button>

                    {savedEntries.length > 0 ? (
                        savedEntries.map((entry, index) => (
                            <Card>
                                <Title key={index} level={5} className="saved-list-title">
                                    <p>상차지: {entry.loadLocation}</p>
                                    <p>하차지: {entry.unloadLocation}</p>
                                    <p>이사 종류: {entry.moveType?.value}</p>
                                </Title>

                                <Button danger onClick={() => deleteEntry(entry.id)}>
                                    삭제
                                </Button>
                            </Card>
                        ))
                    ) : (
                        <Text type="secondary" className="no-data">
                            저장된 정보가 없습니다.
                        </Text>
                    )}
                </div>
            </Content>
        </Sider>
    )
}


export default LeftSidebar;