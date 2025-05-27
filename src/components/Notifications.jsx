import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { TrashIcon, BellIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { formatDistanceToNowStrict } from "date-fns";
import { show } from "../states/alerts";
import { db } from "../../firebase";
import PopupDialog from "./PopupDialog";

function Notifications() {
  const [notificationList, setNotificationList] = useState([]);
  const [isDelete, setDelete] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const ref = collection(db, "Notifications");
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotificationList(data);
    });
    
    return () => unsubscribe();
  }, []);

  const handleDelete = (item) => {
    deleteNotification(item.id)
      .then(() => {
        dispatch(
          show({
            type: "success",
            message: "Notification has been deleted successfully.",
            duration: 3000,
            show: true,
          })
        );
      })
      .catch((err) => {
        console.error(err);
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

  const deleteNotification = async (id) => {
    const docRef = doc(db, "Notifications", id);
    return deleteDoc(docRef);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg">
      <div className="flex justify-between items-center p-4 pb-0">
        <h2 className="text-xl font-inter-bold text-gray-800">Notifications</h2>
        
      </div>
      
      <div className="w-full h-full p-4 flex flex-col">
        <div className="w-full h-full flex flex-col overflow-auto gap-3 my-2">
          {notificationList.length === 0 ? (
            <div className="flex justify-center items-center h-40 text-gray-500 font-inter">
              No notifications available
            </div>
          ) : (
            notificationList.map((notification) => (
              <div
                key={notification.id}
                className="bg-white-100 py-2 min-h-16 rounded-lg border flex flex-row items-center text-black px-4 gap-2"
              >
                <BellIcon className="w-6 text-[#19AF0C]" />
                <div className="flex-1">
                  <h3 className="font-inter">{notification.GBPoint}</h3>
                  <p className="text-sm text-gray-600 font-inter-light">{notification.Message}</p>
                </div>
                <p className="text-sm font-inter-light text-gray-500">
                  {notification.TimeStamp?.toDate
                    ? formatDistanceToNowStrict(notification.TimeStamp.toDate(), {
                        addSuffix: true,
                      })
                    : "Invalid Date"}
                </p>
                <TrashIcon
                  className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => setDelete(notification)}
                />
              </div>
            ))
          )}
        </div>
      </div>
      
      <PopupDialog
        show={!!isDelete}
        close={() => setDelete(null)}
        title="Delete Notification"
        content="Are you sure you want to delete this notification?"
        action1={() => {
          handleDelete(isDelete);
          setDelete(null);
        }}
        action2={() => setDelete(null)}
      />
    </div>
  );
}

export default Notifications;