import {
  EllipsisVerticalIcon,
  MegaphoneIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  Backdrop,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import { formatDistanceToNowStrict } from "date-fns";
import React, { useState } from "react";
import AnnouncementForm from "./AnnouncementForm";
import PopupDialog from "./PopupDialog";
import { deleteAnnouncement } from "../api/Services";
import { show } from "../states/alerts";
import { useDispatch } from "react-redux";

function Announcement({ announcements }) {
  const [isCreate, setCreate] = useState(false);
  const [isUpdate, setUpdate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isDelete, setDelete] = useState(null);

  const dispatch = useDispatch();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = (item) => {
    deleteAnnouncement(item.id)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Announcement has been deleted successfully.",
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
    <div className="w-full h-full bg-[#ffffff] rounded-lg">
      <div className=" flex justify-end pr-10">
        <button
          onClick={() => {
            setCreate(true);
          }}
          className="w-[150px] bg-[#19AF0C] mt-5 h-10 rounded-lg font-inter-bold justify-end"
        >
          Create
        </button>

      </div>
      <div className="w-full h-full p-4 flex flex-row">

        <div className="flex-1 px-4 flex flex-col overflow-hidden">

          <div className="w-full h-full flex flex-col overflow-auto gap-3 my-2">
            {announcements["data"].map((item) => {
              return (
                <div
                  key={item.id}
                  className=" bg-[#19AF0C] py-2 min-h-16 rounded-lg flex flex-row items-center px-4 gap-2"
                >
                  <MegaphoneIcon className="w-6" />
                  <h1 className="flex-1 font-inter">{item.announcement}</h1>
                  <p className="text-sm font-inter-light">
                    {formatDistanceToNowStrict(item.postedAt.toDate(), {
                      addSuffix: true,
                    })}
                  </p>
                  <EllipsisVerticalIcon
                    className="w-6 cursor-pointer select-none"
                    onClick={(e) => {
                      handleClick(e);
                      setSelected(item);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className=" flex flex-row  ">

        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isCreate || !!isUpdate}
      >
        {(isCreate || !!isUpdate) && (
          <AnnouncementForm
            update={isUpdate}
            close={() => {
              setCreate(false);
              setUpdate(null);
            }}
          />
        )}
      </Backdrop>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        dense={"true"}
        onClose={() => {
          setAnchorEl(null);
        }}
        className="p-0"
      >
        <MenuList className="focus:outline-none p-0 ">
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setUpdate(selected);
            }}
          >
            <ListItemIcon>
              <PencilSquareIcon className="w-4" />
            </ListItemIcon>
            <p className="text-sm">Update</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setDelete(selected);
            }}
          >
            <ListItemIcon>
              <TrashIcon className="w-4" />
            </ListItemIcon>
            <p className="text-sm">Delete</p>
          </MenuItem>
        </MenuList>
      </Menu>
      <PopupDialog
        show={!!isDelete}
        close={() => {
          setDelete(null);
        }}
        title="Delete Announcement"
        content="Are you sure you want to delete this announcement?"
        action1={() => {
          handleDelete(isDelete);
          setDelete(null);
        }}
        action2={() => {
          setDelete(null);
        }}
      />
    </div>
  );
}

export default Announcement;
