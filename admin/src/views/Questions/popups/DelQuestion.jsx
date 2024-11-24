import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DeleteQuestion } from "../../../actions/quiz.action";

import useWindowSize from "../../../components/useWindowSize";

function DelQuestion(props) {
  const {
    open,
    handleClose,
    title = "Delete Question",
    value,
    callBack = () => { },
  } = props;


  const size = useWindowSize();

  const PopupSize = () => {
    switch (size) {
      case "xl":
        return "500px";
      case "lg":
        return "500px";
      case "md":
        return "500px";
      case "sm":
        return "500px";
      case "xs":
        return "98%";
      default:
        return "80%";
    }
  };

  const handleSubmit = async () => {

    await DeleteQuestion(value._id);
    handleClose();
    window.location.reload();
  };

  const DialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        style={{ backgroundColor: "#1E1F2A", color: "#C9E782", border: "none" }}
        onClick={handleClose}
      />
      <Button
        label="Delete"
        icon="pi pi-check"
        style={{ backgroundColor: "#1E1F2A", color: "#C9E782", border: "none", marginLeft: "10px" }}
        onClick={handleSubmit}
      />
    </>
  );

  return (
    <Dialog
      visible={open}
      style={{ width: PopupSize() }}
      header={title}
      modal
      className="p-fluid"
      footer={DialogFooter}
      onHide={handleClose}
    >
      <div className="flex align-items-center justify-content-start">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        <span>
          Are you sure you want to delete the Question{" "}
          <b>
            {value.questionText} ?
          </b>
        </span>
      </div>
    </Dialog>
  );
}

export default DelQuestion;