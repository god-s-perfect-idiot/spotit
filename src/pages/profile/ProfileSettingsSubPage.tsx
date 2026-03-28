import { Navigate, useParams } from "react-router-dom";
import { ProfilePageHeader } from "../../components/profile/ProfilePageHeader";

const COPY: Record<string, { title: string; body: string }> = {
  "hide-content": {
    title: "Hide Content",
    body: "Choose what you would like to blur or hide on sensitive screens. More options will appear here in a future update.",
  },
  privacy: {
    title: "Privacy Settings",
    body: "Control how your data is used and what is shared. Detailed privacy controls will appear here in a future update.",
  },
  notifications: {
    title: "Notification Settings",
    body: "Manage reminders and push notifications. Granular toggles will appear here in a future update.",
  },
  help: {
    title: "Help & FAQs",
    body: "Find answers to common questions and contact support. Help articles will appear here in a future update.",
  },
};

const SLUGS = Object.keys(COPY);

export default function ProfileSettingsSubPage() {
  const { slug } = useParams<{ slug: string }>();
  if (!slug || !SLUGS.includes(slug)) {
    return <Navigate to="/profile" replace />;
  }
  const { title, body } = COPY[slug];
  return (
    <div className="flex flex-col gap-6 p-6 pb-28">
      <ProfilePageHeader title={title} />
      <p className="text-[15px] leading-relaxed text-[#4a3d3f]/88">{body}</p>
    </div>
  );
}
