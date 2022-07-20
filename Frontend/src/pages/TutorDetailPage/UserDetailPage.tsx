import CategoryTag from '@/components/CategoryTag/CategoryTag';
import PayPal from '@/components/PayPalButton/PayPalButton';
import UpdateProfile from '@/components/UpdateProfile/UpdateProfile';
import { updateUser } from '@/services/auth.service';
import {
  addTagsToInstructor,
  getUserById,
  updateTutor,
} from '@/services/tutor.service';
import {
  getUserBalance,
  increaseMoney,
  withdrawMoney,
} from '@/services/wallet.service';
import { EditOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Skeleton,
} from 'antd';
import moment from 'moment';
import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './UserDetailPage.scss';

interface UserDetailPageProps {}

const { Item } = Form;

const UserDetailPage: FunctionComponent<UserDetailPageProps> = () => {
  const location = useLocation();
  const [deposit, setDeposit] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (window.innerWidth < 768) {
      return false;
    }
    return true;
  });
  const [, setReload] = useState(false);
  const [formRent] = Form.useForm();
  const [rentingMethod, setRentingMethod] = useState();
  // const checkRole = usePermission();
  const [balance, setBalance] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [user, setUser] = useState<any>();
  const [formUpdate] = Form.useForm();
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
  const tranSuccess = async (payment: any) => {
    const res = await increaseMoney(
      { amount: deposit },
      localStorage.getItem('myQueryToken') as string
    );

    setBalance(res?.data?.balance);
  };
  const [loading, setLoading] = useState(false);

  const getBalance = async () => {
    const res = await getUserBalance(
      localStorage.getItem('myQueryToken') as string
    );
    console.log(res);
    if (res?.status === 200) {
      setBalance(res?.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUser();
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    const res = await getUserById(location.pathname.split('/')[1]);

    if (res?.data?.status_code === 1) {
      const data = res?.data?.data[0];
      console.log(data);
      setUser(data);
    }
  };

  useEffect(() => {
    if (windowSize.innerWidth < 994) {
      setIsDesktop(false);
    } else {
      setIsDesktop(true);
      setReload((prev) => !prev);
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    formRent.submit();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUpdateModalOk = (v: any) => {
    formUpdate.submit();
  };

  const handleUpdateModalCancel = () => {
    setIsUpdateModalVisible(false);
  };

  const handleFormRentFinish = (v: any) => {
    console.log(v);
  };

  const handleRentingMethodChange = (v: any) => {
    setRentingMethod(v);
  };

  const handleDepositOk = () => {
    setIsDepositModalVisible(false);
  };

  const handleDepositCancel = () => {
    setIsDepositModalVisible(false);
  };

  const handleWithdrawOk = () => {
    setIsWithdrawModalVisible(false);
  };

  const handleWithdrawCancel = () => {
    setIsWithdrawModalVisible(false);
  };

  const handleWithdraw = async () => {
    if (!deposit) {
      message.warning('Please input withdraw');
      return;
    }
    try {
      const res = await withdrawMoney(
        { amount: deposit },
        localStorage.getItem('myQueryToken') as string
      );
      handleWithdrawCancel();
      if (res?.status === 400) {
        console.log('erorr');
      }
      setBalance(res?.data?.balance);
    } catch (error: any) {
      message.error(error?.response?.data?.msg);
    }
  };

  const handleUserUpdate = async (v: any) => {
    console.log(v);
    const body = {
      first_name: v.first_name,
      last_name: v.last_name,
      phone: v.phone,
      avatar: v?.pictureProfile,
      dob: String(v.dob.unix()),
      gender: v.gender,
      location: v?.location,
      job_title: v?.job,
      description: v?.description,
    };

    const res = await updateUser(
      body,
      localStorage.getItem('myQueryToken') as string
    );

    if (res?.data?.status_code === 1) {
      fetchUser();
    }
    console.log(v?.tag);
    addTagsToInstructor(
      [...v?.tagDropDown],
      localStorage.getItem('myQueryToken') as string
    ).then(() => {
      if (user?.account_type === 'Instructor') {
        const data = {
          hour_price: 0,
          lesson_price: 0,
          rate: 0,
        };
        updateTutor(data, localStorage.getItem('myQueryToken') as string).then(
          () => {
            return handleUpdateModalCancel();
          }
        );
      }

      handleUpdateModalCancel();
    });
  };

  return (
    <Row className='user-detail-page' gutter={[10, 10]}>
      <Modal
        title='RENT TUTOR'
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form
          labelCol={{ span: 7 }}
          labelAlign={'left'}
          wrapperCol={{ span: 17 }}
          form={formRent}
          initialValues={{ tutor: 'Ana' }}
          onFinish={handleFormRentFinish}
        >
          <Item label={'Tutor'} name={'tutor'}>
            <Input disabled></Input>
          </Item>
          <Item label={'Renting method'} name={'rentingMethod'}>
            <Select
              onChange={handleRentingMethodChange}
              placeholder={'Select renting method'}
            >
              <Select.Option value='hour-call'>
                <span>Hour Call</span>
              </Select.Option>
              <Select.Option value='lesson'>
                <span>Lesson</span>
              </Select.Option>
            </Select>
          </Item>
          {rentingMethod === 'hour-call' ? (
            <Item label={'Price'} name={'priceByHour'}>
              <Input disabled></Input>
            </Item>
          ) : null}
          {rentingMethod === 'lesson' ? (
            <Item label={'Price'} name={'priceByLesson'}>
              <Input disabled></Input>
            </Item>
          ) : null}
          <Item label={'Message'} name={'message'}>
            <Input.TextArea></Input.TextArea>
          </Item>
        </Form>
      </Modal>
      <Modal
        title='UPDATE PROFILE'
        visible={isUpdateModalVisible}
        onOk={handleUpdateModalOk}
        onCancel={handleUpdateModalCancel}
        destroyOnClose
      >
        <Form
          form={formUpdate}
          onFinish={handleUserUpdate}
          layout={'vertical'}
          labelCol={{ style: { fontWeight: 700 } }}
          initialValues={{
            firstName: user?.first_name,
            lastName: user?.last_name,
            dob: moment(user?.dob),
            phoneNumber: user?.phone,
            gender: user?.gender,
            pictureProfile: user?.avatar,
            location: user?.location,
            tagDropDown: user?.tags,
            description: user?.description,
            job: user?.job_title,
          }}
        >
          <UpdateProfile form={formUpdate} />
        </Form>
      </Modal>
      <Col className='user-detail-page-main' lg={{ span: 18 }}>
        <div className='card basic-user-info' style={{ padding: 0 }}>
          <img src={user?.avatar} alt='' />
          <div className='basic-info-content'>
            <b className='name' style={{ fontSize: 23 }}>
              {`${user?.last_name} ${user?.first_name}`}{' '}
            </b>
            <span className='job'>{user?.job_title}</span>
            <div className='location'>
              {user?.location && <Icon icon='akar-icons:location' />}
              {user?.location && <span>Hanoi, Vietnam</span>}
            </div>
            {user?.account_type === 'Instructor' ? (
              <div className='rate'>
                <b>Rate:</b>
                {user?.rate ? (
                  <span>{user?.rate}/10</span>
                ) : (
                  <span style={{ marginLeft: 8 }}>Unrated</span>
                )}
              </div>
            ) : null}
            <div className='tag-field'>
              {user?.tags?.map((tag: any) => (
                <CategoryTag tagName={tag} key={tag} />
              ))}
            </div>
          </div>
        </div>

        {isDesktop === false ? (
          location.pathname.split('/')[1] === localStorage.getItem('userId') ? (
            <div className='card' onClick={() => setIsUpdateModalVisible(true)}>
              <b className='title'>
                Update Profile <EditOutlined />
              </b>
            </div>
          ) : null
        ) : null}
        {isDesktop || user?._accountType !== 'Instructor' ? null : (
          <>
            <div className='card rent-mobile'>
              <b className='title'>Tutor rental</b>
              <div className='btn-field'>
                <div className='btn rent-btn' onClick={showModal}>
                  Rent
                </div>
                <div className='btn chat-btn'>
                  <Icon
                    icon='bxs:message'
                    style={{ transform: 'translateY(1px)' }}
                  />
                  Chat
                </div>
              </div>
            </div>
          </>
        )}
        {isDesktop === false ? (
          location.pathname.split('/')[1] === localStorage.getItem('userId') ? (
            <div className='card'>
              <b className='title'>Wallet</b>
              {loading ? (
                <Skeleton />
              ) : (
                <div className='wallet-balance'>
                  {balance} <span>VNĐ</span>
                </div>
              )}
              <div className='wallet-deposit-mobile'>
                <div
                  className='wallet-deposit-item'
                  onClick={() => {
                    setIsDepositModalVisible(true);
                  }}
                >
                  Deposit
                </div>
                <Divider type='vertical' style={{ height: 30, margin: 0 }} />
                <div
                  className='wallet-deposit-item'
                  onClick={() => setIsWithdrawModalVisible(true)}
                >
                  Withdraw
                </div>
              </div>
              <Modal
                title='Deposit'
                visible={isDepositModalVisible}
                onOk={handleDepositOk}
                onCancel={handleDepositCancel}
                footer={null}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                destroyOnClose
              >
                <InputNumber
                  addonAfter='VNĐ'
                  placeholder='Deposit amount'
                  style={{ marginBottom: 20, width: '100%' }}
                  onChange={(v: any) => {
                    setDeposit(v);
                  }}
                />
                <PayPal total={deposit} tranSuccess={tranSuccess} />
              </Modal>
            </div>
          ) : null
        ) : null}

        <Modal
          title='Withdraw'
          visible={isWithdrawModalVisible}
          onOk={handleWithdrawOk}
          onCancel={handleWithdrawCancel}
          footer={null}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          destroyOnClose
        >
          <InputNumber
            addonAfter='VNĐ'
            placeholder='Withdraw amount'
            style={{ marginBottom: 20, width: '100%' }}
            onChange={(v: any) => {
              setDeposit(v);
            }}
          />
          <div
            onClick={() => {
              console.log('first');
              handleWithdraw();
            }}
            className={'withdraw-btn'}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            Withdraw
          </div>
        </Modal>
        <div className='card highlights'>
          <b className='title'>Highlights</b>
          <div className='highlights-content'>
            <div className='highlights-content-item'>
              <span className='item-number'>43</span>
              <span className='item-type'>Student trained</span>
            </div>
            <Divider
              type='vertical'
              style={{ height: 80, borderColor: '#b5b5b5' }}
            />
            <div className='highlights-content-item'>
              <span className='item-number'>423</span>
              <span className='item-type'>Reviews received</span>
            </div>
          </div>
        </div>

        <div className='card about'>
          <b className='title'>About me</b>
          <div className='about-content'>{user?.description}</div>
        </div>
        {user?.account_type === 'Instructor' ? (
          <div className='card feedbacks'>
            <b className='title'>Feedback</b>
            <div className='feedbacks-content'></div>
          </div>
        ) : null}

        {isDesktop === false ? (
          location.pathname.split('/')[1] ===
          localStorage.getItem('userId') ? null : (
            <div className='card'>
              <b className='title'>People also visit tutors</b>
            </div>
          )
        ) : null}
      </Col>
      {isDesktop ? (
        <Col className='tutor-detail-page-sider' lg={{ span: 6 }}>
          {location.pathname.split('/')[1] ===
          localStorage.getItem('userId') ? (
            <div className='card' onClick={() => setIsUpdateModalVisible(true)}>
              <b className='title'>
                Update Profile <EditOutlined />
              </b>
            </div>
          ) : null}
          {location.pathname.split('/')[1] === localStorage.getItem('userId') ||
          user?.account_type === 'Learner' ? null : (
            <div className='card'>
              <b className='title'>Tutor rental</b>
              <div className='btn-field'>
                <div className='btn rent-btn' onClick={showModal}>
                  Rent
                </div>
                <div className='btn chat-btn'>
                  <Icon
                    icon='bxs:message'
                    style={{ transform: 'translateY(1px)' }}
                  />
                  Chat
                </div>
              </div>
            </div>
          )}
          {location.pathname.split('/')[1] ===
          localStorage.getItem('userId') ? (
            <div className='card'>
              <b className='title'>Wallet</b>
              <div className='wallet-balance'>
                {balance} <span>VNĐ</span>
              </div>
              <div className='wallet-deposit'>
                <div
                  className='wallet-deposit-item'
                  onClick={() => {
                    setIsDepositModalVisible(true);
                  }}
                >
                  Deposit
                </div>
                <Divider type='vertical' style={{ height: 30, margin: 0 }} />
                <div
                  className='wallet-deposit-item'
                  onClick={() => {
                    console.log('click');
                    setIsWithdrawModalVisible(true);
                  }}
                >
                  Withdraw
                </div>
              </div>
              <Modal
                title='Deposit'
                visible={isDepositModalVisible}
                onOk={handleDepositOk}
                onCancel={handleDepositCancel}
                footer={null}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                destroyOnClose
              >
                <InputNumber
                  addonAfter='VNĐ'
                  placeholder='Deposit amount'
                  style={{ marginBottom: 20, width: '100%' }}
                  onChange={(v: any) => {
                    setDeposit(v);
                  }}
                />
                <PayPal total={deposit} tranSuccess={tranSuccess} />
              </Modal>
            </div>
          ) : null}
          {location.pathname.split('/')[1] === localStorage.getItem('userId') ||
          user?.account_type === 'Instructor' ? null : (
            <div className='card'>
              <b className='title'>Contact</b>
              <div className='btn-field'>
                <div className='btn chat-btn'>
                  <Icon
                    icon='bxs:message'
                    style={{ transform: 'translateY(1px)' }}
                  />
                  Chat
                </div>
              </div>
            </div>
          )}
          {location.pathname.split('/')[1] ===
          localStorage.getItem('userId') ? null : (
            <div className='card'>
              <b className='title'>People also visit tutors</b>
            </div>
          )}
        </Col>
      ) : null}
    </Row>
  );
};

export default UserDetailPage;
