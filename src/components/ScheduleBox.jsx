import React, { useEffect, useReducer, useState } from "react";
import { ListItemIcon, Menu, MenuItem, MenuList } from "@mui/material";
import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { addSchedule, deleteSchedule } from "../api/Services";
import { show } from "../states/alerts";
import { useDispatch } from "react-redux";
import { format } from "date-fns-tz";
import ScheduleForm from "./ScheduleForm";
import UpdateScheduleForm from "./UpdateScheduleForm";

function ScheduleBox({
  location,
  schedules,
  select,
  remove,
  id,
  update,
  brgys,
  brgy,
  key,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [onAdd, setAdd] = useState(false);
  const [onDelete, setDelete] = useState(false);
  const [selected, setSelected] = useState([]);
  const [scheds, setScheds] = useState([]);
  const [onUpdate, setUpdate] = useState(false);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();

  const [form, updateForm] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      area: "",
      day: "",
      timeF: "",
      timeT: "",
      brgy: brgy["name"],
      "brgy-id": brgy["brgy-id"],
      location: location["name"],
      locId: location["locId"],
    }
  );

  useEffect(() => {
    if (schedules) {
      var temp = schedules.map((s) => {
        var t = s;
        t["selected"] = false;

        return t;
      });

      setScheds(temp);
    }
  }, [schedules]);

  useEffect(() => {
    var temp = [];
    scheds.map((item) => {
      if (item.selected) {
        temp.push(item.id);
      }
    });

    setSelected(temp);
  }, [scheds]);

  const headers = [
    {
      name: "Area",
      width: 100,
    },
    {
      name: "Day",
      width: 50,
    },
    {
      name: "Time",
      width: 50,
    },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    var newForm = form;
    newForm["day"] = e.target[1].value;

    addSchedule(newForm)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Schedule has been added successfully.",
            duration: 3000,
            show: true,
          })
        );
        handleReset();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = async () => {
    await deleteSchedule(selected)
      .then((_) => {
        setSelected([]);
        setDelete(false);
        dispatch(
          show({
            type: "success",
            message: "Schedule has been deleted successfully.",
            duration: 3000,
            show: true,
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleReset = () => {
    Object.keys(form).forEach((inputKey) => {
      if (inputKey != "location") {
        updateForm({
          [inputKey]: "",
        });
      }
    });
  };

  return (
    <div
      key={key}
      className="w-full h-[400px] flex flex-col py-2 gap-1 overflow-hidden"
    >
      <div className="w-full min-h-12 h-12 bg-[#287A2C] flex items-center justify-between pl-4 pr-2">
        <h1 className="font-inter-bold text-lg italic">{brgy["name"]}</h1>
        <EllipsisVerticalIcon
          onClick={handleClick}
          className="w-8 cursor-pointer select-none"
        />
      </div>
      <div className="w-full min-h-8 h-8 bg-[#376B39] flex flex-row items-center px-4">
        {headers.map((item, index) => {
          return (
            <p
              key={index}
              className={`${
                index == 0 ? "w-1/2" : "w-1/4"
              } text-sm uppercase font-inter ml-2`}
            >
              {item.name}
            </p>
          );
        })}
      </div>
      <div className="flex flex-col w-full h-full p-2  gap-1 overflow-auto flex-1">
        {scheds.map((item, index) => {
          return (
            <>
              {onUpdate && selected.includes(item.id) ? (
                <UpdateScheduleForm
                  brgy={brgy}
                  location={location}
                  item={item}
                  onClose={() => {
                    setSelected([]);
                  }}
                />
              ) : (
                <ScheduleForm
                  key={item.id}
                  item={item}
                  index={index}
                  onDelete={onDelete}
                  scheds={scheds}
                  setScheds={(temp) => {
                    setScheds(temp);
                  }}
                  onUpdate={onUpdate}
                  selected={selected}
                />
              )}
            </>
          );
        })}
        {onAdd && (
          <form
            onSubmit={handleSubmit}
            onReset={handleReset}
            className="bg-[#287A2C] w-full rounded-md flex flex-col py-2 px-1 my-2"
          >
            <div className="flex flex-row gap-1 text-black text-sm w-full">
              <input
                required
                placeholder="Input area..."
                value={form.area}
                onChange={(e) => {
                  updateForm({ area: e.target.value });
                }}
                className="bg-[#D9D9D9] px-1 h-8 w-1/2 rounded-sm focus:outline-none"
              />
              <select
                required
                value={form.day}
                onChange={(e) => {
                  updateForm({ day: e.target.value });
                }}
                className="w-1/4 h-8 rounded-sm bg-[#D9D9D9] focus:outline-none"
              >
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ].map((item) => {
                  return (
                    <option key={item} value={item} className="uppercase">
                      {item}
                    </option>
                  );
                })}
              </select>
              <div className="flex flex-col w-1/4 gap-1">
                <input
                  required
                  type="time"
                  value={form.timeF}
                  className="bg-[#D9D9D9] h-8 rounded-sm"
                  onChange={(e) => {
                    console.log(e.target.value);
                    updateForm({ timeF: e.target.value });
                  }}
                />
                <input
                  required
                  type="time"
                  value={form.timeT}
                  className="bg-[#D9D9D9] h-8 rounded-sm"
                  onChange={(e) => {
                    updateForm({ timeT: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row w-full justify-end h-14 items-end pb-2 px-2 gap-2 text-sm">
              <button
                type="submit"
                className="bg-[#19AF0C] w-[100px] h-8 rounded-md"
              >
                Add
              </button>
              <button
                type="reset"
                onClick={() => {
                  setAdd(false);
                }}
                className="bg-red-800 w-[100px] h-8 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      {onDelete && (
        <div className="flex flex-row text-sm h-12 items-center justify-between mx-2 rounded-md px-2 bg-[#287A2C]">
          <p>
            {selected.length < 1
              ? "Select an item to delete."
              : `Delete ${selected.length} item(s)?`}
          </p>
          <div className="flex flex-row gap-2">
            <button
              onClick={() => {
                setDelete(false);
                setSelected([]);
              }}
              className="bg-[#19AF0C] w-[100px] h-8 rounded-md"
            >
              Cancel
            </button>
            <button
              disabled={selected.length < 1}
              onClick={() => {
                handleDelete();
              }}
              className="bg-red-800 w-[100px] h-8 rounded-md disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        </div>
      )}
      {onUpdate && (
        <div className="flex flex-row text-sm h-12 items-center justify-between mx-2 rounded-md px-2 bg-[#287A2C]">
          <p>Select an item to update.</p>
          <div className="flex flex-row gap-2">
            <button
              onClick={() => {
                setUpdate(false);
                setSelected([]);
              }}
              className="bg-[#19AF0C] w-[100px] h-8 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        dense="true"
        onClose={() => {
          setAnchorEl(null);
        }}
        className="p-0"
      >
        <MenuList className="focus:outline-none p-0 ">
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setAdd(true);
              setDelete(false);
              setUpdate(false);
            }}
          >
            <ListItemIcon>
              <PlusIcon className="w-4" />
            </ListItemIcon>
            <p className="text-sm">Add Schedule</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setUpdate(true);
              setAdd(false);
              setDelete(false);
            }}
          >
            <ListItemIcon>
              <PencilSquareIcon className="w-4" />
            </ListItemIcon>
            <p className="text-sm">Update Schedule</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setDelete(true);
              setUpdate(false);
              setAdd(false);
            }}
          >
            <ListItemIcon>
              <TrashIcon className="w-4" />
            </ListItemIcon>
            <p className="text-sm">Delete Schedule</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              update(id, brgy, brgys);
              setDelete(false);
              setAdd(false);
              setUpdate(false);
            }}
          >
            <ListItemIcon>
              <PencilSquareIcon className="w-4" />
            </ListItemIcon>
            <p className="text-sm">Update Barangay</p>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              remove(id, brgy);
              setAdd(false);
              setDelete(false);
              setUpdate(false);
            }}
          >
            <ListItemIcon>
              <TrashIcon className="w-4 text-rose-600" />
            </ListItemIcon>
            <p className="text-sm text-rose-600">Delete Barangay</p>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}

export default ScheduleBox;
