import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import {
  ArrowRightStartOnRectangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Backdrop } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Sidebar({ screens, screen, setScreen }) {
  const [isLogout, setLogout] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="w-[300px] h-full bg-[#296441F5]/95 text-[#F2f2f2] select-none">
      <div className="flex flex-col h-full w-full">
        <div className="flex h-20 items-center px-2 gap-2 select-none">
          <img src={logo} className="w-20 cursor-pointer" />
          <h1 className="cursor-pointer font-inter-bold text-lg italic w-40 text-center">
            Smart Solid Waste Collection
          </h1>
        </div>
        <div className="flex flex-col w-full flex-1 mt-2 p-4 font-lato gap-2">
          {screens.map((item, index) => {
            return (
              <div
                key={item.label}
                onClick={() => {
                  setScreen(index);
                }}
                className={`flex flex-row h-12 ${
                  screen == index ? "text-white" : "text-white/60"
                } items-center gap-4 cursor-pointer hover:text-white`}
              >
                <div className={`w-[32px] h-[32px] p-1 rounded-full $`}>
                  {item.icon}
                </div>

                <p className={`font-inter-bold text-base`}>{item.label}</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            setLogout(true);
          }}
          className="h-10 w-32 rounded-lg bg-red-800 ml-4 my-6 flex flex-row items-center font-inter-bold justify-between pl-4 pr-2"
        >
          Logout
          <ArrowRightStartOnRectangleIcon className="w-5" />
        </button>
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLogout}
      >
        <div className="w-[350px] h-[180px] bg-[#D9D9D9] rounded-lg flex flex-col p-4 text-[#2f2f2f]">
          <div className="w-full flex flex-row justify-between items-center">
            <h1 className="font-inter-bold text-lg">Logout</h1>
            <div
              onClick={() => {
                setLogout(false);
              }}
              className="p-[2px] bg-red-800 rounded-full cursor-pointer"
            >
              <XMarkIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="pt-4 pb-2">Are you sure you want to logout?</p>
          <div className="flex flex-row justify-between">
            <button
              onClick={() => {
                setLogout(false);
              }}
              className="bg-red-800 w-[150px] h-10 rounded-lg text-white mt-4 self-center text-sm"
            >
              No
            </button>
            <button
              onClick={() => {
                logout();
              }}
              className="bg-[#19AF0C] w-[150px] h-10 rounded-lg text-white mt-4 self-center text-sm"
            >
              Yes
            </button>
          </div>
        </div>
      </Backdrop>
    </div>
  );
}

export default Sidebar;
