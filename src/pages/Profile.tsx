import ProfileCard from '../components/profile/ProfileCard';
import CycleDetails from '../components/profile/CycleDetails';
import Goal from '../components/profile/Goal';
import Settings from '../components/profile/Settings';

export default function Profile() {
  return (
    <div className="flex-1 p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <ProfileCard />
      <CycleDetails />
      <Goal />
      <Settings />
    </div>
  );
}
