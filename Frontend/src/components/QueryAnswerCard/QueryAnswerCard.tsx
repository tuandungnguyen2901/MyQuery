import { NO_PERMISSION_WARNING } from '@/const/const';
import { getUser } from '@/services/auth.service';
import {
  getCommentInfoById,
  pushCommentDownVote,
  pushCommentUpVote,
} from '@/services/query.service';
import { calculateDate, getUserIdFromLocalStorage } from '@/utils/utils';
import {
  CalendarOutlined,
  CaretDownFilled,
  CaretUpFilled,
} from '@ant-design/icons';
import { message, Skeleton } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import './QueryAnswerCard.scss';

interface QueryAnswerCardProps {
  content: string;
  createdAt: string;
  id: string;
  postId: string;
  userId: string;
}

type VoteStatusType = 'upvote' | 'downvote' | 'none';

const QueryAnswerCard: FunctionComponent<QueryAnswerCardProps> = ({
  content,
  createdAt,
  id,
  postId,
  userId,
}) => {
  const [user, setUser] = useState<any>();
  const [voteStatus, setVoteStatus] = useState<VoteStatusType>('none');
  const [commentInfo, setCommentInfo] = useState<any>();
  const currentUserId = getUserIdFromLocalStorage();

  useEffect(() => {
    fetchCommentInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCommentInfo = async () => {
    const res = await getCommentInfoById(id);

    if (res?.data?.status_code === 1) {
      const data = res?.data?.data[0];

      if (data?.upvote_list.includes(currentUserId)) {
        setVoteStatus('upvote');
      } else if (data?.downvote_list.includes(currentUserId)) {
        setVoteStatus('downvote');
      } else {
        setVoteStatus('none');
      }

      setCommentInfo(data);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUser(userId);
      if (res?.data?.status_code === 1) {
        setUser(res?.data?.data[0]);
      }
    };

    fetchUser();
  }, [userId]);

  const handleUpVote = async () => {
    if (!localStorage.getItem('myQueryToken')) {
      return message.warning(NO_PERMISSION_WARNING);
    }

    const res = await pushCommentUpVote(
      id,
      localStorage.getItem('myQueryToken') as string
    );

    if (res?.data?.status_code === 1) {
      fetchCommentInfo();
    }
  };

  const handleDownVote = async () => {
    if (!localStorage.getItem('myQueryToken')) {
      return message.warning(NO_PERMISSION_WARNING);
    }

    const res = await pushCommentDownVote(
      id,
      localStorage.getItem('myQueryToken') as string
    );

    if (res?.data?.status_code === 1) {
      fetchCommentInfo();
    }
  };

  return (
    <div className='query-answer-card'>
      {user ? (
        <>
          <img src={user?.avatar} alt='' />
          <div className='query-answer-card-main'>
            <div className='user-info'>
              <span className='name'>{`${user?.last_name} ${user?.first_name}`}</span>
              <span className='date'>
                <CalendarOutlined />
                <span>{calculateDate(createdAt)}</span>
              </span>
            </div>
            <div className='answer-content'>{content}</div>
            <div className='vote-field'>
              <CaretUpFilled
                className={`vote-item ${
                  voteStatus === 'upvote' ? 'vote-item-pressed' : null
                }`}
                onClick={() => handleUpVote()}
              />
              <span>
                {String(
                  commentInfo?.upvote_list?.length -
                    commentInfo?.downvote_list?.length
                )}
              </span>
              <CaretDownFilled
                className={`vote-item ${
                  voteStatus === 'downvote' ? 'vote-item-pressed' : null
                }`}
                onClick={() => handleDownVote()}
              />
            </div>
          </div>
        </>
      ) : (
        <Skeleton avatar paragraph={{ rows: 4 }} active />
      )}
    </div>
  );
};

export default QueryAnswerCard;
