import QuestionTag from '@/components/CategoryTag/CategoryTag';
import { calculateDate } from '@/utils/utils';
import { Divider } from 'antd';
import { FunctionComponent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './QueriesPageQuestionCard.scss';

interface QueriesPageQuestionCardProps {
  post: any;
}

const QueriesPageQuestionCard: FunctionComponent<
  QueriesPageQuestionCardProps
> = ({ post }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(`${location.pathname}/${post.id}`, { replace: false });
  };

  const handleCardClick = () => {
    if (window.innerWidth < 800) {
      navigate(`${location.pathname}/${post.id}`, { replace: false });
    }
  };

  return (
    <div className='queries-page-question-card' onClick={handleCardClick}>
      <div className='question-card-header'>
        <h2 className='card-title' onClick={handleOnClick}>
          {post?.title}
        </h2>
        <div className='card-info'>
          <b>
            {post?.user.last_name} {post?.user.first_name}
          </b>
          <span
            style={{ marginLeft: 2, fontStyle: 'italic' }}
          >{` - ${calculateDate(post.created_at)}`}</span>
        </div>
      </div>
      <Divider />
      <div className='card-content'>
        <p>{post?.content}</p>
        <div className='question-tags'>
          {post.tags.length > 0 &&
            post.tags.map((t: any) => <QuestionTag tagName={t} key={t} />)}
        </div>
      </div>
      <Divider />
      <div className='question-react-info-field'>
        <span className='question-react-info'>{post.upvote} Up votes</span>
        <span className='question-react-info'> {post.downvote} Down votes</span>
        <span className='question-react-info'> {post.comments} Comments</span>
      </div>
    </div>
  );
};

export default QueriesPageQuestionCard;
