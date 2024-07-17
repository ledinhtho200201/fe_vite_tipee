import { CloudUploadOutlined, DeleteTwoTone, EditTwoTone, ExportOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Col, Popconfirm, Row, Table } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { FORMAT_DATE_DISPLAY } from "../../../utils/constant";
import { callFetchListBook } from "../../../services/api";
import InputSearch from "./InputSearch";
import BookViewDetail from "./BookViewDetail";
import BookModalCreate from "./BookModalCreate";


const BookTable = () => {
    const [listBook, setListBook] = useState([]);
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt");
    const [dataViewDetail, setDataViewDetail] = useState(null);
    const [openViewDetail, setOpenViewDetail] = useState(true);
    const [openModalCreate, setOpenModalCreate] = useState(false);

    useEffect(() => {
        fetchBook();
    }, [current, pageSize, filter, sortQuery])

    const fetchBook = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        const res = await callFetchListBook(query)
        if (res && res.data) {
            setListBook(res.data.result)
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const handleSearch = (query) => {
        setFilter(query)
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        console.log(record)
                        setDataViewDetail(record);
                        setOpenViewDetail(true);
                    }}>{record._id}</a>
                )
            },
            sorter: true
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            sorter: true,
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            sorter: true
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: true,
            render: (text, record, index) => {
                return (
                    <>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price)}</>
                )
            }
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
            render: (text, record, index) => {
                return (
                    <>{moment(record.updatedAt).format(FORMAT_DATE_DISPLAY)}</>
                )
            }

        },
        {
            title: 'Action',
            width: '100px',
            render: (text, record, index) => {
                return (
                    <>
                        <span style={{ cursor: "pointer", margin: "0 20px" }}>
                            <DeleteTwoTone twoToneColor="#ff4d4f" />
                        </span>

                        <EditTwoTone
                            twoToneColor="#f57800" style={{ cursor: "pointer" }}
                            onClick={() => {

                            }}
                        />
                    </>
                )
            }

        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, 'f', filters, 's', sorter, 'e', extra);
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`;
            setSortQuery(q);
        }
    };



    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table List Books</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        icon={<ExportOutlined />}
                        type="primary"
                        onClick={() => handleExportData()}
                    >Export</Button>

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                        onClick={() => setOpenModalImport(true)}
                    >Import</Button>

                    <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={() => { setOpenModalCreate(true) }}
                    >Thêm mới</Button>
                    <Button type='ghost' onClick={() => {
                        setFilter("");
                        setSortQuery("")
                    }
                    }
                    >
                        <ReloadOutlined />
                    </Button>
                </span>
            </div>
        )
    }


    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch
                        handleSearch={handleSearch}
                        setFilter={setFilter}
                    />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeader}
                        columns={columns}
                        dataSource={listBook}
                        loading={isLoading}
                        onChange={onChange}
                        rowKey="_id"
                        pagination={
                            {
                                current: current,
                                pageSize: pageSize,
                                showSizeChanger: true,
                                total: total,
                                showTotal: (total, range) => { return (<div>{range[0]}-{range[1]} trên {total} rows</div>) }
                            }
                        }
                    />
                </Col>
            </Row>
            <BookViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />
            <BookModalCreate
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
            />
        </>
    )
}


export default BookTable;
