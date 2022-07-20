import QueryAnswerCard from '@/components/QueryAnswerCard/QueryAnswerCard';
import QueryDetailPageQuestionCard from '@/components/QueryDetailPage/QueryDetailPageQuestionCard';
import { NO_PERMISSION_WARNING } from '@/const/const';
import {
  addComment,
  getAllCommentByPost,
  searchQueryById,
} from '@/services/query.service';
import {
  calculateDate,
  getUserIdFromLocalStorage,
  sortByDate,
} from '@/utils/utils';
import { FormOutlined, MessageOutlined } from '@ant-design/icons';
import { Col, Divider, Form, Input, message, Row } from 'antd';
import moment from 'moment';
import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QueryDetailPage.scss';

interface QueryDetailPageProps {}

const QueryDetailPage: FunctionComponent<QueryDetailPageProps> = () => {
  const [formAnswer] = Form.useForm();
  const [isDesktop, setIsDesktop] = useState(() => {
    if (window.innerWidth < 768) {
      return false;
    }
    return true;
  });
  const [, setReload] = useState(false);
  const location = useLocation();
  const [query, setQuery] = useState<any>();
  const [isPostOwner, setIsPostOwner] = useState<boolean>(false);
  const currentUserId = getUserIdFromLocalStorage();
  const [comments, setComments] = useState([]);
  const isSignedIn = currentUserId ? true : false;
  const postId = location.pathname.split('/')[2];
  const navigate = useNavigate();
  console.log(query);
  useEffect(() => {
    fetchQuery();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!query) {
      return;
    }

    if (query.user_id === currentUserId) {
      setIsPostOwner(true);
    }
  }, [currentUserId, query]);

  const fetchComments = async () => {
    const id = location.pathname.split('/')[2];
    const res = await getAllCommentByPost(id);

    if (res?.data?.status_code === 1) {
      const sortedData = sortByDate(res?.data?.data, 'newest');
      setComments(sortedData);
    }
  };

  const fetchQuery = async () => {
    const id = location.pathname.split('/')[2];
    const res = await searchQueryById(id);

    if (res?.data?.status_code === 1) {
      setQuery(res?.data?.data[0]);
    }
  };

  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());

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

  /************** */

  const handleFormAnswerFinish = async (v: any) => {
    const data = {
      post_id: postId,
      content: v.queryAnswer,
      created_at: String(moment().unix()),
    };

    const res = await addComment(data, localStorage.getItem('myQueryToken'));

    if (res?.data?.status_code === 1) {
      formAnswer.resetFields();
      fetchComments();
    }
  };

  return (
    <Row className='query-detail-page' gutter={[20, 15]} justify={'center'}>
      <Col className='query-detail-page-content' lg={{ span: 18 }}>
        <div className='query-detail-page-content-header'>
          <div className='user-card-info'>
            <img src={query?.user?.avatar} alt='' />
            <div className='info-detail'>
              <b
                className='info-detail-name'
                onClick={() => {
                  navigate(`/${query?.user_id}`);
                }}
              >
                {query?.user?.last_name} {query?.user?.first_name}
              </b>
              <span className='info-detail-date'>
                {calculateDate(query?.created_at)}
              </span>
            </div>
          </div>

          <div className='user-card-statistic'>
            <div className='user-card-statistic-item'>
              <b>{query?.comments}</b>
              <span>Answers</span>
            </div>
            <div className='user-card-statistic-item'>
              <b>
                {String(
                  query?.upvote_list?.length - query?.downvote_list?.length
                )}
              </b>
              <span>Votes</span>
            </div>
            <div className='user-card-statistic-item'>
              <b>{query?.user_saved_list?.length}</b>
              <span>Starred</span>
            </div>
          </div>
        </div>

        <div className='query-detail-page-content-main'>
          <QueryDetailPageQuestionCard
            data={query}
            fetchQuery={fetchQuery}
            isPostOwner={isPostOwner}
          />
          <Form
            className='answer-field'
            form={formAnswer}
            onFinish={handleFormAnswerFinish}
            layout={'vertical'}
          >
            <Form.Item
              name={'queryAnswer'}
              label={'Your Answer'}
              rules={[
                {
                  validator: (_, v) => {
                    if (!v) {
                      return Promise.reject(
                        new Error('You cannot leave this field empty.')
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.TextArea
                autoSize
                style={{ minHeight: 100 }}
              ></Input.TextArea>
            </Form.Item>
            <div
              className='btn answer-btn'
              onClick={() => {
                if (localStorage.getItem('myQueryToken')) {
                  formAnswer.submit();
                } else {
                  message.warning(NO_PERMISSION_WARNING);
                }
              }}
            >
              <MessageOutlined />
              Answer it
            </div>
          </Form>
          <Divider orientation='left'>
            <p style={{ fontSize: 16, margin: 0 }}>Answers</p>
          </Divider>

          <div className='answer-list'>
            {comments?.map((c: any) => (
              <QueryAnswerCard
                key={c.id}
                content={c.content}
                createdAt={c.created_at}
                id={c.id}
                postId={c.post_id}
                userId={c.user_id}
              />
            ))}
          </div>
        </div>
      </Col>
      {isDesktop ? (
        <Col className='query-detail-page-recommendation' lg={{ span: 6 }}>
          <div className='query-recommendation'>
            <b>Related queries</b>
            <Divider
              style={{
                borderTopColor: '#1C1D1F',
                color: '#1C1D1F',
                margin: '12px 0',
              }}
            />
            <div className='recommend-query-list'>
              <div className='recommend-query'>
                <FormOutlined />
                <span className='recommend-query-title'>Recommend title 1</span>
              </div>
              <div className='recommend-query'>
                <FormOutlined />
                <span className='recommend-query-title'>Recommend title 1</span>
              </div>
              <div className='recommend-query'>
                <FormOutlined />
                <span className='recommend-query-title'>Recommend title 1</span>
              </div>
              <div className='recommend-query'>
                <FormOutlined />
                <span className='recommend-query-title'>
                  Recommend title long long long long long long long
                </span>
              </div>
              <div className='recommend-query'>
                <FormOutlined />
                <span className='recommend-query-title'>Recommend title 1</span>
              </div>
            </div>
          </div>
        </Col>
      ) : null}
    </Row>
  );
};

export default QueryDetailPage;
