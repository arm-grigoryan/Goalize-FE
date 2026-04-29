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
import Button from "@/shared/Button";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useCreateEventMutation } from "@/app/store/services/api";
import { Loader } from "@/shared/Loader/Loader";

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
}

const getLocalDatetimeMin = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

export const CreateEventPopUp: React.FC<ICreateEventPopUpProps> = ({ onClose }) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const [createEvent, { isLoading }] = useCreateEventMutation();
  const [submitError, setSubmitError] = useState('');
  const startInputRef = useRef<HTMLInputElement>(null);
  const regInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors, isValid },
  } = useForm<CreateEventFormData>({ mode: 'onChange' });

  const todayDatetime = getLocalDatetimeMin();

  useEffect(() => {
    register('startTime', {
      required: 'Start time is required',
      validate: (v) => {
        if (!v) return 'Start time is required';
        return new Date(v) > new Date() || 'Must be in the future';
      },
    });
    register('registrationClosingTime', {
      required: 'Registration closing time is required',
      validate: (v) => {
        if (!v) return 'Registration closing time is required';
        if (new Date(v) <= new Date()) return 'Must be in the future';
        const startVal = getValues('startTime');
        if (startVal && new Date(v) >= new Date(startVal)) return 'Must be before start time';
        return true;
      },
    });
  }, [register, getValues]);

  const onSubmit = async (data: CreateEventFormData) => {
    setSubmitError('');
    try {
      await createEvent({
        title: data.title,
        address: data.address,
        startTime: data.startTime + ':00',
        registrationCloseTime: data.registrationClosingTime + ':00',
        durationMinutes: data.duration,
        paymentAmount: data.paymentAmount,
        participantCount: data.participantsCount,
        additionalInfo: data.additionalInfo || undefined,
      }).unwrap();
      onClose();
    } catch (err) {
      const error = err as { data?: { detail?: string; title?: string } };
      setSubmitError(error?.data?.detail || error?.data?.title || 'Failed to create event');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.container} ${isMobile ? styles.mobileContainer : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && <div className={styles.loadingOverlay}><Loader /></div>}
        <div className={styles.title}>Create Event</div>
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
                  min={todayDatetime}
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
                  min={todayDatetime}
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
            className={isValid && !isLoading ? 'gray_buttonIcon_active' : 'gray_buttonIcon'}
            handleClick={handleSubmit(onSubmit)}
            content="Create"
            rightIcon={rightArrow}
            disabled={!isValid || isLoading}
          />
        </div>
      </div>
    </div>
  );
};
