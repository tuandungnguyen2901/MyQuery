import { FunctionComponent } from 'react';
import './CategoryTag.scss';

interface CategoryTagProps {
  tagName: string;
}

const CategoryTag: FunctionComponent<CategoryTagProps> = ({ tagName }) => {
  return (
    <div className='category-tag'>
      <span>#{tagName}</span>
    </div>
  );
};

export default CategoryTag;
