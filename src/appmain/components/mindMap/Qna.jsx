import React, {useState} from 'react';
import {Button, Input, Modal, Spin, Tree} from 'antd';
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {useDeleteQna, useGetQna, usePatchQna, usePostQna} from "@hook/useQna";
import CustomEditableInput from "@/common/component/CustomEditableInput";

const Qna = () => {
    const {data: qnaData, isLoading, refetch} = useGetQna();
    const {mutate: postQna} = usePostQna();
    const {mutate: patchQna} = usePatchQna();
    const {mutate: postQnaDelete} = useDeleteQna();

    const [editingKey, setEditingKey] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    const { confirm } = Modal;

    const deleteNode = (key) => {
        confirm({
            title: "삭제 확인",
            icon: <ExclamationCircleOutlined />,
            content: "정말로 이 텍스트를 삭제하시겠습니까?",
            okText: "삭제",
            okType: "danger",
            cancelText: "취소",
            onOk() {
                postQnaDelete(key, {
                    onSuccess: () => refetch(),
                });
            },
            onCancel() {
                console.log("삭제 취소됨");
            },
        });
    };

    // 서버 데이터 -> Tree 데이터 변환
    const mapToTreeData = (data) => {
        return data.map((node) => ({
            key: node.qnaId,
            title: node.qnaContent,
            children: node.children ? mapToTreeData(node.children) : [],
        }));
    };

    const treeData = qnaData ? mapToTreeData(qnaData) : [];

    const addTopLevelCategory = () => {
        if (!newCategoryName.trim()) return;

        postQna(
            {parentId: null, content: newCategoryName},
            {
                onSuccess: () => {
                    setNewCategoryName('');
                    refetch();
                },
            }
        );
    };

    const addNode = (parentKey) => {
        postQna(
            {parentId: parentKey, content: '텍스트를 입력해주세요.'},
            {
                onSuccess: () => refetch(),
            }
        );
    };

    const updateNodeTitle = (key, newTitle) => {
        patchQna(
            {parentId: key, content: newTitle},
            {
                onSuccess: () => {
                    setEditingKey(null);
                    refetch();
                },
            }
        );
    };

    if (isLoading) {
        return <Spin/>;
    }

    return (
        <div className="pt-14 relative bg-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold text-blue-600 mb-4">QnA</h1>

                <div className="flex items-center space-x-4 mb-6">
                    <Input
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <Button
                        type="primary"
                        onClick={addTopLevelCategory}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        상위 카테고리 추가
                    </Button>
                </div>

                <Tree
                    treeData={treeData}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    titleRender={(node) => (
                        <div
                            className="flex items-center shadow-sm transition bg-gray-100 hover:bg-gray-200 p-2 rounded-lg"
                            onDoubleClick={() => setEditingKey(node.key)}
                        >
                            {editingKey === node.key ? (
                                <CustomEditableInput
                                    node={node}
                                    updateNodeTitle={updateNodeTitle}
                                    editingKey={editingKey}
                                    setEditingKey={setEditingKey}
                                />
                            ) : (
                                <span className="flex-grow font-medium text-gray-800">
                                    {node.title}
                                </span>
                            )}
                            <div className="ml-auto flex items-center space-x-2 pl-2">
                                <Button
                                    icon={<PlusOutlined style={{fontSize: '16px', color: 'white'}}/>}
                                    size="small"
                                    className="!bg-green-500 !hover:bg-green-600"
                                    onClick={() => addNode(node.key)}
                                    aria-label="노드 추가"
                                />
                                <Button
                                    icon={<EditOutlined style={{fontSize: '16px', color: 'white'}}/>}
                                    size="small"
                                    className="!bg-yellow-500 !hover:bg-yellow-600"
                                    onClick={() => setEditingKey(node.key)}
                                    aria-label="노드 수정"
                                />
                                <Button
                                    icon={<DeleteOutlined style={{fontSize: '16px', color: 'white'}}/>}
                                    size="small"
                                    danger
                                    className="!bg-red-500 !hover:bg-red-600"
                                    onClick={() => deleteNode(node.key)}
                                    aria-label="노드 삭제"
                                />
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default Qna;
