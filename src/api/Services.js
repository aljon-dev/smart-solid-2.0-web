import {
  doc,
  collection,
  setDoc,
  addDoc,
  Timestamp,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  getDocs,
  where,
  query,
  orderBy,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { db } from "../../firebase";

const getUser = (userId) => {
  return getDoc(doc(db, "Users", userId));
};

const addAnnouncement = (message) => {
  return setDoc(doc(collection(db, "Announcements")), {
    announcement: message,
    postedAt: Timestamp.now(),
  });
};

const updateAnnouncement = (id, message) => {
  const ref = doc(db, "Announcements", id);

  return updateDoc(ref, { announcement: message });
};

const deleteAnnouncement = (id) => {
  return deleteDoc(doc(db, "Announcements", id));
};

const addSchedule = (form) => {
  var sched = form;
  sched["addedAt"] = Timestamp.now();
  return setDoc(doc(collection(db, "Schedules")), sched);
};

const deleteSchedule = (scheds) => {
  return runTransaction(db, async (transaction) => {
    scheds.map(async (item) => {
      const ref = doc(db, "Schedules", item);

      transaction.delete(ref);
    });
  });
};

const getAnnouncements = () => {
  const ref = collection(db, "Announcements");

  return ref;
};

const getSchedules = () => {
  const ref = collection(db, "Schedules");

  return query(ref, orderBy("addedAt", "asc"));
};

const getFeedbacks = () => {
  const ref = collection(db, "Feedbacks");

  return query(ref, orderBy("postedAt", "asc"));
};

const deleteFeedback = (id) => {
  return deleteDoc(doc(db, "Feedbacks", id));
};

const addLocation = (name) => {
  return setDoc(doc(collection(db, "Locations")), {
    name: name,
    brgy: [],
    locId: String(Date.now()).slice(5, 13),
    dateAdded: Timestamp.now(),
  });
};

const getLocations = () => {
  const ref = collection(db, "Locations");

  return query(ref, orderBy("dateAdded", "asc"));
};

const deleteLocation = (id) => {
  return deleteDoc(doc(db, "Locations", id));
};

const updateLocation = (id, location) => {
  const ref = doc(db, "Locations", id);

  return updateDoc(ref, { name: location });
};

const addBrgy = (id, brgy) => {
  const ref = doc(db, "Locations", id);
  const brgy_id = String(Date.now()).slice(5, 13);

  return updateDoc(ref, {
    brgy: arrayUnion({
      name: brgy,
      "brgy-id": brgy_id,
    }),
  });
};

const onSetNote = (id, note) => {
  const ref = doc(db, "Locations", id);

  return updateDoc(ref, {
    note,
  });
};

const removeBrgy = (id, brgy) => {
  const ref = doc(db, "Locations", id);

  return updateDoc(ref, { brgy: arrayRemove(brgy) });
};

const updateBrgy = (id, brgy) => {
  const ref = doc(db, "Locations", id);

  return updateDoc(ref, { brgy: brgy });
};

const updateSchedule = (id, schedule) => {
  const ref = doc(db, "Schedules", id);

  return updateDoc(ref, schedule);
};

const updateFeedback = (id, status) => {
  const ref = doc(db, "Feedbacks", id);

  return updateDoc(ref, { status: status });
};

export {
  getUser,
  addAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  onSnapshot,
  addSchedule,
  getSchedules,
  getFeedbacks,
  deleteSchedule,
  deleteFeedback,
  addLocation,
  getLocations,
  addBrgy,
  removeBrgy,
  updateBrgy,
  deleteLocation,
  updateLocation,
  updateSchedule,
  updateFeedback,
  onSetNote,
};
