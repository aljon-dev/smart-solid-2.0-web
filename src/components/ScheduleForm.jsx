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
    <div className="flex flex-row text-sm font-inter-light">
      <p className="w-1/2 uppercase mr-2">{item.area}</p>
      <p className="w-1/4 uppercase">{item.day}</p>
      <p className="w-1/4 flex flex-row justify-between items-center">
        {`${format(`Tue Aug 03 2021 ${item.timeF}:00 UTC+8`, "ha")} - ${format(
          `Tue Aug 03 2021 ${item.timeT}:00 UTC+8`,
          "ha"
        )}`}
        {(onDelete || onUpdate) && (
          <span>
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
