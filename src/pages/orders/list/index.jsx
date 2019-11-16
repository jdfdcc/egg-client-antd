import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Icon,
  Input,
  InputNumber,
  Menu,
  Row,
  Select,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import StandardTable from '@/components/StandardTable';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ loading }) => ({
  loading: loading.models.order,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    result: {}, // 列表数据
    page: {},
  };

  columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      width: '200px',
    },
    {
      title: '商品名称',
      dataIndex: 'shopDetail.name',
      render: (value, record) => {
        return (
          <a
            onClick={() => {
              router.push(`/shop/shops/detail?id=${record.shopDetail._id}`);
            }}
          >
            {value}
          </a>
        );
      },
    },
    {
      title: '用户名称',
      dataIndex: 'userDetail.userName',
    },
    {
      title: '订单金额',
      dataIndex: 'money',
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      render(val) {
        let text = '--';
        switch (val) {
          case 1:
            text = '未支付';
            break;
          case 2:
            text = '已支付';
            break;
          case 3:
            text = '已退款';
            break;
          case 4:
            text = '已取消';
            break;
          case 99:
            text = '其他';
            break;
        }
        return text;
      },
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>退款</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.handleSearch();
  }

  onPageChange = (pagination, filtersArg, sorter) => {
    this.state.page = pagination;
    this.handleSearch();
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'orderList/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e && e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'order/getList',
        payload: {
          ...this.state.page,
          ...fieldsValue,
        },
        success: result => {
          this.setState({
            data: result,
          });
        },
      });
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('orderNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('shopName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户名称">
              {getFieldDecorator('userName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="1">未支付</Option>
                  <Option value="2">已支付</Option>
                  <Option value="3">已退款</Option>
                  <Option value="4">已取消</Option>
                  <Option value="99">其他</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={16} sm={24}>
            <span className={styles.submitButtons}>
              <Button
                onClick={e => {
                  this.state.page.current = 1;
                  this.handleSearch(e);
                }}
                type="primary"
              >
                查询
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading } = this.props;
    const { data } = this.state;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              rowKey="_id"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.onPageChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TableList);
