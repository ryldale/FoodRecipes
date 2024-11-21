import dynamic from "next/dynamic";

const ProfilePage = dynamic(() => import("@/modules/profile/pages/page"));

const Page = () => {
  return <ProfilePage />;
};

export default Page;
