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
  Popconfirm,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import StandardTable from '@/components/StandardTable';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ loading }) => ({
  loading: loading.models.common,
}))
class TableList extends Component {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    result: {
      pagination: {
        current: 1,
      },
    }, // 查询返回的服务器数据
  };

  columns = [
    {
      title: '商品编号',
      dataIndex: 'shopNo',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '商品主图',
      dataIndex: 'mainImage',
      render: value => <img src={value} style={{ height: 50 }} alt="error" />,
    },
    // {
    //   title: '商品价格',
    //   dataIndex: 'price',
    //   render: value => `${value}元`
    // },
    {
      title: '商品描述',
      dataIndex: 'desc',
    },
    {
      title: '商品状态',
      dataIndex: 'onLine',
      render: value => {
        return value === 0 ? '停售' : '在售';
      },
    },
    {
      title: '商品备注',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.toShopDetail(record._id)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => this.delete(record._id, { onLine: +record.onLine === 0 ? 1 : 0 })}>
            {+record.onLine === 0 ? '开售' : '停售'}
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="是否删除当前产品"
            onConfirm={() => {
              this.delete(record._id);
            }}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: 'red' }} href="#">
              删除
            </a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    this.handleSearch();
  }

  onPageChange = pagination => {
    this.state.result.pagination = {
      pageSize: pagination.pageSize,
      current: pagination.current,
    };
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
    const { result } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      values.name && (values.name = `/.*${values.name}.*/`);
      dispatch({
        type: 'common/getList',
        payload: {
          _model: 'Shop',
          query: {
            pageSize: 10,
            current: 1,
            ...result.pagination,
            ...values,
          },
          filters: this.columns.map(item => item.dataIndex).filter(item => item),
        },
        success: result => {
          console.log('成功的数据', result);
          this.setState({
            result,
          });
        },
      });
    });
  };

  toShopDetail = id => {
    if (id) {
      router.push(`/shop/shops/detail?id=${id}`);
    } else {
      router.push('/shop/shops/detail');
    }
  };

  delete = (id, params = { status: 0 }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/save',
      payload: {
        _model: 'Shop',
        _id: id,
        ...params,
      },
      success: result => {
        this.state.result.pagination.current = 1;
        this.handleSearch();
      },
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form
        onSubmit={e => {
          this.state.result.pagination.current = 1;
          this.handleSearch(e);
        }}
        layout="inline"
      >
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
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
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
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
              <Button
                style={{
                  marginLeft: 8,
                }}
                icon="plus"
                type="primary"
                onClick={() => this.toShopDetail()}
              >
                新建
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(
                <InputNumber
                  style={{
                    width: '100%',
                  }}
                />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入更新日期"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select
                  placeholder="请选择"
                  style={{
                    width: '100%',
                  }}
                >
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div
          style={{
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              float: 'right',
              marginBottom: 24,
            }}
          >
            <Button type="primary" htmlType="submit">
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
            <a
              style={{
                marginLeft: 8,
              }}
              onClick={this.toggleForm}
            >
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { loading } = this.props;
    const { result } = this.state;
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
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              rowKey="_id"
              selectedRows={selectedRows}
              loading={loading}
              data={result}
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
