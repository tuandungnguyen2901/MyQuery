import TagsDropDown from '@/components/TagsDropDown/TagsDropDown';
import TutorListPageTutorCard from '@/components/TutorListPage/TutorListPageTutorCard';
import { getAllTags } from '@/services/query.service';
import { getAllTutors } from '@/services/tutor.service';
import { SettingOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Pagination,
  PaginationProps,
  Row,
  Select,
  Space,
} from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import './TutorListPage.scss';

interface TutorListPageProps {}

const TutorListPage: FunctionComponent<TutorListPageProps> = () => {
  const [tutors, setTutors] = useState<any>([]);
  const [formSearch] = Form.useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isDesktop, setIsDesktop] = useState(() => {
    if (window.innerWidth < 768) {
      return false;
    }
    return true;
  });
  const [, setReload] = useState(false);
  const [tags, setTags] = useState();

  useEffect(() => {
    const fetchTag = async () => {
      const res = await getAllTags();
      if (res?.data?.status_code === 1) {
        setTags(res?.data?.data);
      }
    };

    fetchTag();
    fetchTutor();
  }, []);

  const fetchTutor = async () => {
    const res = await getAllTutors();

    if (res?.data?.status_code === 1) {
      setTutors(res?.data?.data);
    }
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
    if (windowSize.innerWidth < 999) {
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
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const handleSearchKeyUp = (event: any) => {
    if (event.key === 'Enter') {
      if (formSearch.getFieldValue('searchQuery')) {
        formSearch.submit();
      }
      event.target.blur();
    }
  };

  const handleSortOnChange = (v: any) => {
    if (isDesktop) {
      formSearch.submit();
    }
  };
  /**
   * End top filter handle
   */

  /************** */

  /**
   * Start new query handle
   */

  /**
   * End new query handle
   */

  /************** */

  /**
   * Stat handle routing
   */
  const handleNavigateTutorListPage = (v: string) => {
    /**
     * TODO: - Add fetch DATA here
     *
     */
    navigate(
      {
        search: createSearchParams({
          tutor: String(v),
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
    <Form form={formSearch} onFinish={onFinish}>
      <Row className='tutor-list-page' gutter={[0, 0]} justify={'center'}>
        {isDesktop ? (
          <Col className='tutor-list-page-filter' lg={{ span: 5 }}>
            <b>Tutors for you</b>
            <div className='filter-by-tutor'>
              <b>Tutors</b>
              <div className='filter-by-tutor-list'>
                <div
                  className={`filter-by-tutor-item ${
                    searchParams.get('tutor') === 'all' ||
                    !searchParams.get('tutor')
                      ? 'active'
                      : null
                  }`}
                  onClick={() => handleNavigateTutorListPage('all')}
                >
                  All tutor
                </div>
                <div
                  className={`filter-by-tutor-item ${
                    searchParams.get('tutor') === 'recently' ? 'active' : null
                  }`}
                  onClick={() => handleNavigateTutorListPage('recently')}
                >
                  Recently visited tutor
                </div>
                <div
                  className={`filter-by-tutor-item ${
                    searchParams.get('tutor') === 'stared' ? 'active' : null
                  }`}
                  onClick={() => handleNavigateTutorListPage('stared')}
                >
                  Stared tutor
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

        <Col className='tutor-list-page-content' lg={{ span: 19 }}>
          <div className='tutor-list-page-content-header'>
            <div className={'search-tutor-form'}>
              <Form.Item name={'searchTutor'}>
                <Input
                  placeholder='Search tutor'
                  allowClear
                  onKeyUp={(e) => handleSearchKeyUp(e)}
                />
              </Form.Item>
              {isDesktop ? (
                <Form.Item name={'sortTutor'}>
                  <Select
                    placeholder='Sort'
                    allowClear
                    onChange={handleSortOnChange}
                    className={'sort-tutor'}
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
                  searchParams.get('tutor') === 'all' ||
                  !searchParams.get('tutor')
                    ? 'active'
                    : null
                }`}
                onClick={() => handleNavigateTutorListPage('all')}
              >
                All
              </div>
              <div
                className={`filter-mobile-item ${
                  searchParams.get('tutor') === 'recently' ? 'active' : null
                }`}
                onClick={() => handleNavigateTutorListPage('recently')}
              >
                Recently
              </div>
              <div
                className={`filter-mobile-item ${
                  searchParams.get('tutor') === 'stared' ? 'active' : null
                }`}
                onClick={() => handleNavigateTutorListPage('stared')}
              >
                Stared
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

          <div className='tutor-list-page-content-main'>
            {tutors?.map((el: any, index: number) => (
              <TutorListPageTutorCard key={index} tutorInfo={el} />
            ))}
          </div>

          <Pagination
            showSizeChanger
            onShowSizeChange={onShowSizeChange}
            defaultCurrent={1}
            total={500}
            className={'content-main-pagination'}
          />
        </Col>
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

export default TutorListPage;
