import MainLayout from './components/Layout/MainLayout.jsx';
import ChannelList from './components/Sidebar/ChannelList.jsx';
import ChatArea from './components/Chat/ChatArea.jsx';

export default function App() {
  return (
    <MainLayout>
      <div className="workspace">
        <ChannelList />
        <ChatArea />
      </div>
    </MainLayout>
  );
}

