import CategoryTag from '@/components/CategoryTag/CategoryTag';
import EditQueryModal from '@/components/EditQueryModal/EditQueryModal';
import { NO_PERMISSION_WARNING } from '@/const/const';
import { pushDownVote, pushUpVote, saveQuery } from '@/services/query.service';
import {
  CaretDownFilled,
  CaretUpFilled,
  EditOutlined,
  SaveOutlined,
  SaveFilled,
} from '@ant-design/icons';
import { Divider, message, Modal } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import './QueryDetailPageQuestionCard.scss';

interface QueryDetailPageQuestionCardProps {
  data: any;
  fetchQuery: any;
  isPostOwner: boolean;
}

type VoteStatusType = 'upvote' | 'downvote' | 'none';

const QueryDetailPageQuestionCard: FunctionComponent<
  QueryDetailPageQuestionCardProps
> = ({ data, fetchQuery, isPostOwner }) => {
  const [voteStatus, setVoteStatus] = useState<VoteStatusType>('none');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPostSaved, setIsPostSaved] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      const upVoteList = data?.upvote_list;
      const downVoteList = data?.downvote_list;
      if (upVoteList.includes(localStorage.getItem('userId'))) {
        setVoteStatus('upvote');
      }
      if (downVoteList.includes(localStorage.getItem('userId'))) {
        setVoteStatus('downvote');
      }
      if (data?.user_saved_list?.includes(localStorage.getItem('userId'))) {
        setIsPostSaved(true);
      } else {
        setIsPostSaved(false);
      }
    }
  }, [data]);

  const handleUpVote = async () => {
    if (!localStorage.getItem('myQueryToken')) {
      return message.warning(NO_PERMISSION_WARNING);
    }

    const res = await pushUpVote(
      data?.id,
      localStorage.getItem('myQueryToken') as string
    );

    if (res?.data?.status_code === 1) {
      fetchQuery();
    }
  };

  const handleDownVote = async () => {
    if (!localStorage.getItem('myQueryToken')) {
      return message.warning(NO_PERMISSION_WARNING);
    }

    const res = await pushDownVote(
      data?.id,
      localStorage.getItem('myQueryToken') as string
    );

    if (res?.data?.status_code === 1) {
      fetchQuery();
    }
  };

  const handleQuerySave = async () => {
    if (!localStorage.getItem('myQueryToken')) {
      return message.warning(NO_PERMISSION_WARNING);
    }

    const res = await saveQuery(
      data?.id,
      localStorage.getItem('myQueryToken') as string
    );

    if (res?.data?.status_code === 1) {
      fetchQuery();
    }
  };

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

  return (
    <div className='query-detail-page-question-card'>
      <Modal
        title='New Query'
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <EditQueryModal
          initialValues={data}
          callback={fetchQuery}
          closeModal={setIsModalVisible}
        />
      </Modal>
      <b className='title'>{data?.title}</b>
      <Divider style={{ marginTop: 12, marginBottom: 12 }} />
      <div className='question-card-content'>{data?.content}</div>
      <div className='question-card-image'>
        <img src={data?.image_url} alt='' width={'30%'} />
      </div>
      <div className='question-card-tags'>
        {data?.tags?.length > 0 &&
          data?.tags?.map((t: any) => <CategoryTag tagName={t} key={t} />)}
      </div>
      <Divider style={{ marginTop: 12, marginBottom: 20 }} />
      <div className='question-card-functions'>
        <div className='vote-field'>
          <CaretUpFilled
            className={`vote-item ${
              voteStatus === 'upvote' ? 'vote-item-pressed' : null
            }`}
            onClick={() => handleUpVote()}
          />
          <CaretDownFilled
            className={`vote-item ${
              voteStatus === 'downvote' ? 'vote-item-pressed' : null
            }`}
            onClick={() => handleDownVote()}
          />
        </div>
        <div className='function-buttons'>
          {isPostOwner ? (
            <div className='btn edit-btn' onClick={showModal}>
              <EditOutlined />
              Edit
            </div>
          ) : (
            <div className='btn save-btn' onClick={() => handleQuerySave()}>
              {isPostSaved ? (
                <>
                  <SaveFilled style={{ color: '#ee834e', fontSize: 16 }} />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <SaveOutlined style={{ color: '#35434f', fontSize: 16 }} />
                  <span>Save</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryDetailPageQuestionCard;
