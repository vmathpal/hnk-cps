import React, { useEffect } from "react";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
export const TimeOutPopUp = (navigate) => {
  // const navigate = useNavigate();
 swal({
 title: "Time Out",
 text: "You have been logged out. Please log in again",
 icon: "error",
 buttons: true,
 dangerMode: true,
 allowOutsideClick: false, // Prevents closing when clicking outside of the dialog
 allowEscapeKey: false // Prevents closing when pressing the Escape key
})
 .then((willDelete) => {
 if (willDelete) {
 navigate("/sign-in");
  }
  });
  };

