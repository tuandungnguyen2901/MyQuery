import { Empty } from 'antd';
import './NoData.scss';

interface Props {}

function NoData(props: Props) {
  return (
    <div className='no-data'>
      <Empty />
    </div>
  );
}

export default NoData;
