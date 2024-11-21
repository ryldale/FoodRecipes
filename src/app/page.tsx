import dynamic from "next/dynamic";

const LoginPage = dynamic(() => import("@/modules/login/pages/page"));

const Page = () => {
  return <LoginPage />;
};

export default Page;
