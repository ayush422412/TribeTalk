import { LeftSidebar } from '../components';
import RightContent from '../components/RightContent';
const Home = () => {
  return (
    <div className='min-w-screen flex'>
      <LeftSidebar/>
      <RightContent/>
    </div>
  );
};

export default Home;
