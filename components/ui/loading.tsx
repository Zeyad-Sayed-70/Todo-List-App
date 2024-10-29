import { LoaderIcon } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center p-8 m-auto w-fit h-fit">
      <LoaderIcon size={30} className="animate-spin" />
    </div>
  );
};

export default Loading;
