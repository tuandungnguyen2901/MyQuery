import CategoryTag from '@/components/CategoryTag/CategoryTag';
import { Divider } from 'antd';
import { FunctionComponent } from 'react';
import './LandingPageTutorCard.scss';

interface LandingPageTutorCardProps {}

const LandingPageTutorCard: FunctionComponent<
  LandingPageTutorCardProps
> = () => {
  const handleOnClick = () => {
    //navigate to
  };

  return (
    <div className='landing-page-tutor-card'>
      <div className='card-content'>
        <img
          src='https://thumbs.dreamstime.com/b/portrait-smiling-school-teacher-holding-books-classroom-77909586.jpg'
          alt=''
        />
        <b className='tutor-name'>Ana</b>
        <p> Rate: 8.5/10</p>
        <div className='tutor-tags'>
          <CategoryTag tagName='math' />
          <CategoryTag tagName='pascal' />
          <CategoryTag tagName='C++' />
        </div>
        <div className='tutor-rewards'>
          <div className='tutor-rewards-item'>
            <b> 53</b>
            <p>Student trained</p>
          </div>
          <Divider
            type='vertical'
            style={{ height: 80, borderColor: '#b5b5b5' }}
          />
          <div className='tutor-rewards-item'>
            <b> 153</b>
            <p>Reviews received</p>
          </div>
        </div>
        <div className='card-button'>Hire this tutor</div>
      </div>
    </div>
  );
};

export default LandingPageTutorCard;
