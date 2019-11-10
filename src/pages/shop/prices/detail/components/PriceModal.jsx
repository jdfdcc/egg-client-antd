import React, { PureComponent } from 'react';
import { Form, Modal, Input, InputNumber, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value, visible } = nextProps;
    if (value && visible) {
      this.setState({
        detail: value,
      });
    }
  }

  save = () => {
    const { detail } = this.state;
    const { form, onChange } = this.props;
    const { validateFields } = form;
    validateFields((errors, values) => {
      if (!errors) {
        onChange && onChange({ ...detail, ...values });
      }
    });
  };

  render() {
    const { detail = {} } = this.state;
    const { visible, form, ...otherProps } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };
    return (
      <Modal destroyOnClose {...otherProps} visible={visible} onOk={this.save}>
        <Form>
          <FormItem label="描述" {...formItemLayout}>
            {getFieldDecorator('desc', {
              initialValue: detail['desc'],
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="价格" {...formItemLayout}>
            {getFieldDecorator('price', {
              initialValue: detail['price'],
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(<InputNumber precision={2} style={{ width: '100%' }} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="原价" {...formItemLayout}>
            {getFieldDecorator('oldPrice', {
              initialValue: detail['oldPrice'],
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(<InputNumber precision={2} style={{ width: '100%' }} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="时间" {...formItemLayout}>
            {getFieldDecorator('time', {
              initialValue: detail['time'],
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(<InputNumber precision={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="时间单位" {...formItemLayout}>
            {getFieldDecorator('unit', {
              initialValue: detail['unit'] || 'm',
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(
              <Select placeholder="请输入">
                <Option value="d">天</Option>
                <Option value="w">周</Option>
                <Option value="m">月</Option>
                <Option value="y">年</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem label="排序" {...formItemLayout}>
            {getFieldDecorator('sort', {
              initialValue: detail['sort'],
            })(<InputNumber precision={0} style={{ width: '100%' }} placeholder="请输入" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(Index);
