import React, { useState } from 'react';
import { Button, Modal, Tabs } from 'antd';
import UserInfor from './UserInfo';
import ChangePassword from './ChangePassword';

const ManageAccount = (props) => {
    const { isModalOpen, setIsModalOpen } = props;

    const items = [
        {
            key: 'info',
            label: `Cập nhật thông tin`,
            children: <UserInfor />,
        },
        {
            key: 'password',
            label: `Đổi mật khẩu`,
            children: <ChangePassword />,
        },
    ];

    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={isModalOpen}
                footer={null}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}
                width={"60vw"}
            >
                <Tabs
                    defaultActiveKey="info"
                    items={items}
                />
            </Modal>
        </>
    );
};
export default ManageAccount;