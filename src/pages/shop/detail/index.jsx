import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Icon,
  Input,
  Popover,
  Row,
  Select,
  InputNumber,
  TimePicker,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Editor from '@/components/Editor';
import TableForm from './components/TableForm';
import FooterToolbar from './components/FooterToolbar';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const fieldLabels = {
  name: '商品名称',
  mainImage: '商品主图(url地址)',
  desc: '商品描述',
  detail: '商品详情',
  price: '商品价格',
  type: '商品类型',
  remark: '商品备注',
};

@connect(({ loading }) => ({
  submitting: loading.effects['formAndadvancedForm/submitAdvancedForm'],
}))
class AdvancedForm extends Component {
  state = {
    width: '100%',
    detail: {}, // 商品详情
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, {
      passive: true,
    });
    this.resizeFooterToolbar();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }

      const errorMessage = errors[key] || [];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errorMessage[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }

            return trigger;
          }}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];

      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;

        if (stateWidth !== width) {
          this.setState({
            width,
          });
        }
      }
    });
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        console.log(values);
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
    } = this.props;
    const { width, detail } = this.state;
    return (
      <>
        <PageHeaderWrapper>
          <Card title="商品基本信息" className={styles.card} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.name}>
                    {getFieldDecorator('name', {
                      initialValue: detail['name'],
                      rules: [
                        {
                          required: true,
                          message: '请输入',
                        },
                      ],
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.price}>
                    {getFieldDecorator('price', {
                      initialValue: detail['price'],
                      rules: [
                        {
                          required: true,
                          message: '请输入',
                        },
                      ],
                    })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.mainImage}>
                    {getFieldDecorator('mainImage', {
                      initialValue: detail['mainImage'],
                      rules: [
                        {
                          required: true,
                          message: '请输入',
                        },
                      ],
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
                <Col lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.type}>
                    {getFieldDecorator('type', {
                      initialValue: detail['type'] || '1',
                      rules: [
                        {
                          required: true,
                          message: '请选择商品类型',
                        },
                      ],
                    })(
                      <Select placeholder="请选择商品类型">
                        <Option value="1">虚拟产品</Option>
                      </Select>,
                    )}
                  </Form.Item>
                </Col>

                <Col lg={12} md={12} sm={24}>
                  <Form.Item label={fieldLabels.desc}>
                    {getFieldDecorator('desc', {
                      initialValue: detail['desc'],
                      rules: [
                        {
                          required: true,
                          message: '请输入',
                        },
                      ],
                    })(<Input.TextArea style={{ minHeight: 130 }} placeholder="请输入" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Card title="商品详情（富文本编辑）">
              {getFieldDecorator('detail', {
                initialValue: detail['detail'],
              })(<Editor />)}
            </Card>
          </Card>
        </PageHeaderWrapper>

        <div style={{ height: 100 }} />
        <FooterToolbar
          style={{
            width,
          }}
        >
          {/* {this.getErrorInfo()} */}
          <Button type="primary" onClick={this.validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </>
    );
  }
}

export default Form.create()(AdvancedForm);
