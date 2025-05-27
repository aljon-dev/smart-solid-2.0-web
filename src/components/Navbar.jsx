import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from "@mui/material";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";

function Navbar({ screen, index }) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    note: "",
    barangay: "",
    day: "",
    timeF: "",
    timeT: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await addSchedule(form);
      setOpen(false);
      setForm({
        note: "",
        barangay: "",
        day: "",
        timeF: "",
        timeT: "",
      }); 

    } catch (error) {
      console.error("Error adding schedule:", error);
      alert("Failed to add schedule. Please try again.");
    }
  };

  const addSchedule = async (form) => {
    const sched = { ...form, addedAt: Timestamp.now() };
    const scheduleRef = doc(collection(db, "Schedules"));
    return await setDoc(scheduleRef, sched);
  };

  return (
    <div className="relative w-full min-h-14 h-14 flex flex-row bg-[#296441F5]/95 rounded-lg items-center justify-center">
      <h1 className="font-inter-bold text-[#F2F2F2] text-lg">{screen["header"]}</h1>
      {index === 2 && (
        <div className="absolute flex flex-row right-4 gap-2">
          <button
            onClick={handleOpen}
            className="px-4 bg-[#19AF0C] py-2 rounded-md font-inter-bold text-xs"
          >
            Add Schedule
          </button>
        </div>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Schedule Table</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="note"
            label="Note"
            value={form.note}
            onChange={handleChange}
            type="text"
            fullWidth
          />

          <TextField
            margin="dense"
            name="barangay"
            label="Barangay"
            value={form.barangay}
            onChange={handleChange}
            type="text"
            fullWidth
          />

          <div className="flex flex-row gap-4">
            <TextField
              margin="dense"
              name="timeF"
              label="Time Start"
              value={form.timeF}
              type="time"
              onChange={handleChange}
            />

            <TextField
              margin="dense"
              name="timeT"
              label="Time Finish"
              value={form.timeT}
              type="time"
              onChange={handleChange}
            />

            <select
              name="day"
              value={form.day}
              onChange={handleChange}
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
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Navbar;