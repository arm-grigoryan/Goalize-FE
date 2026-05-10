'use client'
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import styles from './CreateEventPopUp.module.css';
import Image from "next/image";
import redClipboard from '../../assets/pngs/redClipboard.svg';
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
      required: 'Start time is required',
      validate: (v) => {
        if (!v) return 'Start time is required';
        const unchanged = isEditMode && v === defaultStartTime;
        if (!unchanged && new Date(v) <= new Date()) return 'Must be in the future';
        return true;
      },
    });
    register('registrationClosingTime', {
      required: 'Registration closing time is required',
      validate: (v) => {
        if (!v) return 'Registration closing time is required';
        const unchanged = isEditMode && v === defaultRegCloseTime;
        const startUnchanged = isEditMode && getValues('startTime') === defaultStartTime;
        if (!unchanged && new Date(v) <= new Date()) return 'Must be in the future';
        if (!(unchanged && startUnchanged)) {
          const startVal = getValues('startTime');
          if (startVal && new Date(v) >= new Date(startVal)) return 'Must be before start time';
        }
        return true;
      },
    });
  }, [register, getValues, isEditMode, defaultStartTime, defaultRegCloseTime]);

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
        setModalState({ open: true, type: 'success', title: 'Event Updated!', description: 'Your event has been successfully updated.' });
      } else {
        await createEvent(body).unwrap();
        dispatch(invalidateEventsList());
        setModalState({ open: true, type: 'success', title: 'Event Created!', description: 'Your event has been successfully created and is now visible in the events list.' });
      }
    } catch (err) {
      const error = err as { data?: { detail?: string; title?: string; errorMessage?: string } };
      setSubmitError(error?.data?.detail || error?.data?.title || error?.data?.errorMessage || (isEditMode ? 'Failed to update event.' : 'Failed to create event.'));
    }
  };

  const handleCancelEventConfirm = async () => {
    if (!event) return;
    try {
      await cancelEvent(event.id).unwrap();
      setModalState({ open: true, type: 'cancelSuccess', title: 'Event Cancelled', description: 'The event has been successfully cancelled.' });
    } catch (err) {
      const error = err as { data?: { errorMessage?: string } };
      setModalState({ open: true, type: 'error', title: 'Error', description: error?.data?.errorMessage || 'Failed to cancel the event. Please try again.' });
    }
  };

  if (modalState?.open) {
    if (modalState.type === 'cancelConfirm') {
      return (
        <PlayerInvitationCard
          title={modalState.title}
          description={modalState.description}
          confirmButtonText='Confirm'
          cancelButtonText='Back'
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
        cancelButtonText='Close'
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
        <button className={styles.closeButton} onClick={onClose} type="button" aria-label="Close">×</button>
        <div className={styles.title}>{isEditMode ? 'Edit Event' : 'Create Event'}</div>
        <div className={styles.inputsWrapper}>

          <div className={styles.inputContainer}>
            <div className={styles.inputTitle}>Event Title</div>
            <div className={styles.inputWithIcon}>
              <Image src={redClipboard} alt="" className={styles.inputIcon} />
              <input
                className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                placeholder="Event Title"
                {...register('title', {
                  required: 'Event title is required',
                  maxLength: { value: 32, message: 'Max 32 characters' },
                })}
              />
            </div>
            {errors.title && <div className={styles.error}>{errors.title.message}</div>}
          </div>

          <div className={styles.inputContainer}>
            <div className={styles.inputTitle}>Address</div>
            <div className={styles.inputWithIcon}>
              <Image src={addressGray} alt="" className={styles.inputIcon} />
              <input
                className={`${styles.input} ${errors.address ? styles.inputError : ''}`}
                placeholder="Address"
                {...register('address', {
                  required: 'Address is required',
                  maxLength: { value: 100, message: 'Max 100 characters' },
                })}
              />
            </div>
            {errors.address && <div className={styles.error}>{errors.address.message}</div>}
          </div>

          <div className={styles.timeInputsWrapper}>
            <div className={styles.inputContainer}>
              <div className={styles.inputTitle}>Start Time</div>
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
              <div className={styles.inputTitle}>Registration Closing Time</div>
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
              <div className={styles.inputTitle}>Duration</div>
              <div className={styles.inputWithIcon}>
                <div className={styles.inputText}>Min</div>
                <input
                  type="number"
                  min={1}
                  step={1}
                  className={`${styles.input} ${errors.duration ? styles.inputError : ''}`}
                  placeholder="0"
                  {...register('duration', {
                    required: 'Duration is required',
                    valueAsNumber: true,
                    validate: (v) => (Number.isInteger(v) && v > 0) || 'Must be a positive integer',
                  })}
                />
              </div>
              {errors.duration && <div className={styles.error}>{errors.duration.message}</div>}
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.inputTitle}>Payment Amount</div>
              <div className={styles.inputWithIcon}>
                <Image src={dramSymbolGray} alt="" className={styles.inputIcon} />
                <input
                  type="number"
                  min={0.01}
                  step="any"
                  className={`${styles.input} ${errors.paymentAmount ? styles.inputError : ''}`}
                  placeholder="Amount"
                  {...register('paymentAmount', {
                    required: 'Payment amount is required',
                    valueAsNumber: true,
                    validate: (v) => (isFinite(v) && v > 0) || 'Must be a positive number',
                  })}
                />
              </div>
              {errors.paymentAmount && <div className={styles.error}>{errors.paymentAmount.message}</div>}
            </div>

            <div className={styles.inputContainer}>
              <div className={styles.inputTitle}>Participant Count</div>
              <input
                type="number"
                min={1}
                step={1}
                className={`${styles.inputNoIcon} ${errors.participantsCount ? styles.inputError : ''}`}
                placeholder="00"
                {...register('participantsCount', {
                  required: 'Participant count is required',
                  valueAsNumber: true,
                  validate: (v) => (Number.isInteger(v) && v > 0) || 'Must be a positive integer',
                })}
              />
              {errors.participantsCount && (
                <div className={styles.error}>{errors.participantsCount.message}</div>
              )}
            </div>
          </div>

          <div className={styles.inputContainer}>
            <div className={styles.inputTitle}>Additional Info</div>
            <div className={styles.inputWithIcon}>
              <Image src={infoGray} alt="" className={styles.inputIcon} />
              <input
                className={styles.input}
                placeholder="Additional Info"
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
            content={isEditMode ? 'Save Changes' : 'Create'}
            rightIcon={rightArrow}
            disabled={!isValid || isLoading || (isEditMode && !isDirty)}
          />
          {isEditMode && (
            <div
              className={styles.textButtonWrapper}
              onClick={() => !isLoading && !isCancelling && setModalState({ open: true, type: 'cancelConfirm', title: 'Cancel Event', description: 'Are you sure you want to cancel this event? This action cannot be undone.' })}
              style={{ opacity: isLoading || isCancelling ? 0.4 : 1, pointerEvents: isLoading || isCancelling ? 'none' : 'auto' }}
            >
              <span className={styles.textButton}>Cancel Event</span>
              <Image src={trashIcon} alt="" width={20} height={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
