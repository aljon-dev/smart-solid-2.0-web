import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Backdrop } from "@mui/material";
import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import FeedbackPreview from "./FeedbackPreview";
import { show } from "../states/alerts";
import { useDispatch } from "react-redux";
import PopupDialog from "./PopupDialog";
import { deleteFeedback } from "../api/Services";

function Feedback({ feedbacks }) {
  const [preview, setPreview] = useState(null);
  const [isDelete, setDelete] = useState(null);
  const dispatch = useDispatch();

  const columns = useMemo(() => [
    {
      name: "#",
      cell: (row, index) => {
        return <p className="text-sm">{row.no}</p>;
      },
      width: "80px",
    },
    {
      name: "Name",
      cell: (row) => <p className="text-sm">{row.Name}</p>,
      width: "350px",
    },
    {
      name: "Email",
      selector: (row) => (row.Email === "" ? "N/A" : row.Email),
      width: "350px",
    },
    {
      name: "Location",
      cell: (row) => (
        <p className="text-sm">{row.location === "" ? "N/A" : row.location}</p>
      ),
      // width: "50%",
      wrap: true,
    },
    {
      name: "Feedback",
      cell: (row) => (
        <div className="flex flex-row gap-4 text-white text-center">
          <p
            onClick={() => {
              setPreview(row);
            }}
            className="text-xs cursor-pointer p-2 bg-[#19AF0C] w-14 rounded-md"
          >
            View
          </p>
          <p
            onClick={() => {
              setDelete(row);
            }}
            className="text-xs cursor-pointer p-2 bg-red-800 w-14 rounded-md"
          >
            Delete
          </p>
        </div>
      ),
      width: "200px",
    },
  ]);

  const handleDelete = (item) => {
    deleteFeedback(item.id)
      .then((_) => {
        dispatch(
          show({
            type: "success",
            message: "Feedback has been deleted successfully.",
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
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full bg-[#ffffff] rounded-lg">
        <DataTable
          className="font-inter h-full overflow-hidden rounded-lg text-[#2f2f2f]"
          columns={columns}
          data={feedbacks["data"]}
          customStyles={{
            rows: {
              style: {
                color: "#607d8b",
                "font-family": "Inter",
                "font-size": "14px",
              },
            },
            headRow: {
              style: {
                "font-family": "Inter Bold",
                backgroundColor: "#3CA040",
              },
            },
            headCells: {
              style: {
                color: "#F2F2F2",
                "font-size": "16px",
                "font-weight": "bold",
              },
            },
          }}
          persistTableHead
          pagination
          fixedHeader
          allowOverflow
          noDataComponent={
            <div className="h-[400px] w-full flex items-center justify-center bg-[#D9D9D9]">
              <p className="bg-transparent text-[#2f2f2f] font-inter text-sm">
                No feedback yet.
              </p>
            </div>
          }
        />
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={!!preview}
        >
          {!!preview && (
            <FeedbackPreview
              feedback={preview}
              close={() => {
                setPreview(null);
              }}
            />
          )}
        </Backdrop>
        <PopupDialog
          show={!!isDelete}
          close={() => {
            setDelete(null);
          }}
          title="Delete Feedback"
          content="Are you sure you want to delete this feedback?"
          action1={() => {
            handleDelete(isDelete);
            setDelete(null);
          }}
          action2={() => {
            setDelete(null);
          }}
        />
      </div>
    </div>
  );
}

export default Feedback;
