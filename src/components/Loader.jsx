import React from "react";
import { CircularProgress } from "@mui/material";

function Loader({ message }) {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <CircularProgress color="inherit" className="text-white" />
        <h1 className="font-arimo font-bold text-md text-white">{message}</h1>
      </div>
    </div>
  );
}

export default Loader;
