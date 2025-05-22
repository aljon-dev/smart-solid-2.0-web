import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { show } from "../states/alerts";
import { useDispatch } from "react-redux";
import { deleteSchedule, updateSchedule } from "../api/Services";
import { Delete, Edit, ArrowUpward, ArrowDownward } from "@mui/icons-material";

function Schedule({ schedules, isAddSched, close, locations }) {
  const dispatch = useDispatch();

  const [isDelete, setIsDeleting] = useState(false);
  const [localSchedules, setLocalSchedules] = useState(schedules?.data || []);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Days of the week in order for sorting
  const dayOrder = {
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7
  };

  useEffect(() => {
    if (schedules?.data) {
      const updatedSchedules = schedules.data.filter(
        (newSched) =>
          !localSchedules.some((localSched) => localSched.id === newSched.id)
      );
      setLocalSchedules((prevSchedules) => [...prevSchedules, ...updatedSchedules]);
    }
  }, [schedules]);

  const handleSort = (field) => {
    const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newOrder);

    const sortedSchedules = [...localSchedules].sort((a, b) => {
      let aValue, bValue;

      if (field === "day") {
        aValue = dayOrder[a.day] || 0;
        bValue = dayOrder[b.day] || 0;
      } else if (field === "time") {
        // Convert time format to comparable format (assuming HH:MM format)
        aValue = a.timeF ? a.timeF.replace(":", "") : "0000";
        bValue = b.timeF ? b.timeF.replace(":", "") : "0000";
      } else if (field === "note") {
        aValue = a.note?.toLowerCase() || "";
        bValue = b.note?.toLowerCase() || "";
      } else if (field === "area") {
        aValue = a.barangay?.toLowerCase() || "";
        bValue = b.barangay?.toLowerCase() || "";
      }

      if (newOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setLocalSchedules(sortedSchedules);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />;
  };

  const handleDelete = async (scheduleId) => {
    if (!scheduleId) {
      console.error("No schedule ID provided");
      return;
    }
    try {
      setIsDeleting(true);
      await deleteSchedule(scheduleId);

      setLocalSchedules((prevSchedules) =>
        prevSchedules.filter((schedule) => schedule.id !== scheduleId)
      );

      dispatch(
        show({
          message: "Schedule Deleted Successfully",
          type: "success",
          duration: 3000,
          show: true,
        })
      );

      if (typeof close === "function") {
        close();
      }
    } catch (error) {
      console.error("Delete Error", error);
      dispatch(
        show({
          message: "Failed to delete schedule. Please try again.",
          type: "error",
          duration: 3000,
          show: true,
        })
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRowClick = (schedule) => {
    setSelectedSchedule(schedule);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setSelectedSchedule(null);
    setDialogOpen(false);
  };

  const handleUpdate = async () => {
    if (!selectedSchedule) {
      console.error("No schedule selected for update.");
      return;
    }

    try {
      console.log("Updating Schedule:", selectedSchedule);
      const updatedData = await updateSchedule(selectedSchedule);

      setLocalSchedules((prevSchedules) =>
        prevSchedules.map((sched) =>
          sched.id === selectedSchedule.id ? updatedData : sched
        )
      );

      dispatch(
        show({
          message: "Schedule Updated Successfully",
          type: "success",
          duration: 3000,
          show: true,
        })
      );

      handleDialogClose();
    } catch (error) {
      console.error("Update Error:", error);
      dispatch(
        show({
          message: "Failed to update schedule. Please try again.",
          type: "error",
          duration: 3000,
          show: true,
        })
      );
    }
  };

  return (
    <div className="w-full">
      {/* Sorting Controls */}
      <div className="mb-4 flex gap-4 items-center">
        <FormControl size="small" style={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => {
              if (e.target.value) {
                handleSort(e.target.value);
              }
            }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="time">Time</MenuItem>
            <MenuItem value="note">Note</MenuItem>
            <MenuItem value="area">Area</MenuItem>
          </Select>
        </FormControl>

        {sortBy && (
          <div className="text-sm text-gray-600">
            Sorted by {sortBy} ({sortOrder === "asc" ? "ascending" : "descending"})
          </div>
        )}
      </div>

      <div className="relative overflow-scroll shadow-md rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-100 text-black">
            <tr>
              <th
                className="px-4 py-3 w-40 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("note")}
              >
                <div className="flex items-center gap-1">
                  NOTE
                  {getSortIcon("note")}
                </div>
              </th>
              <th
                className="px-4 py-3 w-96 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("area")}
              >
                <div className="flex items-center gap-1">
                  AREA
                  {getSortIcon("area")}
                </div>
              </th>
              <th
                className="px-4 py-3 w-32 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("day")}
              >
                <div className="flex items-center gap-1">
                  DAY
                  {getSortIcon("day")}
                </div>
              </th>
              <th
                className="px-4 py-3 w-32 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort("time")}
              >
                <div className="flex items-center gap-1">
                  TIME
                  {getSortIcon("time")}
                </div>
              </th>
              <th className="px-4 py-3 w-32">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="font-semibold text-black divide-y divide-gray-200">
            {localSchedules.map((schedule) => (
              <tr
                key={schedule.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(schedule)}
              >
                <td className="px-4 py-3">
                  <div className="w-40 truncate" title={schedule.note}>
                    {schedule.note}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="w-96 truncate" title={schedule.barangay}>
                    {schedule.barangay}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="w-20 truncate" title={schedule.day}>
                    {schedule.day}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="w-30 truncate">
                    {schedule.timeF} - {schedule.timeT}
                  </div>
                </td>
                <td className="px-4 py-3 flex flex-row">
                  <Button
                    variant="text"
                    startIcon={<Delete />}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click event
                      handleDelete(schedule.id);
                    }}
                    disabled={isDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog for viewing and editing schedule */}
      {selectedSchedule && (
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Edit Schedule</DialogTitle>
          <DialogContent>
            <TextField
              label="Note"
              fullWidth
              value={selectedSchedule.note}
              onChange={(e) =>
                setSelectedSchedule({ ...selectedSchedule, note: e.target.value })
              }
              margin="normal"
            />
            <TextField
              label="Area"
              fullWidth
              value={selectedSchedule.barangay}
              onChange={(e) =>
                setSelectedSchedule({ ...selectedSchedule, barangay: e.target.value })
              }
              margin="normal"
            />

            <div className="flex flex-row gap-3">
              <TextField
                label="Time From"
                value={selectedSchedule.timeF}
                onChange={(e) =>
                  setSelectedSchedule({ ...selectedSchedule, timeF: e.target.value })
                }
                margin="normal"
              />
              <TextField
                label="Time To"
                value={selectedSchedule.timeT}
                onChange={(e) =>
                  setSelectedSchedule({ ...selectedSchedule, timeT: e.target.value })
                }
                margin="normal"
              />

              <select
                name="day"
                value={selectedSchedule.day}
                onChange={(e) =>
                  setSelectedSchedule({ ...selectedSchedule, day: e.target.value })}
                className="form-select"
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleUpdate} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}

export default Schedule;