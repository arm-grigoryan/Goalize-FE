"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError } from "@/app/store/slices/errorSlice";
import { RootState } from "@/app/store/store";
import { ErrorBanner } from "@/components/ErrorBanner/ErrorBanner";
import { PopupModal } from "@/entities/PopupModal/PopupModal";

export const GlobalErrorDisplay: React.FC = () => {
  const dispatch = useDispatch();
  const { errorType, message, visible } = useSelector(
    (state: RootState) => state.error,
  );

  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (visible && errorType === "5xx") {
      setShowBanner(true);
      setShowModal(false);
    } else if (visible && errorType === "403") {
      setShowBanner(false);
      setShowModal(true);
    } else {
      setShowBanner(false);
      setShowModal(false);
    }
  }, [visible, errorType]);

  const handleBannerClose = () => {
    setShowBanner(false);
    dispatch(clearError());
  };

  const handleModalClose = () => {
    setShowModal(false);
    dispatch(clearError());
  };

  return (
    <>
      <ErrorBanner
        visible={showBanner}
        message={message}
        onClose={handleBannerClose}
      />

      <PopupModal
        open={showModal}
        onClose={handleModalClose}
        title="Action Not Allowed"
        description={message || "You are not allowed to perform this action"}
        buttonContent="OK"
      />
    </>
  );
};
