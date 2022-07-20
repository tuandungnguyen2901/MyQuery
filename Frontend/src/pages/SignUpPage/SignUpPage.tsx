import Dots from '@/assets/pictures/dots.png';
import SignInPageIllus from '@/assets/pictures/login-illus-1.png';
import { login, signUp } from '@/services/auth.service';
import { validateEmail } from '@/utils/utils';
import { Checkbox, Divider, Form, Input, message } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/const/routePaths';
import './SignUpPage.scss';
import { createWallet } from '@/services/wallet.service';

interface SignUpPageProps {}

const { Item } = Form;

const SignUpPage: FunctionComponent<SignUpPageProps> = () => {
  const navigate = useNavigate();
  const [validatorType, setValidatorType] = useState('onSubmit');
  const [formSignUp] = Form.useForm();
  const [isDesktop, setIsDesktop] = useState(() => {
    if (window.innerWidth < 768) {
      return false;
    }
    return true;
  });
  const [, setReload] = useState(false);
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    if (windowSize.innerWidth < 768) {
      setReload((prev) => !prev);
      setIsDesktop(false);
    } else {
      setIsDesktop(true);
    }
  }, [windowSize]);

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const handleSignUp = async (v: any) => {
    const body = { email: v.email, password: v.password, registry_by: 'email' };
    const res = await signUp(body);

    if (res.data?.status_code === 1) {
      // const data = res?.data?.data[0];
      //store user ID, token into local storage
      handleSignIn({ username: v.email, password: v.password });
    }
    if (res?.data?.status_code === 1004) {
      message.error('Username has already been used.');
    }
  };

  const handleSignIn = async (v: any) => {
    const res = await login({
      email: v.username,
      password: v.password,
      registry_by: 'email',
    });

    const data = res.data;

    if (res?.status === 400) {
      return message.error(res.data.message);
    }

    if (data.status_code === 1) {
      localStorage.setItem('myQueryToken', data?.data[0]?.access_token);
      localStorage.setItem('userId', data?.data[0]?.user_id);

      message.success('Success!');
      navigate(routePaths.COMPLETE_PROFILE, { replace: true });
    }
  };

  return (
    <div className='sign-up-page'>
      {isDesktop ? (
        <div className='sign-up-page-main'>
          {isDesktop ? (
            <div className='sign-up-page-sider'>
              <img src={SignInPageIllus} alt='' className='sider-illus' />
              <img src={Dots} alt='' className='dots-1' />
              <img src={Dots} alt='' className='dots-2' />
            </div>
          ) : null}
          <Form
            className='main-form'
            layout={'vertical'}
            labelCol={{ style: { fontWeight: 700 } }}
            onFinish={handleSignUp}
            form={formSignUp}
          >
            <b>Welcome</b>
            <Item
              label={'Email'}
              name={'email'}
              style={{ width: '100%', marginBottom: 10 }}
              validateTrigger={validatorType}
              rules={[
                { required: true, message: 'This field is required.' },
                {
                  validator: (_, v) => {
                    setValidatorType('onChange');
                    if (!validateEmail(v)) {
                      return Promise.reject(
                        new Error('Invalid email address!')
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
            </Item>
            <Item
              label={'Password'}
              name={'password'}
              style={{ width: '100%', marginBottom: 10 }}
              rules={[{ required: true, message: 'This field is required.' }]}
            >
              <Input.Password style={{ borderRadius: 4 }} />
            </Item>
            <Item
              label={'Confirm Password'}
              name={'confirmPassword'}
              style={{ width: '100%', marginBottom: 10 }}
              validateTrigger={validatorType}
              rules={[
                {
                  validator: (_, v) => {
                    setValidatorType('onChange');
                    if (v !== formSignUp.getFieldValue('password')) {
                      return Promise.reject(
                        new Error('Please make sure your password match!')
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password style={{ borderRadius: 4 }} />
            </Item>

            <Form.Item
              name='confirmToTerm'
              valuePropName='checked'
              style={{ width: '100%', marginBottom: 25 }}
              rules={[
                {
                  validator: (_, v) => {
                    if (!v) {
                      return Promise.reject(
                        new Error('You have to agree to our Term and Privacy')
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Checkbox style={{ marginLeft: 2 }}>
                I have read and agree to the Privacy Policy
              </Checkbox>
            </Form.Item>

            <div className='sign-up-btn' onClick={() => formSignUp.submit()}>
              Sign Up
            </div>

            <Divider />
            <div className='sign-up-navigation'>
              <span>Already have account?</span>
              <span
                className={'sign-up-navigate'}
                onClick={() => {
                  navigate(routePaths.SIGN_IN_PAGE, { replace: true });
                }}
              >
                Sign In
              </span>
            </div>
          </Form>
        </div>
      ) : (
        <div className='mobile-login'>
          <Form
            className='main-form'
            layout={'vertical'}
            labelCol={{ style: { fontWeight: 700 } }}
            onFinish={handleSignUp}
            form={formSignUp}
          >
            <b>Welcome</b>
            <Item
              label={'Username'}
              name={'username'}
              style={{ width: '100%', marginBottom: 10 }}
            >
              <Input />
            </Item>
            <Item
              label={'Password'}
              name={'password'}
              style={{ width: '100%', marginBottom: 10 }}
            >
              <Input.Password style={{ borderRadius: 4 }} />
            </Item>
            <Item
              label={'Confirm Password'}
              name={'confirmPassword'}
              style={{ width: '100%', marginBottom: 10 }}
            >
              <Input.Password style={{ borderRadius: 4 }} />
            </Item>

            <Form.Item
              name='confirmToTerm'
              valuePropName='checked'
              style={{ width: '100%', marginBottom: 25 }}
            >
              <Checkbox style={{ marginLeft: 2 }}>
                I have read and agree to the Privacy Policy
              </Checkbox>
            </Form.Item>

            <div className='sign-up-btn' onClick={() => formSignUp.submit()}>
              Sign Up
            </div>

            <Divider />
            <div className='sign-up-navigation'>
              <span>Already have account?</span>
              <span
                className={'sign-up-navigate'}
                onClick={() => {
                  navigate(routePaths.SIGN_IN_PAGE, { replace: true });
                }}
              >
                Sign In
              </span>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
