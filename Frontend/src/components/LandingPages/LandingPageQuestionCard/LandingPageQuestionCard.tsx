import QuestionTag from '@/components/CategoryTag/CategoryTag';
import { Divider } from 'antd';
import { FunctionComponent } from 'react';
import './LandingPageQuestionCard.scss';

interface LandingPageQuestionCardProps {}

const LandingPageQuestionCard: FunctionComponent<
  LandingPageQuestionCardProps
> = () => {
  const handleOnClick = () => {
    //navigate to
  };

  return (
    <div className='landing-page-question-card'>
      <div className='question-card-header'>
        <h2 className='card-title' onClick={handleOnClick}>
          Title
        </h2>
        <p className='card-info'>
          <b>Ambert</b> - May 04, 2022
        </p>
      </div>
      <Divider />
      <div className='card-content'>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia a
          quam omnis, exercitationem similique ipsa quas beatae, non, nesciunt
          nisi recusandae. Ducimus illo nam sapiente suscipit eaque, incidunt
          laudantium non?
        </p>
        <div className='question-tags'>
          <QuestionTag tagName={'math'} />
          <QuestionTag tagName={'calculus'} />
          <QuestionTag tagName={'integral'} />
        </div>
      </div>
      <Divider />
      <div className='question-react-info-field'>
        <span className='question-react-info'>5033 Up votes</span>
        <span className='question-react-info'> 3 Down votes</span>
        <span className='question-react-info'> 54 Comments</span>
      </div>
    </div>
  );
};

export default LandingPageQuestionCard;
