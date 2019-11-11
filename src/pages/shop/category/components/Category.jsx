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
            {getFieldDecorator('name', {
              initialValue: detail['name'],
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>

          <FormItem label="编号" {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: detail['code'],
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>

          <FormItem label="备注" {...formItemLayout}>
            {getFieldDecorator('remark', {
              initialValue: detail['remark'],
              rules: [
                {
                  required: true,
                  message: '请输入',
                },
              ],
            })(<Input.TextArea placeholder="请输入" />)}
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
