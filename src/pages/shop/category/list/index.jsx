import { Badge, Button, Card, Col, Divider, Form, Input, Row, Select, Popconfirm } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import router from 'umi/router';
import StandardTable from '@/components/StandardTable';
import CategoryModal from '../components/Category';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const _model = 'Category';

@connect(({ loading }) => ({
  loading: loading.models.common,
}))
class Index extends Component {
  state = {
    modalVisible: true,
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
      title: '编号',
      dataIndex: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.toEdit(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="是否删除当前价格配置"
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
          _model: _model,
          query: {
            pageSize: 10,
            current: 1,
            ...result.pagination,
            ...values,
          },
          filters: ['desc', 'name', 'code', 'remark', 'sort'],
        },
        success: result => {
          this.setState({
            result,
          });
        },
      });
    });
  };

  toEdit = record => {
    this.setState({
      detail: record,
      visible: true,
    });
  };

  delete = (id, params = { status: 0 }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/save',
      payload: {
        _model: _model,
        _id: id,
        ...params,
      },
      success: result => {
        this.state.result.pagination.current = 1;
        this.handleSearch();
      },
    });
  };

  addItem = detail => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/save',
      payload: {
        _model: _model,
        ...detail,
      },
      success: result => {
        this.state.result.pagination.current = 1;
        this.handleSearch();
        this.setState({
          visible: false,
        });
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
          <Col md={12} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input style={{ width: '100%' }} placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
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
                onClick={() => {
                  this.setState({
                    visible: true,
                  });
                }}
              >
                新建
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { loading } = this.props;
    const { result, visible, detail } = this.state;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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

          <CategoryModal
            title="新增类目"
            visible={visible}
            value={detail}
            onChange={this.addItem}
            onCancel={() => {
              this.setState({
                visible: false,
              });
            }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(Index);
