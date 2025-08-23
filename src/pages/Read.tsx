import { BlogCategories, CustomisedBlogs, FeaturedBlogs } from '../components/Blogs';
import Notifications from '../components/Notifications';

export default function Read() {
  return (
    <div className="flex-1 p-6 flex flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Read</h1>
        <Notifications />
      </div>
      <FeaturedBlogs />
      <CustomisedBlogs />
      <BlogCategories />
    </div>
  );
}
