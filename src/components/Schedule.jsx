import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

import { show } from "../states/alerts";
import { useDispatch } from "react-redux";
import { deleteSchedule, updateSchedule } from "../api/Services";
import { Delete, Edit } from "@mui/icons-material";

function Schedule({ schedules, isAddSched, close, locations }) {
  const dispatch = useDispatch();

  const [isDelete, setIsDeleting] = useState(false);
  const [localSchedules, setLocalSchedules] = useState(schedules?.data || []);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (schedules?.data) {
      const updatedSchedules = schedules.data.filter(
        (newSched) =>
          !localSchedules.some((localSched) => localSched.id === newSched.id)
      );
      setLocalSchedules((prevSchedules) => [...prevSchedules, ...updatedSchedules]);
    }
  }, [schedules]);

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
      <div className="relative overflow-scroll shadow-md rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-gray-100 text-black">
            <tr>
              <th className="px-4 py-3 w-40">NOTE</th>
              <th className="px-4 py-3 w-96">AREA</th>
              <th className="px-4 py-3 w-32">Day</th>
              <th className="px-4 py-3 w-32">Time</th>
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

         <div className="flex   flex-row gap-3"> 


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
        className="form-select" >                 
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
