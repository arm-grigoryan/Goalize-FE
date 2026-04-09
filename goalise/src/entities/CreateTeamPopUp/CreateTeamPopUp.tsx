"use client";
import React, { useCallback, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "./CreateTeamPopUp.module.css";
import Image from "next/image";
import editIcon from "../../assets/pngs/editIcon.svg";
import teamLogo from "../../assets/pngs/teamLogo.png";
import noPhoto from "../../assets/pngs/noPhoto.png";
import leftArrow from "../../assets/pngs/leftArrow.svg";
import teamIcon from "../../assets/pngs/teamIcon.svg";
import searchIconGray from "../../assets/pngs/searchIconGray.svg";
import abbreviationIcon from "../../assets/pngs/abbreviation.svg";
import inviteIcon from "../../assets/pngs/inviteIcon.svg";
import Button from "@/shared/Button";
import { useCreateTeamMutation, useLazyGetPlayersInviteQuery, useGetUserInfoQuery } from "@/app/store/services/api";
import { useAuth } from "@/shared/auth/AuthContext";
import { refreshTokens } from "@/shared/auth/oidcService";
import PlayerInvitationCard from "@/entities/PlayerInvitationCard";
import warningIcon from "../../assets/pngs/error.svg";
import type { PlayerInviteResult } from "@/types/api/search";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useTranslations } from "next-intl";

type CreateTeamFormData = {
  Name: string;
  Abbreviation: string;
};

type InvitedPlayer = {
  id: number;
  name: string;
  pictureUrl?: string;
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

export const CreateTeamPopUp: React.FC<ICreateTeamPopUpProps> = ({
  open,
  onClose,
}) => {
  const [warningTooltip, setWarningTooltip] = useState<{
    x: number;
    y: number;
    player: PlayerInviteResult;
  } | null>(null);
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations("createTeam");
  const tForm = useTranslations("teamForm");
  const tCommon = useTranslations("common");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [invitedPlayers, setInvitedPlayers] = useState<InvitedPlayer[]>([]);
  const [inviteQuery, setInviteQuery] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<number | null>(null);

  const [triggerPlayersInvite, { data: inviteResults, isFetching: isSearchLoading }] =
    useLazyGetPlayersInviteQuery();

  const handleInviteQueryChange = (value: string) => {
    setInviteQuery(value);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    const q = value.trim();
    if (q.length < 1) return;
    debounceRef.current = window.setTimeout(() => {
      triggerPlayersInvite(q);
    }, 300);
  };

  const { tokens, updateTokens } = useAuth();
  const { refetch: refetchUserInfo } = useGetUserInfoQuery();

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
    setShowSuccessModal(false);
    onClose();
  };

  const applyLogoFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setLogoError(tForm("logoTypeError"));
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
      setLogoError(tForm("cropError"));
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddPlayer = (id: number, name: string, pictureUrl?: string) => {
    if (!invitedPlayers.some((p) => p.id === id)) {
      setInvitedPlayers((prev) => [...prev, { id, name, pictureUrl }]);
    }
    setInviteQuery("");
  };

  const handleRemovePlayer = (id: number) => {
    setInvitedPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const abbrevRegister = register("Abbreviation", {
    required: tForm("abbreviationRequired"),
    pattern: {
      value: /^[A-Z]{3}$/,
      message: tForm("abbreviationPattern"),
    },
  });

  const onSubmit: SubmitHandler<CreateTeamFormData> = async (data) => {
    if (!logoFile) {
      setLogoError(tForm("logoRequired"));
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
      if (tokens?.refreshToken) {
        try {
          const newTokens = await refreshTokens(tokens.refreshToken);
          updateTokens(newTokens);
        } catch {
          // ignore refresh error
        }
      }
      refetchUserInfo();
      setShowSuccessModal(true);
    } catch (error) {
      const errorData = error as { data?: { errorMessage?: string } };
      setSubmitError(
        errorData?.data?.errorMessage || t("failedToCreate")
      );
    }
  };

  const playerResults = (inviteResults ?? []).filter(
    (p) => !invitedPlayers.some((ip) => ip.id === p.playerId),
  );

  if (!open && !showSuccessModal) return null;

  if (showSuccessModal) {
    return (
      <PlayerInvitationCard
        onCancelButtonClick={handleClose}
        title={t("successTitle")}
        description={t("successDescription")}
        cancelButtonText={tCommon("close")}
      />
    );
  }

  return (
    <>
      <div className={styles.overlay}  onClick={() => {
                                        setWarningTooltip(null);
                                        handleClose();
                                      }} >
      <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`} onClick={(e) => { e.stopPropagation(); setWarningTooltip(null); }}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>{t("title")}</div>
          <div className={styles.subTitle}>{t("subtitle")}</div>
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
            <div className={styles.editText}>{tCommon("uploadLogo")}</div>
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
            <div className={styles.label}>{tForm("teamNameLabel")}</div>
            <div className={styles.inputWithIcon}>
              <Image src={teamIcon} alt="" className={styles.inputIcon} />
              <input
                className={`${styles.input} ${errors.Name ? styles.inputError : ""}`}
                placeholder={tForm("teamNamePlaceholder")}
                {...register("Name", {
                  required: tForm("teamNameRequired"),
                  minLength: {
                    value: 5,
                    message: tForm("teamNameMinLength"),
                  },
                  maxLength: {
                    value: 24,
                    message: tForm("teamNameMaxLength"),
                  },
                  validate: (v) =>
                    /^[A-Za-z\s]+$/.test(v.trim()) ||
                    tForm("teamNameLatinOnly"),
                })}
              />
            </div>
            {errors.Name && (
              <div className={styles.error}>{errors.Name.message}</div>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <div className={styles.label}>{tForm("abbreviationLabel")}</div>
            <div className={styles.inputWithIcon}>
              <Image
                src={abbreviationIcon}
                alt=""
                className={styles.inputIcon}
              />
              <input
                className={`${styles.input} ${errors.Abbreviation ? styles.inputError : ""}`}
                placeholder={tForm("abbreviationPlaceholder")}
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
            <div className={styles.label}>{t("inviteMembersLabel")}</div>
            <div className={styles.inviteSection}>
              <div className={styles.inputWithIcon}>
                <Image src={inviteIcon} alt="" className={styles.inputIcon} />
                <input
                  className={styles.input}
                  placeholder={t("searchPlayersPlaceholder")}
                  value={inviteQuery}
                  onChange={(e) => handleInviteQueryChange(e.target.value)}
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
                    <div className={styles.searchDropdownItem}>{tCommon("loading")}</div>
                  )}
                  {!isSearchLoading && playerResults.length === 0 && (
                    <div className={styles.searchDropdownItem}>
                      {t("noPlayersFound")}
                    </div>
                  )}
                  {!isSearchLoading &&
                    playerResults.map((player) => (
                      <div
                        key={player.playerId}
                        className={`${styles.searchDropdownItem} ${player.showDisabled ? styles.searchDropdownItemDisabled : ""}`}
                        onClick={() => {
                          if (!player.showDisabled) {
                            handleAddPlayer(player.playerId, player.fullName, player.pictureUrl);
                          }
                        }}
                      >
                        <div className={styles.serachDropdownItemName}>
                          <Image
                            src={player.pictureUrl && player.pictureUrl.startsWith("http") ? player.pictureUrl : noPhoto}
                            alt=""
                            width={28}
                            height={28}
                            className={styles.serachDropdownItemImage}
                            unoptimized
                          />
                          <span>{player.fullName}</span>
                        </div>
                        {player.showDisabled && (
                          <Image
                            src={warningIcon}
                            alt="warning"
                            className={styles.warningIcon}
                            width={16}
                            height={16}
                           onClick={(e) => {
                              if (isMobile) {
                                e.stopPropagation();
                                if (warningTooltip?.player.playerId === player.playerId) {
                                  setWarningTooltip(null);
                                } else {
                                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                  setWarningTooltip({
                                    x: rect.left + rect.width / 2,
                                    y: rect.top - 8,
                                    player,
                                  });
                                }
                              }
                            }}
                            onMouseEnter={(e) => {
                              if (!isMobile) {
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                setWarningTooltip({
                                  x: rect.right + 8,
                                  y: rect.top,
                                  player,
                                });
                              }
                            }}
                            onMouseLeave={() => {
                              if (!isMobile) setWarningTooltip(null);
                            }}
                          />
                        )}
                      </div>
                    ))}
                </div>
              )}

              {invitedPlayers.length > 0 && (
                <div className={styles.chipsContainer}>
                  {invitedPlayers.map((player) => (
                    <div key={player.id} className={styles.chip}>
                      <Image
                        src={player.pictureUrl && player.pictureUrl.startsWith("http") ? player.pictureUrl : noPhoto}
                        alt=""
                        width={28}
                        height={28}
                        className={styles.serachDropdownItemImage}
                        unoptimized
                      />
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
              content={isSubmitting ? t("creating") : t("create")}
              handleClick={handleSubmit(onSubmit)}
              leftIcon={leftArrow}
            />
          </div>
        </form>
      </div>

      {showCropper && imageSrc && (
        <div className={styles.cropOverlay} onClick={(e) => e.stopPropagation()}>
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
              <label className={styles.cropSliderLabel}>{tCommon("zoom")}</label>
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
                  {tCommon("cancel")}
                </button>
                <button
                  type="button"
                  className={styles.cropSaveBtn}
                  onClick={handleSaveCrop}
                >
                  {tCommon("saveCrop")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {warningTooltip && (
        <div
          className={styles.warningTooltip}
          style={{
            left: warningTooltip.x,
            top: warningTooltip.y,
            transform: isMobile ? "translate(-50%, -100%)" : "none",
          }}
        >
          <div className={styles.warningTooltipTitle}>{t("cantSendInvite")}</div>
          <div className={styles.warningTooltipDesc}>
            {t("incompleteProfileDesc")}
          </div>
          <div className={styles.warningTooltipFooter}>
            {t("completionStats", {
              required: warningTooltip.player.requiredCompletionPercentage,
              current: warningTooltip.player.completionPercentage,
            })}
          </div>
        </div>
      )}
      </div>
    </>
  );
};
