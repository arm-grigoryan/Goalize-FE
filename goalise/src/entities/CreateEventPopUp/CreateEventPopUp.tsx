'use client'
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import styles from './CreateEventPopUp.module.css';
import Image from "next/image";
import clipboardGray from '../../assets/pngs/clipboardGray.svg';
import addressGray from '../../assets/pngs/addressGray.svg';
import startTimeIcon from '../../assets/pngs/startTime.svg';
import dateGray from '../../assets/pngs/dateGray.svg';
import dramSymbolGray from '../../assets/pngs/dramSymbolGray.svg';
import infoGray from '../../assets/pngs/infoGray.svg';
import rightArrow from '../../assets/pngs/rightArrow.svg';
import trashIcon from '../../assets/pngs/trash.svg';
import Button from "@/shared/Button";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useCreateEventMutation, useUpdateEventMutation, useCancelEventMutation } from "@/app/store/services/api";
import { useDispatch } from "react-redux";
import { invalidateEventsList } from "@/app/store/slices/eventsSlice";
import { Loader } from "@/shared/Loader/Loader";
import PlayerInvitationCard from "@/entities/PlayerInvitationCard";
import { IEventDetail } from "@/types/api/events";
import { useTranslations } from "next-intl";
import personIcon from '../../assets/pngs/personIcon.svg';
import durationIcon from '../../assets/pngs/durationIcon.svg';

type CreateEventFormData = {
  title: string;
  address: string;
  startTime: string;
  registrationClosingTime: string;
  duration: number;
  paymentAmount: number;
  participantsCount: number;
  additionalInfo: string;
};

export interface ICreateEventPopUpProps {
  onClose: () => void;
  event?: IEventDetail;
}

const getLocalDatetimeMin = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const isoToDatetimeLocal = (iso: string): string => {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const CreateEventPopUp: React.FC<ICreateEventPopUpProps> = ({ onClose, event }) => {
  const isEditMode = !!event;
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const dispatch = useDispatch();
  const t = useTranslations("events.create");
  const tCommon = useTranslations("common");

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [cancelEvent, { isLoading: isCancelling }] = useCancelEventMutation();

  const isLoading = isCreating || isUpdating;

  const [modalState, setModalState] = useState<{
    open: boolean;
    type: 'cancelConfirm' | 'success' | 'cancelSuccess' | 'error';
    title: string;
    description: string;
  } | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const regInputRef = useRef<HTMLInputElement>(null);

  const defaultStartTime = isEditMode && event?.startTime ? isoToDatetimeLocal(event.startTime) : '';
  const defaultRegCloseTime = isEditMode && event?.registrationCloseDate ? isoToDatetimeLocal(event.registrationCloseDate) : '';

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm<CreateEventFormData>({
    mode: 'onChange',
    defaultValues: isEditMode && event ? {
      title: event.name,
      address: event.address,
      startTime: defaultStartTime,
      registrationClosingTime: defaultRegCloseTime,
      duration: event.duration,
      paymentAmount: event.registrationAmount ?? 0,
      participantsCount: event.requiredPlayersAmount,
      additionalInfo: event.additionalInfo ?? '',
    } : undefined,
  });

  const todayDatetime = getLocalDatetimeMin();

  useEffect(() => {
    register('startTime', {
      required: t('startTimeRequired'),
      validate: (v) => {
        if (!v) return t('startTimeRequired');
        const unchanged = isEditMode && v === defaultStartTime;
        if (!unchanged && new Date(v) <= new Date()) return t('mustBeInFuture');
        return true;
      },
    });
    register('registrationClosingTime', {
      required: t('registrationClosingTimeRequired'),
      validate: (v) => {
        if (!v) return t('registrationClosingTimeRequired');
        const unchanged = isEditMode && v === defaultRegCloseTime;
        const startUnchanged = isEditMode && getValues('startTime') === defaultStartTime;
        if (!unchanged && new Date(v) <= new Date()) return t('mustBeInFuture');
        if (!(unchanged && startUnchanged)) {
          const startVal = getValues('startTime');
          if (startVal && new Date(v) >= new Date(startVal)) return t('mustBeBeforeStartTime');
        }
        return true;
      },
    });
  }, [register, getValues, isEditMode, defaultStartTime, defaultRegCloseTime, t]);

  // Pre-fill datetime inputs in edit mode
  useEffect(() => {
    if (!isEditMode || !event) return;
    const startLocal = isoToDatetimeLocal(event.startTime);
    setValue('startTime', startLocal, { shouldValidate: false });
    if (startInputRef.current) startInputRef.current.value = startLocal;

    if (event.registrationCloseDate) {
      const regLocal = isoToDatetimeLocal(event.registrationCloseDate);
      setValue('registrationClosingTime', regLocal, { shouldValidate: false });
      if (regInputRef.current) regInputRef.current.value = regLocal;
    }
    trigger();
  }, [isEditMode, event, setValue, trigger]);

  const onSubmit = async (data: CreateEventFormData) => {
    setSubmitError(null);
    const body = {
      title: data.title,
      address: data.address,
      startTime: new Date(data.startTime).toISOString(),
      registrationCloseTime: new Date(data.registrationClosingTime).toISOString(),
      durationMinutes: data.duration,
      paymentAmount: data.paymentAmount,
      participantCount: data.participantsCount,
      additionalInfo: data.additionalInfo || undefined,
    };
    try {
      if (isEditMode && event) {
        await updateEvent({ eventId: event.id, body }).unwrap();
        setModalState({ open: true, type: 'success', title: t('eventUpdatedTitle'), description: t('eventUpdatedDescription') });
      } else {
        await createEvent(body).unwrap();
        dispatch(invalidateEventsList());
        setModalState({ open: true, type: 'success', title: t('eventCreatedTitle'), description: t('eventCreatedDescription') });
      }
    } catch (err) {
      const error = err as { data?: { detail?: string; title?: string; errorMessage?: string } };
      setSubmitError(error?.data?.detail || error?.data?.title || error?.data?.errorMessage || (isEditMode ? t('failedToUpdate') : t('failedToCreate')));
    }
  };

  const handleCancelEventConfirm = async () => {
    if (!event) return;
    try {
      await cancelEvent(event.id).unwrap();
      setModalState({ open: true, type: 'cancelSuccess', title: t('eventCancelledTitle'), description: t('eventCancelledDescription') });
    } catch (err) {
      const error = err as { data?: { errorMessage?: string } };
      setModalState({ open: true, type: 'error', title: t('errorTitle'), description: error?.data?.errorMessage || t('failedToCancel') });
    }
  };

  if (modalState?.open) {
    if (modalState.type === 'cancelConfirm') {
      return (
        <PlayerInvitationCard
          title={modalState.title}
          description={modalState.description}
          confirmButtonText={tCommon('confirm')}
          cancelButtonText={tCommon('back')}
          onConfirmButtonClick={handleCancelEventConfirm}
          onCancelButtonClick={() => setModalState(null)}
          loading={isCancelling}
        />
      );
    }
    return (
      <PlayerInvitationCard
        title={modalState.title}
        description={modalState.description}
        cancelButtonText={tCommon('close')}
        onCancelButtonClick={onClose}
      />
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.container} ${isMobile ? styles.mobileContainer : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && <div className={styles.loadingOverlay}><Loader /></div>}
        <button className={styles.closeButton} onClick={onClose} type="button" aria-label={tCommon("close")}>×</button>
        <div className={styles.title}>{isEditMode ? t('editTitle') : t('createTitle')}</div>
        <div className={styles.inputsWrapper}>

          <div className={styles.inputContainer}>
            <div className={styles.inputTitle}>{t("eventTitleLabel")}</div>
            <div className={styles.inputWithIcon}>
              <Image src={clipboardGray} alt="" className={styles.inputIcon} />
              <input
                className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                placeholder={t("eventTitleLabel")}
                {...register('title', {
                  required: t('eventTitleRequired'),
                  maxLength: { value: 32, message: t('max32Characters') },
                })}
              />
            </div>
            {errors.title && <div className={styles.error}>{errors.title.message}</div>}
          </div>

          <div className={styles.inputContainer}>
            <div className={styles.inputTitle}>{t("addressLabel")}</div>
            <div className={styles.inputWithIcon}>
              <Image src={addressGray} alt="" className={styles.inputIcon} />
              <input
                className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                placeholder={t("addressLabel")}
                {...register('address', {
                  required: t('addressRequired'),
                  maxLength: { value: 100, message: t('max100Characters') },
                })}
              />
            </div>
            {errors.address && <div className={styles.error}>{errors.address.message}</div>}
          </div>

          <div className={styles.timeInputsWrapper}>
            <div className={styles.inputContainer}>
              <div className={styles.inputTitle}>{t("startTimeLabel")}</div>
              <div className={styles.inputWithIcon}>
                <Image src={startTimeIcon} alt="" className={styles.inputIcon} />
                <input
                  ref={startInputRef}
                  type="datetime-local"
                  min={isEditMode ? undefined : todayDatetime}
                  className={`${styles.input} ${styles.datetimeInput} ${errors.startTime ? styles.inputError : ''}`}
                  onClick={() => startInputRef.current?.showPicker?.()}
                  onChange={(e) => {
                    setValue('startTime', e.target.value, { shouldValidate: true, shouldDirty: true });
                    trigger('registrationClosingTime');
                  }}
                />
              </div>
              {errors.startTime && <div className={styles.error}>{errors.startTime.message}</div>}
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.inputTitle}>{t("registrationClosingTimeLabel")}</div>
              <div className={styles.inputWithIcon}>
                <Image src={dateGray} alt="" className={styles.inputIcon} />
                <input
                  ref={regInputRef}
                  type="datetime-local"
                  min={isEditMode ? undefined : todayDatetime}
                  className={`${styles.input} ${styles.datetimeInput} ${errors.registrationClosingTime ? styles.inputError : ''}`}
                  onClick={() => regInputRef.current?.showPicker?.()}
                  onChange={(e) => {
                    setValue('registrationClosingTime', e.target.value, { shouldValidate: true, shouldDirty: true });
                  }}
                />
              </div>
              {errors.registrationClosingTime && (
                <div className={styles.error}>{errors.registrationClosingTime.message}</div>
              )}
            </div>
          </div>

          <div className={styles.paymentInputsWrapper}>
            <div className={styles.inputContainer}>
              <div className={styles.inputTitle}>{t("durationLabel")}</div>
              <div className={styles.inputWithIcon}>
                <Image src={durationIcon} alt="" className={styles.inputIcon} />
                <input
                  type="number"
                  min={1}
                  step={1}
                  className={`${styles.input} ${errors.duration ? styles.inputError : ''}`}
                  placeholder="0"
                  {...register('duration', {
                    required: t('durationRequired'),
                    valueAsNumber: true,
                    validate: (v) => (Number.isInteger(v) && v > 0) || t('mustBePositiveInteger'),
                  })}
                />
              </div>
              {errors.duration && <div className={styles.error}>{errors.duration.message}</div>}
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.inputTitle}>{t("paymentAmountLabel")}</div>
              <div className={styles.inputWithIcon}>
                <Image src={dramSymbolGray} alt="" className={styles.inputIcon} />
                <input
                  type="number"
                  min={0.01}
                  step="any"
                  className={`${styles.input} ${errors.paymentAmount ? styles.inputError : ''}`}
                  placeholder={t("amountPlaceholder")}
                  {...register('paymentAmount', {
                    required: t('paymentAmountRequired'),
                    valueAsNumber: true,
                    validate: (v) => (isFinite(v) && v > 0) || t('mustBePositiveNumber'),
                  })}
                />
              </div>
              {errors.paymentAmount && <div className={styles.error}>{errors.paymentAmount.message}</div>}
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.inputTitle}>{t("participantCountLabel")}</div>
              <div className={styles.inputWithIcon}>
                <Image src={personIcon} alt="" className={styles.inputIcon} />
                <input
                  type="number"
                  min={1}
                  step={1}
                  className={`${styles.input} ${errors.participantsCount ? styles.inputError : ''}`}
                  placeholder="0"
                  {...register('participantsCount', {
                    required: t('participantCountRequired'),
                    valueAsNumber: true,
                    validate: (v) => (Number.isInteger(v) && v > 0) || t('mustBePositiveInteger'),
                  })}
                />
                </div>
              {errors.participantsCount && (
                <div className={styles.error}>{errors.participantsCount.message}</div>
              )}
            </div>
          </div>

          <div className={styles.inputContainer}>
            <div className={styles.inputTitle}>{t("additionalInfoLabel")}</div>
            <div className={styles.inputWithIcon}>
              <Image src={infoGray} alt="" className={styles.inputIcon} />
              <input
                className={styles.input}
                placeholder={t("additionalInfoLabel")}
                {...register('additionalInfo')}
              />
            </div>
          </div>

        </div>

        <div className={styles.buttonsWrapper}>
          {submitError && <div className={styles.error}>{submitError}</div>}
          <Button
            className={isValid && !isLoading && (!isEditMode || isDirty) ? 'gray_buttonIcon_active' : 'gray_buttonIcon'}
            handleClick={handleSubmit(onSubmit)}
            content={isEditMode ? t('saveChangesButton') : t('createButton')}
            rightIcon={rightArrow}
            disabled={!isValid || isLoading || (isEditMode && !isDirty)}
          />
          {isEditMode && (
            <div
              className={styles.textButtonWrapper}
              onClick={() => !isLoading && !isCancelling && setModalState({ open: true, type: 'cancelConfirm', title: t('cancelEventTitle'), description: t('cancelEventDescription') })}
              style={{ opacity: isLoading || isCancelling ? 0.4 : 1, pointerEvents: isLoading || isCancelling ? 'none' : 'auto' }}
            >
              <span className={styles.textButton}>{t("cancelEventButton")}</span>
              <Image src={trashIcon} alt="" width={20} height={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
