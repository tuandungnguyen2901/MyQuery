import CategoryTag from '@/components/CategoryTag/CategoryTag';
import { Divider } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TutorListPageTutorCard.scss';

interface TutorListPageTutorCardProps {
  tutorInfo: any;
}

const TutorListPageTutorCard: FunctionComponent<
  TutorListPageTutorCardProps
> = ({ tutorInfo }) => {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (window.innerWidth < 768) {
      return false;
    }
    return true;
  });
  const [, setReload] = useState(false);
  const getWindowSize = () => {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  };
  const navigate = useNavigate();

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

  const navigateToTutor = () => {
    navigate(`/${tutorInfo.id}`, { replace: false });
  };

  return isDesktop ? (
    <div className='tutor-list-page-tutor-card'>
      <div className='card-content'>
        <img src={tutorInfo.avatar} alt='' />
        <b
          className='tutor-name'
          onClick={() => navigateToTutor()}
        >{`${tutorInfo.last_name} ${tutorInfo.first_name}`}</b>
        <p> {`Rate: ${tutorInfo.rate}/10`}</p>
        <div className='tutor-tags'>
          {tutorInfo.tags.map((tag: any) => (
            <CategoryTag tagName={tag} key={tag} />
          ))}
        </div>
        <div className='tutor-rewards'>
          <div className='tutor-rewards-item'>
            <b> {Math.floor(Math.random() * 100)}</b>
            <p>Student trained</p>
          </div>
          <Divider
            type='vertical'
            style={{ height: 80, borderColor: '#b5b5b5' }}
          />
          <div className='tutor-rewards-item'>
            <b> {Math.floor(Math.random() * 100)}</b>
            <p>Reviews received</p>
          </div>
        </div>
        <div className='card-button'>Hire this tutor</div>
      </div>
    </div>
  ) : (
    <div className='tutor-card-mobile' onClick={() => navigateToTutor()}>
      <img src={tutorInfo.avatar} alt='' />
      <div className='tutor-card-mobile-content'>
        <b
          className='tutor-name-mobile'
          style={{ fontSize: 15 }}
        >{`${tutorInfo.last_name} ${tutorInfo.first_name}`}</b>
        <p> {`Rate: ${tutorInfo.rate}/10`}</p>
        <div className='tutor-tags-mobile'>
          {tutorInfo.tags.map((tag: any) => (
            <CategoryTag tagName={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorListPageTutorCard;
