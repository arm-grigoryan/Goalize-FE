"use client";
import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./CreateTeamPopUp.module.css";
import Image from "next/image";
import editIcon from "../../assets/pngs/editIcon.svg";
import teamLogo from "../../assets/pngs/teamLogo.png";
import leftArrow from "../../assets/pngs/leftArrow.svg";
import teamIcon from "../../assets/pngs/teamIcon.svg";
import searchIconGray from "../../assets/pngs/searchIconGray.svg";
import abbreviationIcon from "../../assets/pngs/abbreviation.svg";
import inviteIcon from "../../assets/pngs/inviteIcon.svg";
import Button from "@/shared/Button";
import { useCreateTeamMutation } from "@/app/store/services/api";
import { useSearchAutoComplete } from "@/hooks/useSearchAutoComplete";

type CreateTeamFormData = {
  Name: string;
  Abbreviation: string;
};

type InvitedPlayer = {
  id: number;
  name: string;
};

export interface ICreateTeamPopUpProps {
  open: boolean;
  onClose: () => void;
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
      }, "image/jpeg");
    });
    image.addEventListener("error", reject);
    image.src = imageSrc;
  });
};

export const CreateTeamPopUp: React.FC<ICreateTeamPopUpProps> = ({
  open,
  onClose,
}) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [invitedPlayers, setInvitedPlayers] = useState<InvitedPlayer[]>([]);
  const [inviteQuery, setInviteQuery] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { results: searchResults, isLoading: isSearchLoading } =
    useSearchAutoComplete(inviteQuery);

  const [createTeam, { isLoading: isSubmitting }] = useCreateTeamMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateTeamFormData>({ mode: "onChange" });

  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

  const handleClose = () => {
    reset();
    setLogoFile(null);
    setLogoPreview(null);
    setLogoError(null);
    setIsDragOver(false);
    setInvitedPlayers([]);
    setInviteQuery("");
    setSubmitError(null);
    setShowCropper(false);
    setImageSrc(null);
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
      const file = new File([blob], "logo.jpg", { type: "image/jpeg" });
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

  const handleAddPlayer = (id: number, name: string) => {
    if (!invitedPlayers.some((p) => p.id === id)) {
      setInvitedPlayers((prev) => [...prev, { id, name }]);
    }
    setInviteQuery("");
  };

  const handleRemovePlayer = (id: number) => {
    setInvitedPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const abbrevRegister = register("Abbreviation", {
    required: "Abbreviation is required.",
    pattern: {
      value: /^[A-Z]{3}$/,
      message: "Abbreviation must contain exactly 3 Latin letters.",
    },
  });

  const onSubmit: SubmitHandler<CreateTeamFormData> = async (data) => {
    if (!logoFile) {
      setLogoError("Logo is required.");
      return;
    }
    setSubmitError(null);

    const formData = new FormData();
    formData.append("Name", data.Name.trim());
    formData.append("Abbreviation", data.Abbreviation);
    formData.append("Logo", logoFile);
    invitedPlayers.forEach((p) =>
      formData.append("InvitedPlayerIds", p.id.toString()),
    );

    try {
      await createTeam(formData).unwrap();
      handleClose();
    } catch {
      setSubmitError("Failed to create team. Please try again.");
    }
  };

  const playerResults = searchResults.players.filter(
    (p) => !invitedPlayers.some((ip) => ip.id === p.id),
  );

  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} onClick={handleClose} />
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>Create Team</div>
          <div className={styles.subTitle}>
            Your winning journey starts here!
          </div>
        </div>

        <div
          className={`${styles.imageWrapper} ${isDragOver ? styles.dragOver : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Image
            src={logoPreview ?? teamLogo}
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
              <Image
                src={abbreviationIcon}
                alt=""
                className={styles.inputIcon}
              />
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

          <div className={styles.inputWrapper}>
            <div className={styles.label}>Invite Members</div>
            <div className={styles.inviteSection}>
              <div className={styles.inputWithIcon}>
                <Image src={inviteIcon} alt="" className={styles.inputIcon} />
                <input
                  className={styles.input}
                  placeholder="Search players..."
                  value={inviteQuery}
                  onChange={(e) => setInviteQuery(e.target.value)}
                  autoComplete="off"
                />
                <Image
                  src={searchIconGray}
                  alt=""
                  className={styles.serachIcon}
                />
              </div>

              {inviteQuery.trim().length > 0 && (
                <div className={styles.searchDropdown}>
                  {isSearchLoading && (
                    <div className={styles.searchDropdownItem}>Loading...</div>
                  )}
                  {!isSearchLoading && playerResults.length === 0 && (
                    <div className={styles.searchDropdownItem}>
                      No players found.
                    </div>
                  )}
                  {!isSearchLoading &&
                    playerResults.map((player) => (
                      <div
                        key={player.id}
                        className={styles.searchDropdownItem}
                        onClick={() =>
                          handleAddPlayer(player.id, player.mainText)
                        }
                      >
                        {player.mainText}
                      </div>
                    ))}
                </div>
              )}

              {invitedPlayers.length > 0 && (
                <div className={styles.chipsContainer}>
                  {invitedPlayers.map((player) => (
                    <div key={player.id} className={styles.chip}>
                      <span>{player.name}</span>
                      <button
                        type="button"
                        className={styles.chipRemove}
                        onClick={() => handleRemovePlayer(player.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {submitError && <div className={styles.error}>{submitError}</div>}

          <div className={styles.buttonWrappper}>
            <Button
              className={
                isValid && !!logoFile
                  ? "gray_buttonIcon_active"
                  : "gray_buttonIcon"
              }
              content={isSubmitting ? "Creating..." : "Create"}
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
