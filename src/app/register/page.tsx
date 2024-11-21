import dynamic from "next/dynamic";

const RegisterPage = dynamic(() => import("@/modules/register/pages/page"));

const Page = () => {
  return <RegisterPage />;
};

export default Page;
