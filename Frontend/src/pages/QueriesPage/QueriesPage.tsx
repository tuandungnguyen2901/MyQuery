import CreateQueryModal from '@/components/CreateQueryModal/CreateQueryModal';
import NoData from '@/components/NoData/NoData';
import QueriesPageQuestionCard from '@/components/QueryListPage/QueriesPageQuestionCard';
import TagsDropDown from '@/components/TagsDropDown/TagsDropDown';
import { NO_PERMISSION_WARNING } from '@/const/const';
import {
  getAllPosts,
  getAllSavedPosts,
  getAllTags,
  getQueriesByUserId,
  searchQuery
} from '@/services/query.service';
import { sortByDate, sortByVote } from '@/utils/utils';
import {
  CloseCircleFilled,
  FormOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Icon } from '@iconify/react';
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  PaginationProps,
  Row,
  Select,
  Skeleton,
  Space
} from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams
} from 'react-router-dom';
import './QueriesPage.scss';

interface QueriesPageProps {}

const QueriesPage: FunctionComponent<QueriesPageProps> = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formSearch] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (window.innerWidth < 768) {
      return false;
    }
    return true;
  });
  const [reload, setReload] = useState(false);
  const [tags, setTags] = useState();
  const [params] = useSearchParams();
  const [posts, setPosts] = useState<any>();

  useEffect(() => {
    const fetchTag = async () => {
      const res = await getAllTags();

      if (res?.data?.status_code === 1) {
        setTags(res?.data?.data);
      }
    };

    fetchTag();
  }, []);

  useEffect(() => {
    if (params.get('query') === 'saved-queries') {
      fetchSavedPosts();
      return;
    }

    if (params.get('query') === 'my-queries') {
      fetchPostByUserId(localStorage.getItem('userId') as string);

      return;
    }

    navigate(
      {
        search: createSearchParams({
          query: 'all',
        }).toString(),
      },
      { replace: true }
    );
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, params, reload]);

  const fetchPostByUserId = async (userId: string) => {
    if (userId) {
      const res = await getQueriesByUserId(userId);

      if (res?.data?.status_code === 1) {
        searchWithSort(res?.data?.data);

        setIsLoading(false);
      }
    } else {
      setPosts([]);
      setIsLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    const startTime = new Date().getTime();
    const myToken = localStorage.getItem('myQueryToken');
    const res = await getAllSavedPosts(myToken as string);

    if (res?.data?.status_code === 1) {
      searchWithSort(res?.data?.data);
    }
    const currentTime = new Date().getTime();
    const diffTime = Math.abs(currentTime - startTime);
    if (diffTime < 500) {
      await new Promise((r) => setTimeout(r, 500 - diffTime));
    }

    setIsLoading(false);
  };

  const fetchPost = async () => {
    const startTime = new Date().getTime();
    const res = await getAllPosts();
    if (res?.data?.status_code === 1) {
      const data = res?.data?.data;
      searchWithSort(data);
    }
    const currentTime = new Date().getTime();
    const diffTime = Math.abs(currentTime - startTime);
    if (diffTime < 500) {
      await new Promise((r) => setTimeout(r, 500 - diffTime));
    }

    setIsLoading(false);
  };

  /**
   * Drawers handle in MOBILE responsive
   */
  const [drawerVisible, setDrawerVisible] = useState(false);

  const onDrawerClose = () => {
    setDrawerVisible(false);
  };

  const handleDrawerOk = () => {
    formSearch.submit();
    setDrawerVisible(false);
  };
  /**
   * Drawers handle in MOBILE responsive
   */
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    if (windowSize.innerWidth < 993) {
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

  /**
   * Start top filter handle
   * @param values
   */

  const handleSearch = async (values: any) => {
    // const currParams = params.get('query');
    // if (currParams === 'saved-queries') {
    //   fetchSavedPosts().then(() => {
    //     const tagsArr = values?.tagDropDown;
    //     // console.log(posts.tags, tagsArr);
    //     const searchTitle = String(values?.searchQuery).toLowerCase();
    //     const newArr = posts?.filter((p: any) => {
    //       if (p?.title.toLowerCase().includes(searchTitle)) {
    //         return true;
    //       }
    //       return false;
    //     });
    //     // console.log(newArr);
    //     searchWithSort(newArr);
    //   });
    //   return;
    // }

    // if (currParams === 'my-queries') {
    //   fetchPostByUserId(localStorage.getItem('userId') as string);
    //   const tagsArr = values?.tagDropDown;
    //   // console.log(posts.tags, tagsArr);
    //   const searchTitle = String(values?.searchQuery).toLowerCase();
    //   const newArr = posts?.filter((p: any) => {
    //     if (
    //       p?.title.toLowerCase().includes(searchTitle) &&
    //       hasSubArray(posts.tags || [], tagsArr || [])
    //     ) {
    //       return true;
    //     }
    //     return false;
    //   });
    //   console.log(posts);
    //   // searchWithSort(newArr);

    //   return;
    // }

    const body = {
      search_str: values?.searchQuery ? [values?.searchQuery] : null,
      filter_tags: values?.tagDropDown,
    };

    const res = await searchQuery(body);
    if (res?.data?.status_code === 1) {
      const data = res?.data?.data;

      searchWithSort(data);
    }
  };

  const handleSearchKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      if (formSearch.getFieldValue('searchQuery')) {
        formSearch.submit();
      }
      event.target.blur();
    }
  };

  const searchWithSort = (arr: any) => {
    const v = formSearch.getFieldValue('sortQuery');

    if (!v) {
      setPosts([...arr]);
    }

    if (v === 'newest') {
      const sortedList = sortByDate(arr, 'newest');
      setPosts([...sortedList]);
    }

    if (v === 'oldest') {
      const sortedList = sortByDate(arr, 'oldest');
      setPosts([...sortedList]);
    }

    if (v === 'vote-des') {
      const sortedList = sortByVote(arr, 'des');
      setPosts([...sortedList]);
    }

    if (v === 'vote-asc') {
      const sortedList = sortByVote(arr, 'asc');
      setPosts([...sortedList]);
    }
  };

  const handleSortOnChange = () => {
    if (isDesktop) {
      if (posts?.length < 1) {
        return;
      }

      const v = formSearch.getFieldValue('sortQuery');

      if (v === 'newest') {
        const sortedList = sortByDate(posts, 'newest');
        setPosts([...sortedList]);
      }

      if (v === 'oldest') {
        const sortedList = sortByDate(posts, 'oldest');
        setPosts([...sortedList]);
      }

      if (v === 'vote-des') {
        const sortedList = sortByVote(posts, 'des');
        setPosts([...sortedList]);
      }

      if (v === 'vote-asc') {
        const sortedList = sortByVote(posts, 'asc');
        setPosts([...sortedList]);
      }
    }
  };
  /**
   * End top filter handle
   */

  /************** */

  /**
   * Start new query handle
   */
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  /**
   * End new query handle
   */

  /************** */

  /**
   * Stat handle routing
   */
  const handleNavigateQueryPage = (v: string) => {
    /**
     * TODO: - Add fetch DATA here
     *
     */
    navigate(
      {
        search: createSearchParams({
          query: String(v),
        }).toString(),
      },
      { replace: true }
    );
  };
  /**
   * End handle routing
   */

  /**
   * START pagination handle
   */
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    current,
    pageSize
  ) => {
    console.log(current, pageSize);
  };

  /**
   * END pagination handle
   */

  return (
    <Form form={formSearch} onFinish={handleSearch}>
      <Row className='queries-page' gutter={[20, 15]} justify={'center'}>
        {isDesktop ? (
          <Col className='queries-page-filter' lg={{ span: 5 }}>
            <div className='filter-by-query'>
              <b>Queries</b>
              <div className='filter-by-query-list'>
                <div
                  className={`filter-by-query-item ${
                    searchParams.get('query') === 'all' ||
                    !searchParams.get('query')
                      ? 'active'
                      : null
                  }`}
                  onClick={() => handleNavigateQueryPage('all')}
                >
                  All queries
                </div>
                <div
                  className={`filter-by-query-item ${
                    searchParams.get('query') === 'my-queries' ? 'active' : null
                  }`}
                  onClick={() => handleNavigateQueryPage('my-queries')}
                >
                  My queries
                </div>
                <div
                  className={`filter-by-query-item ${
                    searchParams.get('query') === 'saved-queries'
                      ? 'active'
                      : null
                  }`}
                  onClick={() => handleNavigateQueryPage('saved-queries')}
                >
                  Saved queries
                </div>
              </div>
            </div>

            <div className='filter-by-property'>
              <b>Filter </b>
              <div className='filter-by-property-list'>
                <TagsDropDown form={formSearch} tags={tags} />
              </div>
            </div>
          </Col>
        ) : null}
        <Col
          className='queries-page-content'
          xs={{ span: 24 }}
          lg={{ span: 14 }}
        >
          <Modal
            title='New Query'
            visible={isModalVisible}
            footer={null}
            onCancel={handleCancel}
            destroyOnClose={true}
          >
            <CreateQueryModal
              tags={tags}
              callback={setReload}
              closeModal={setIsModalVisible}
            />
          </Modal>
          <div className='queries-page-content-header'>
            <div
              className='new-query-btn'
              onClick={() => {
                if (localStorage.getItem('myQueryToken')) {
                  showModal();
                } else {
                  message.warning(NO_PERMISSION_WARNING);
                }
              }}
            >
              New Query
            </div>
            <div className={'search-query-form'}>
              <Form.Item name={'searchQuery'}>
                <Input
                  placeholder='Search query'
                  allowClear={{
                    clearIcon: (
                      <CloseCircleFilled
                        onClick={handleSearch}
                        style={{ fontSize: 14, transform: 'translateY(5%)' }}
                      />
                    ),
                  }}
                  onKeyUp={(e) => handleSearchKeyUp(e)}
                />
              </Form.Item>
              {isDesktop ? (
                <Form.Item name={'sortQuery'}>
                  <Select
                    placeholder='Sort'
                    allowClear
                    onChange={handleSortOnChange}
                    className={'sort-query'}
                    style={{
                      width: 'fit-content',
                      minWidth: 80,
                    }}
                    dropdownMatchSelectWidth={false}
                    suffixIcon={
                      <Icon icon='gg:sort-az' style={{ fontSize: 20 }} />
                    }
                    placement={'bottomRight'}
                    optionLabelProp='label'
                  >
                    <Select.Option value='newest' label={'Sorted by: Newest'}>
                      <span>Newest</span>
                    </Select.Option>
                    <Select.Option value='oldest' label={'Sorted by: Oldest'}>
                      <span>Oldest</span>
                    </Select.Option>
                    <Select.Option
                      value='vote-asc'
                      label={'Sorted by: Vote Ascending'}
                    >
                      <span>Vote Ascending</span>
                    </Select.Option>
                    <Select.Option
                      value='vote-des'
                      label={'Sorted by: Vote Descending'}
                    >
                      <span>Vote Descending</span>
                    </Select.Option>
                  </Select>
                </Form.Item>
              ) : null}
            </div>
          </div>

          {isDesktop ? null : (
            <div className='query-by-filter-mobile'>
              <div
                className={`filter-mobile-item ${
                  searchParams.get('query') === 'all' ||
                  !searchParams.get('query')
                    ? 'active'
                    : null
                }`}
                onClick={() => handleNavigateQueryPage('all')}
              >
                All
              </div>
              <div
                className={`filter-mobile-item ${
                  searchParams.get('query') === 'my-queries' ? 'active' : null
                }`}
                onClick={() => handleNavigateQueryPage('my-queries')}
              >
                My Queries
              </div>
              <div
                className={`filter-mobile-item ${
                  searchParams.get('query') === 'saved-queries'
                    ? 'active'
                    : null
                }`}
                onClick={() => handleNavigateQueryPage('saved-queries')}
              >
                Saved queries
              </div>
            </div>
          )}

          {isDesktop ? null : (
            <div
              className='advanced-setting'
              onClick={() => setDrawerVisible(true)}
            >
              Advanced Setting <SettingOutlined />
            </div>
          )}

          {isLoading ? (
            <Skeleton active />
          ) : (
            <div className='queries-page-content-main'>
              {posts?.length > 0 ? (
                posts?.map((post: any) => {
                  return <QueriesPageQuestionCard post={post} key={post.id} />;
                })
              ) : (
                <NoData />
              )}
              <Pagination
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
                defaultCurrent={1}
                total={posts?.length}
                className={'content-main-pagination'}
              />
            </div>
          )}
        </Col>
        {isDesktop ? (
          <Col className='queries-page-recommendation' lg={{ span: 5 }}>
            <div className='query-recommendation'>
              <b>Queries you may see</b>
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
                  <span className='recommend-query-title'>
                    Recommend title 1
                  </span>
                </div>
                <div className='recommend-query'>
                  <FormOutlined />
                  <span className='recommend-query-title'>
                    Recommend title 1
                  </span>
                </div>
                <div className='recommend-query'>
                  <FormOutlined />
                  <span className='recommend-query-title'>
                    Recommend title 1
                  </span>
                </div>
                <div className='recommend-query'>
                  <FormOutlined />
                  <span className='recommend-query-title'>
                    Recommend title long long long long long long long
                  </span>
                </div>
                <div className='recommend-query'>
                  <FormOutlined />
                  <span className='recommend-query-title'>
                    Recommend title 1
                  </span>
                </div>
              </div>
            </div>
          </Col>
        ) : null}
      </Row>

      {/* DRAWER in MOBILE RESPONSIVE */}
      <Drawer
        bodyStyle={{ padding: '30px 20px' }}
        headerStyle={{ paddingLeft: 10, fontWeight: 200 }}
        className='queries-page-drawer'
        title='Advanced Setting'
        placement={'bottom'}
        width={500}
        onClose={onDrawerClose}
        visible={drawerVisible}
        extra={
          <Space>
            <Button
              onClick={handleDrawerOk}
              style={{ background: '#ee834e', color: 'white', fontWeight: 600 }}
            >
              OK
            </Button>
          </Space>
        }
        closeIcon={null}
      >
        <Form.Item name={'sortQuery'} label={'Sort:'} labelCol={{ span: 24 }}>
          <Select
            placeholder='Sort'
            allowClear
            onChange={handleSortOnChange}
            className={'sort-query'}
            style={{
              width: '100%',
              minWidth: 80,
            }}
            dropdownMatchSelectWidth={false}
            suffixIcon={<Icon icon='gg:sort-az' style={{ fontSize: 20 }} />}
            placement={'bottomRight'}
            optionLabelProp='label'
          >
            <Select.Option value='newest' label={'Sorted by: Newest'}>
              <span>Newest</span>
            </Select.Option>
            <Select.Option value='oldest' label={'Sorted by: Oldest'}>
              <span>Oldest</span>
            </Select.Option>
            <Select.Option value='vote-asc' label={'Sorted by: Vote Ascending'}>
              <span>Vote Ascending</span>
            </Select.Option>
            <Select.Option
              value='vote-des'
              label={'Sorted by: Vote Descending'}
            >
              <span>Vote Descending</span>
            </Select.Option>
          </Select>
        </Form.Item>
        <TagsDropDown form={formSearch} label='Tags:' tags={tags} />
      </Drawer>
    </Form>
  );
};

export default QueriesPage;
