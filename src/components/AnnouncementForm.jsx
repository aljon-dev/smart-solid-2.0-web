import React, { useState } from "react";
import { show } from "../states/alerts";
import { useDispatch } from "react-redux";
import { addAnnouncement, updateAnnouncement } from "../api/Services";
import { XMarkIcon } from "@heroicons/react/24/outline";

function AnnouncementForm({ update, close }) {
  const [message, setMessage] = useState(update ? update["announcement"] : "");

  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (update) {
      updateAnnouncement(update["id"], message)
        .then((_) => {
          setMessage("");
          close();
          dispatch(
            show({
              type: "success",
              message: "Announcement has been updated successfully.",
              duration: 3000,
              show: true,
            })
          );
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            show({
              type: "error",
              message: "Something went wrong.",
              duration: 3000,
              show: true,
            })
          );
        });
      return;
    }

    addAnnouncement(message)
      .then((_) => {
        setMessage("");
        close();
        dispatch(
          show({
            type: "success",
            message: "Announcement has been posted successfully.",
            duration: 3000,
            show: true,
          })
        );
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          show({
            type: "error",
            message: "Something went wrong.",
            duration: 3000,
            show: true,
          })
        );
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[400px] h-[350px] bg-[#A5D8B6] rounded-lg flex flex-col p-4 text-[#2f2f2f]"
    >
      <div className="w-full flex flex-row justify-between items-center">
        <h1 className="font-inter-bold text-lg">
          {update ? "Update Announcement" : "Create Announcement"}
        </h1>
        <div
          onClick={() => {
            close();
          }}
          className="p-[2px] bg-red-800 rounded-full cursor-pointer"
        >
          <XMarkIcon className="w-4 h-4 text-white" />
        </div>
      </div>
      <textarea
        rows={8}
        required
        value={message}
        placeholder="Input message..."
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        className="mt-2 bg-[#E9E9E9]/60 rounded-md resize-none focus:outline-none p-4 placeholder:text-[#2f2f2f]/80"
      />
      <button
        type="submit"
        className="bg-[#19AF0C] w-[150px] h-9 rounded-lg text-white mt-4 self-center text-sm"
      >
        {update ? "Update" : "Post"}
      </button>
    </form>
  );
}

export default AnnouncementForm;
