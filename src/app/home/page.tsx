import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/modules/home/pages/page"));

const Page = () => {
  return <HomePage />;
};

export default Page;
