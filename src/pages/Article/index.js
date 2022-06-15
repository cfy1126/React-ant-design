import { Link, useNavigate } from 'react-router-dom'
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Select,
  Table,
  Tag,
  Space,
  Popconfirm,
} from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import img404 from '@/assets/error.png'
import { useEffect, useState } from 'react'
import { http } from '@/utils'
import {useStore} from '@/store'
import {observer} from 'mobx-react-lite'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const {channelStore} = useStore()
  // 文章列表管理
  const [list, setList] = useState({
    list: [], //文章列表
    count: 0, //文章数量
  })

  // 文章参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 3,
  })

  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/mp/articles', { params })
      setList({
        list: res.data.results,
        count: res.data.total_count,
      })
    }
    loadList()
  }, [params])
  const onFinish = (values) => {
    console.log(values)
    const { channel_id, date, status } = values
    const _params = {}
    if (status !== -1) {
      _params.status = status
    }
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    setParams({
      ...params,
      ..._params,
    })
  }
  const pageChange = (page) => {
    setParams({
      ...params,
      page,
    })
  }

  // 删除
  const handleDelete = async (_, record) => {
    await http.delete(`/mp/articles/${record.id}`)
    setParams({
      ...params,
      page: 1,
    })
  }
  // 编辑
  const navigate = useNavigate()
  const goPublish = (record) => {
    navigate(`/publish?id=${record.id}`)
  }
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: (cover) => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (data) => <Tag color="green">审核通过</Tag>,
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate',
    },
    {
      title: '阅读数',
      dataIndex: 'read_count',
    },
    {
      title: '评论数',
      dataIndex: 'comment_count',
    },
    {
      title: '点赞数',
      dataIndex: 'like_count',
    },
    {
      title: '操作',
      render: (_, record) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => goPublish(record)}
            />
            <Popconfirm
              title="确定删除?"
              onConfirm={() => handleDelete(_, record)}>
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
            {/* <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => delArticle(data)}
            /> */}
          </Space>
        )
      },
    },
  ]
  return (
    <div>
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}>
        <Form initialValues={{ status: -1 }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select placeholder="请选择文章频道" style={{ width: 120 }}>
              {channelStore.channelList.map((item) => (
                <Option value={item.name} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title={`根据筛选条件共查询到 ${list.count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list.list}
          pagination={{
            pageSize: params.per_page,
            total: list.count,
            onChange: pageChange,
          }}
        />
      </Card>
    </div>
  )
}

export default observer(Article)
