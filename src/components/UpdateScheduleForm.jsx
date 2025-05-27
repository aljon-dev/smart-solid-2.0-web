import React, { useEffect, useReducer } from "react";
import { show } from "../states/alerts";
import { useDispatch } from "react-redux";
import { updateSchedule } from "../api/Services";

function UpdateScheduleForm({ item, brgy, location, onClose }) {
  const [form, updateForm] = useReducer(
    (prev, next) => {
      return { ...prev, ...next };
    },
    {
      area: item["area"],
      day: item["day"],
      timeF: item["timeF"],
      timeT: item["timeT"],
      brgy: brgy["name"],
      "brgy-id": brgy["brgy-id"],
      location: location["name"],
      locId: location["locId"],
    }
  );

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    var newForm = form;
    newForm["day"] = e.target[1].value;

    updateSchedule(item.id, newForm)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Schedule has been updated successfully.",
            duration: 3000,
            show: true,
          })
        );
        handleReset();
      })
      .catch((err) => {
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
        {/* <select
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
        </select> */}
        <div className="flex flex-col w-1/4 gap-1">
          <input
            required
            type="time"
            value={form.timeF}
            className="bg-[#D9D9D9] h-8 rounded-sm"
            onChange={(e) => {
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
        <button type="submit" className="bg-[#19AF0C] w-[100px] h-8 rounded-md">
          Update
        </button>
        <button
          type="reset"
          onClick={onClose}
          className="bg-red-800 w-[100px] h-8 rounded-md"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default UpdateScheduleForm;
