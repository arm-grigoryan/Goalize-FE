"use client";
import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./UpdateTeamPopUp.module.css";
import Image from "next/image";
import editIcon from "../../assets/pngs/editIcon.svg";
import teamLogoFallback from "../../assets/pngs/teamLogo.png";
import leftArrow from "../../assets/pngs/leftArrow.svg";
import teamIcon from "../../assets/pngs/teamIcon.svg";
import abbreviationIcon from "../../assets/pngs/abbreviation.svg";
import Button from "@/shared/Button";
import { useUpdateTeamMutation, useGetTeamInfoQuery, useGetUserInfoQuery } from "@/app/store/services/api";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import PlayerInvitationCard from "@/entities/PlayerInvitationCard";
import { Loader } from "@/shared/Loader/Loader";

type UpdateTeamFormData = {
  Name: string;
  Abbreviation: string;
};

export interface IUpdateTeamPopUpProps {
  open: boolean;
  onClose: () => void;
  teamId: number;
  initialName: string;
  initialAbbreviation: string;
  initialLogoUrl?: string | null;
}

const getCroppedImg = (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("No canvas context"));
        return;
      }
      ctx.beginPath();
      ctx.arc(
        pixelCrop.width / 2,
        pixelCrop.height / 2,
        Math.min(pixelCrop.width, pixelCrop.height) / 2,
        0,
        Math.PI * 2,
      );
      ctx.clip();
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      }, "image/png");
    });
    image.addEventListener("error", reject);
    image.src = imageSrc;
  });
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const UpdateTeamPopUp: React.FC<IUpdateTeamPopUpProps> = ({
  open,
  onClose,
  teamId,
  initialName,
  initialAbbreviation,
  initialLogoUrl,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [updateTeam, { isLoading: isSubmitting }] = useUpdateTeamMutation();
  const { refetch: refetchTeamInfo } = useGetTeamInfoQuery(teamId);
  const { refetch: refetchUserInfo } = useGetUserInfoQuery();

  const resolvedLogoSrc =
    initialLogoUrl && isValidUrl(initialLogoUrl)
      ? initialLogoUrl
      : teamLogoFallback;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<UpdateTeamFormData>({
    mode: "onChange",
    defaultValues: {
      Name: initialName,
      Abbreviation: initialAbbreviation,
    },
  });

  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

  const handleClose = () => {
    reset({ Name: initialName, Abbreviation: initialAbbreviation });
    setLogoFile(null);
    setLogoPreview(null);
    setLogoError(null);
    setIsDragOver(false);
    setSubmitError(null);
    setShowCropper(false);
    setImageSrc(null);
    setShowSuccessModal(false);
    onClose();
  };

  const applyLogoFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setLogoError("Only PNG, JPG, or JPEG files are allowed.");
      return;
    }
    setLogoError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyLogoFile(file);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyLogoFile(file);
  };

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const file = new File([blob], "logo.png", { type: "image/png" });
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(blob));
      setShowCropper(false);
      setImageSrc(null);
    } catch {
      setLogoError("Failed to crop image. Please try again.");
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const abbrevRegister = register("Abbreviation", {
    required: "Abbreviation is required.",
    pattern: {
      value: /^[A-Z]{3}$/,
      message: "Abbreviation must contain exactly 3 Latin letters.",
    },
  });

  const onSubmit: SubmitHandler<UpdateTeamFormData> = async (data) => {
    setSubmitError(null);

    const formData = new FormData();
    formData.append("Name", data.Name.trim());
    formData.append("Abbreviation", data.Abbreviation);
    if (logoFile) {
      formData.append("Logo", logoFile);
    }

    try {
      await updateTeam({ teamId, formData }).unwrap();
      refetchTeamInfo();
      refetchUserInfo();
      setShowSuccessModal(true);
    } catch (error) {
      const errorData = error as { data?: { errorMessage?: string } };
      setSubmitError(
        errorData?.data?.errorMessage || "Failed to update team. Please try again."
      );
    }
  };

  if (!open && !isSubmitting && !showSuccessModal) return null;

  if (isSubmitting) return <Loader />;

  if (showSuccessModal) {
    return (
      <PlayerInvitationCard
        onCancelButtonClick={handleClose}
        title="Team Updated"
        description="Your team has been updated successfully!"
        cancelButtonText="Close"
      />
    );
  }

  return (
    <>
      <div className={styles.overlay} onClick={handleClose} />
      <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>Update Team</div>
          <div className={styles.subTitle}>Edit your team details</div>
        </div>

        <div
          className={`${styles.imageWrapper} ${isDragOver ? styles.dragOver : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Image
            src={logoPreview ?? resolvedLogoSrc}
            alt="Team logo"
            className={styles.image}
            width={114}
            height={130}
            unoptimized={!!logoPreview}
          />
          <div
            className={styles.editWrapper}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image src={editIcon} alt="" className={styles.editIcon} />
            <div className={styles.editText}>Upload logo</div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg"
            style={{ display: "none" }}
            onChange={handleLogoChange}
          />
        </div>
        {logoError && <div className={styles.error}>{logoError}</div>}

        <form
          className={styles.inputs}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className={styles.inputWrapper}>
            <div className={styles.label}>Team Name</div>
            <div className={styles.inputWithIcon}>
              <Image src={teamIcon} alt="" className={styles.inputIcon} />
              <input
                className={`${styles.input} ${errors.Name ? styles.inputError : ""}`}
                placeholder="e.g. Barcelona"
                {...register("Name", {
                  required: "Team name is required.",
                  minLength: {
                    value: 5,
                    message: "Team name must be at least 5 characters.",
                  },
                  maxLength: {
                    value: 24,
                    message: "Team name must not exceed 24 characters.",
                  },
                  validate: (v) =>
                    /^[A-Za-z\s]+$/.test(v.trim()) ||
                    "Team name must contain only Latin letters.",
                })}
              />
            </div>
            {errors.Name && (
              <div className={styles.error}>{errors.Name.message}</div>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <div className={styles.label}>Abbreviation</div>
            <div className={styles.inputWithIcon}>
              <Image src={abbreviationIcon} alt="" className={styles.inputIcon} />
              <input
                className={`${styles.input} ${errors.Abbreviation ? styles.inputError : ""}`}
                placeholder="e.g. FCB"
                maxLength={3}
                {...abbrevRegister}
                onChange={(e) => {
                  e.target.value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z]/g, "")
                    .slice(0, 3);
                  abbrevRegister.onChange(e);
                }}
              />
            </div>
            {errors.Abbreviation && (
              <div className={styles.error}>{errors.Abbreviation.message}</div>
            )}
          </div>

          {submitError && <div className={styles.error}>{submitError}</div>}

          <div className={styles.buttonWrappper}>
            <Button
              className={isValid ? "gray_buttonIcon_active" : "gray_buttonIcon"}
              content="Save"
              handleClick={handleSubmit(onSubmit)}
              leftIcon={leftArrow}
            />
          </div>
        </form>
      </div>

      {showCropper && imageSrc && (
        <div className={styles.cropOverlay}>
          <div className={styles.cropModal}>
            <div className={styles.cropArea}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className={styles.cropControls}>
              <label className={styles.cropSliderLabel}>Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className={styles.cropSlider}
              />
              <div className={styles.cropButtons}>
                <button
                  type="button"
                  className={styles.cropCancelBtn}
                  onClick={handleCancelCrop}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.cropSaveBtn}
                  onClick={handleSaveCrop}
                >
                  Save Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
