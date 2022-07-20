import Dots from "@/assets/pictures/dots.png";
import SignInPageIllus from "@/assets/pictures/login-illus-1.png";
import { login } from "@/services/auth.service";
import { getUserOnStream } from "@/services/messenger.service";
import { Checkbox, Divider, Form, Input, message } from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignInPage.scss";

interface SignInPageProps {}

const { Item } = Form;

const SignInPage: FunctionComponent<SignInPageProps> = () => {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(() => {
    if (window.innerWidth < 768) {
      return false;
    }
    return true;
  });
  const [, setReload] = useState(false);
  const [formSignIn] = Form.useForm();

  useEffect(() => {
    if (window.localStorage.getItem("myQueryToken")) {
      return navigate("/", { replace: true });
    }
  }, [navigate]);

  const loginHandler = async (v: any) => {
    const res = await login({
      email: v.username,
      password: v.password,
      registry_by: "email",
    });

    const data = res.data;

    if (res?.status === 400) {
      return message.error(res.data.message);
    }

    if (data.status_code === 1) {
      localStorage.setItem("myQueryToken", data?.data[0]?.access_token);
      localStorage.setItem("userId", data?.data[0]?.user_id);
      message.success("Success!");

      getUserOnStream(v.username)
        .then((response) =>
          localStorage.setItem("chatToken", response.data.chatToken)
        )
        .catch((error) => console.log(error));

      navigate("/", { replace: true });
    }

    if (data.status_code === 1005) {
      message.error('Invalid password!');
    }

    if (data.status_code === 1003) {
      message.error('User is not existed!');
    }
  };

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

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div className="sign-in-page">
      {isDesktop ? (
        <div className="sign-in-page-main">
          {isDesktop ? (
            <div className="sign-in-page-sider">
              <img src={SignInPageIllus} alt="" className="sider-illus" />
              <img src={Dots} alt="" className="dots-1" />
              <img src={Dots} alt="" className="dots-2" />
            </div>
          ) : null}
          <Form
            className="main-form"
            layout={"vertical"}
            labelCol={{ style: { fontWeight: 700 } }}
            form={formSignIn}
            onFinish={loginHandler}
          >
            <b>Welcome</b>
            <Item
              label={"Username"}
              name={"username"}
              style={{ width: "100%", marginBottom: 10 }}
            >
              <Input />
            </Item>
            <Item
              label={"Password"}
              name={"password"}
              style={{ width: "100%", marginBottom: 10 }}
            >
              <Input.Password style={{ borderRadius: 4 }} />
            </Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              style={{ width: "100%", marginBottom: 25 }}
            >
              <Checkbox style={{ marginLeft: 2 }}>Remember me</Checkbox>
            </Form.Item>
            <div
              className="sign-in-btn"
              onClick={() => {
                formSignIn.submit();
              }}
            >
              Sign In
            </div>
            <div className="forgot-password">Forgot your password?</div>
            <Divider />
            <div className="sign-up-navigation">
              <span>New to My Query?</span>
              <span
                className={"sign-up-navigate"}
                onClick={() => {
                  navigate("/sign-up", { replace: true });
                }}
              >
                {" "}
                Sign Up
              </span>
            </div>
          </Form>
        </div>
      ) : (
        <div className="mobile-login">
          <Form
            className="main-form"
            layout={"vertical"}
            labelCol={{ style: { fontWeight: 700 } }}
            form={formSignIn}
            onFinish={loginHandler}
          >
            <b>Welcome</b>
            <Item
              label={"Username"}
              name={"username"}
              style={{ width: "100%", marginBottom: 10 }}
            >
              <Input />
            </Item>
            <Item
              label={"Password"}
              name={"password"}
              style={{ width: "100%", marginBottom: 10 }}
            >
              <Input.Password style={{ borderRadius: 4 }} />
            </Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              style={{ width: "100%", marginBottom: 25 }}
            >
              <Checkbox style={{ marginLeft: 2 }}>Remember me</Checkbox>
            </Form.Item>
            <div
              className="sign-in-btn"
              onClick={() => {
                formSignIn.submit();
              }}
            >
              Sign In
            </div>
            <div className="forgot-password">Forgot your password?</div>
            <Divider />
            <div className="sign-up-navigation">
              <span>New to My Query?</span>
              <span
                className={"sign-up-navigate"}
                onClick={() => {
                  navigate("/sign-up", { replace: true });
                }}
              >
                Sign Up
              </span>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
};

export default SignInPage;
