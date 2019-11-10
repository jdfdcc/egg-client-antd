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
  message,
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
  name: '名称',
  code: '编号',
  remark: '备注',
};
const _model = 'Price';
@connect(({ loading }) => ({
  submitting: loading.effects[('common/queryOne', 'common/save')],
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
    this.getShopDetail();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  /**
   * 获取商品详情
   */
  getShopDetail = () => {
    const { id } = this.props.location.query;
    if (id) {
      this.props.dispatch({
        type: 'common/queryOne',
        payload: {
          _model: _model,
          params: {
            _id: id,
          },
        },
        success: data => {
          this.setState({
            detail: data,
          });
        },
      });
    }
  };

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

  save = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (error) {
        console.log(error);
      } else {
        dispatch({
          type: 'common/save',
          payload: {
            _model: _model,
            ...this.state.detail,
            ...values,
          },
          success: () => {
            message.success('保存成功');
            window.history.back();
          },
        });
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
            <Form layout="vertical">
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
                  <Form.Item label={fieldLabels.code}>
                    {getFieldDecorator('code', {
                      initialValue: detail['code'],
                      rules: [
                        {
                          required: true,
                          message: '请输入',
                        },
                      ],
                    })(<Input placeholder="请输入" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item label={fieldLabels.remark}>
                    {getFieldDecorator('remark', {
                      initialValue: detail['remark'],
                    })(<Input.TextArea style={{ minHeight: 130 }} placeholder="请输入" />)}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <div title="规则管理">
            {getFieldDecorator('items', {
              initialValue: detail['items'],
            })(<TableForm />)}
          </div>
        </PageHeaderWrapper>

        <div style={{ height: 100 }} />
        <FooterToolbar
          style={{
            width,
          }}
        >
          {/* {this.getErrorInfo()} */}
          <Button type="ghost" onClick={() => window.history.back()} loading={submitting}>
            返回
          </Button>

          <Button type="primary" onClick={this.save} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </>
    );
  }
}

export default Form.create()(AdvancedForm);
