import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import {ReactNode} from "react";
import Steps from "@/components/Steps";

const Layout = ({children}: { children: ReactNode }) => {
  return (
    <MaxWidthWrapper className='flex-1 flex flex-col'>
      <Steps/>
      {children}
    </MaxWidthWrapper>
  )
}

export default Layout