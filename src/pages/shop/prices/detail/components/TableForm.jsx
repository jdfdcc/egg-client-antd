import { Button, Divider, Input, Popconfirm, Table, message, Card, Row, Col } from 'antd';
import React, { Fragment, PureComponent } from 'react';
import styles from '../style.less';
import PriceModal from './PriceModal';
import { uuid } from '@/utils/tools';

const timeMap = {
  m: '月',
  d: '天',
  y: '年',
  w: '周',
};
function money(value) {
  return `${Number(value).toFixed(2)}元`;
}
class TableForm extends PureComponent {
  columns = [
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: value => `${money(value)}`,
    },
    {
      title: '原价',
      dataIndex: 'oldPrice',
      render: value => `${money(value)}`,
    },
    {
      title: '时间',
      dataIndex: 'time',
      render: (val, record) => `${val}${timeMap[record.unit]}`,
    },
    {
      title: '排序',
      dataIndex: 'sort',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => this.toggleEditable(record)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
      visible: false,
      value: props.value,
      detail: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (value && Array.isArray(value) && value.length > 0) {
      this.setState({
        data: value,
      });
    }
  }

  getRowByKey(key, newData) {
    const { data = [] } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  remove(item) {
    const { data } = this.state;
    const { onChange } = this.props;
    const tempData = data.filter(tempItem => {
      return item.uuid !== tempItem.uuid;
    });
    this.setState({
      data: tempData,
    });
    onChange && onChange(tempData);
  }

  toggleEditable = (item = {}) => {
    this.setState({
      visible: true,
      detail: item,
    });
  };

  addItem = item => {
    console.log('item', item);
    let { data = [] } = this.state;
    const { onChange } = this.props;
    if (item.uuid) {
      data = data.map(tempItem => {
        if (tempItem.uuid === item.uuid) {
          return item;
        }
        return tempItem;
      });
    } else {
      item.uuid = uuid();
      data.push(item);
    }

    console.log('data---', data);
    this.setState({
      data,
      visible: false,
    });
    onChange && onChange(data);
  };

  render() {
    const { loading, data, visible, detail } = this.state;
    return [
      <Card
        key="1"
        bordered={false}
        title="规则配置"
        extra={
          <Button onClick={() => this.toggleEditable()} type="primary" icon="plus">
            新增
          </Button>
        }
      >
        <Table
          rowKey="uuid"
          loading={loading}
          columns={this.columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
      </Card>,
      <PriceModal
        onChange={this.addItem}
        onCancel={() => this.setState({ visible: false })}
        title="规则详情"
        visible={visible}
        value={detail}
        key="2"
      />,
    ];
  }
}

export default TableForm;
