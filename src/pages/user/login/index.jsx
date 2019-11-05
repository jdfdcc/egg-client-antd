import { Alert, Checkbox, Icon } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import LoginComponents from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginComponents;

@connect(({ userAndlogin, loading }) => ({
  userAndlogin,
  submitting: loading.effects['userAndlogin/login'],
}))
class Login extends Component {
  loginForm = undefined;

  state = {
    type: 'account',
    autoLogin: true,
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;

    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'userAndlogin/login',
        payload: { ...values, type },
      });
    }
  };

  renderMessage = content => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  render() {
    const { userAndlogin, submitting } = this.props;
    const { status, type: loginType } = userAndlogin;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab
            key="account"
            tab={formatMessage({
              id: 'userandlogin.login.tab-login-credentials',
            })}
          >
            {status === 'error' &&
              loginType === 'account' &&
              !submitting &&
              this.renderMessage(
                formatMessage({
                  id: 'userandlogin.login.message-invalid-credentials',
                }),
              )}
            <UserName
              name="userName"
              placeholder={`${formatMessage({
                id: 'userandlogin.login.userName',
              })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'userandlogin.userName.required',
                  }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({
                id: 'userandlogin.login.password',
              })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({
                    id: 'userandlogin.password.required',
                  }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
          </Tab>
          <Submit loading={submitting}>
            <FormattedMessage id="userandlogin.login.login" />
          </Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;
