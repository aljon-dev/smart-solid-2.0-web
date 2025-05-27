import { format } from "date-fns";
import React from "react";

function ScheduleForm({
  item,
  onDelete,
  scheds,
  setScheds,
  index,
  onUpdate,
  selected,
}) {
  return (
    <div className="flex flex-row text-sm font-inter-light py-1">
      <p className="w-[60%] uppercase mr-2 p-4 bg-[#5da65f] shadow-lg rounded-md">
        {item.area}
      </p>
      {/* <p className="w-1/4 uppercase">{item.day}</p> */}
      <p className="w-[40%] flex flex-row justify-between items-center p-4 bg-[#5da65f] shadow-lg rounded-md">
        {`${format(`Tue Aug 03 2021 ${item.timeF}:00 UTC+8`, "ha")} - ${format(
          `Tue Aug 03 2021 ${item.timeT}:00 UTC+8`,
          "ha"
        )}`}
        {(onDelete || onUpdate) && (
          <span className="mr-4">
            <input
              type="checkbox"
              className=""
              disabled={onDelete ? false : selected.length > 0}
              onChange={(e) => {
                var temp = [...scheds];
                temp[index].selected = e.target.checked;
                setScheds(temp);
              }}
            />
          </span>
        )}
      </p>
    </div>
  );
}

export default ScheduleForm;
