import { Card, Form, Input, Checkbox, Button, message } from 'antd'
import logo from '@/assets/logo.png'
import './index.scss'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'
function Login() {
  const { loginStore } = useStore()
  const navigate = useNavigate()
  const onFinish = async (values) => {
    // values: 所有表单项输入的内容
    try {
      await loginStore.login({
        mobile: values.username,
        code: values.password,
      })
      navigate('/', { replace: true })
      message.success('登录成功')
    } catch (e) {
      message.error(e.response?.data?.message || '登录失败')
    }
  }
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{
            remember: true,
            username: '15116029516',
            password: '246810',
          }}
          onFinish={onFinish}>
          <Form.Item
            label="手机号"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入手机号',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号码格式不对',
                // 触发时机：失去焦点
                validateTrigger: 'onBlur',
              },
            ]}>
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
              { len: 6, message: '请输入6位密码', validateTrigger: 'onBlur' },
            ]}>
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item name="remember" valuePropName="checked">
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
