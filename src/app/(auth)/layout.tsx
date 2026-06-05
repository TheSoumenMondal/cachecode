import type React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = (props: Props) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-4 md:px-0">{props.children}</div>
    </div>
  );
};

export default layout;
