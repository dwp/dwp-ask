import React from "react";
import { DateParts, PayloadProps } from "@/app/types";
import { convertDateToISO } from "@/app/utils/helpers";

const validateDateRange = (
  setErrorStartText: React.Dispatch<React.SetStateAction<string>>,
  setErrorEndText: React.Dispatch<React.SetStateAction<string>>,
  start: DateParts,
  end?: DateParts,
): { valid: boolean; message?: string } => {
  // Helper functions
  const isEmpty = (val?: string) => !val?.trim();
  const isComplete = (d: DateParts) =>
    !isEmpty(d.day) && !isEmpty(d.month) && !isEmpty(d.year);
  const isValidDate = (d: DateParts): boolean => {
    if (!isComplete(d)) return false;
    const day = parseInt(d.day),
      month = parseInt(d.month),
      year = parseInt(d.year);
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1000)
      return false;
    const date = new Date(year, month - 1, day);
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    );
  };
  const toDate = (d: DateParts) =>
    new Date(
      `${d.year}-${d.month.padStart(2, "0")}-${d.day.padStart(2, "0")}T00:00:00Z`,
    );
  const error = (isStart: boolean, msg: string) => {
    (isStart ? setErrorStartText : setErrorEndText)(msg);
    return { valid: false, message: msg };
  };
  const clearErrors = () => {
    setErrorStartText("");
    setErrorEndText("");
    return { valid: true };
  };

  // Get today's date
  const today = new Date(
    Date.UTC(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    ),
  );

  // Validate start date
  if (!isComplete(start))
    return error(true, "Start date is required and must be fully filled");
  if (!isValidDate(start)) return error(true, "Start date is not valid");
  const startDate = toDate(start);

  // Handle missing or empty end date
  const endEmpty = !end || [end.day, end.month, end.year].every(isEmpty);
  if (endEmpty)
    return startDate > today
      ? error(true, "Start date cannot be in the future")
      : clearErrors();

  // Validate end date
  const endPartiallyFilled = [end.day, end.month, end.year].filter(
    (v) => !isEmpty(v),
  ).length;
  if (endPartiallyFilled > 0 && endPartiallyFilled < 3)
    return error(false, "End date is incomplete or not valid");
  if (!isValidDate(end)) return error(false, "End date is not valid");
  const endDate = toDate(end);

  // Validate date range
  if (startDate > endDate)
    return error(true, "Start date cannot be after end date");
  if (startDate > today)
    return error(true, "Start date cannot be in the future");
  if (endDate > today) return error(false, "End date cannot be in the future");

  return clearErrors();
};

const clickDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const handleDownload = async (
  setErrorStartText: React.Dispatch<React.SetStateAction<string>>,
  setErrorEndText: React.Dispatch<React.SetStateAction<string>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setapiErrorState: React.Dispatch<React.SetStateAction<boolean>>,
  startDate: DateParts,
  endDate: DateParts,
  currentPage: number,
  apiCallBack: (payload: PayloadProps) => Promise<Blob | void>,
  downloadType: string = "pdf",
  feedback_types?: Array<"true" | "false" | "none">,
) => {
  const validDate = validateDateRange(
    setErrorStartText,
    setErrorEndText,
    startDate,
    endDate,
  );
  if (validDate.valid) {
    const start_date = convertDateToISO(startDate);
    let end_date = convertDateToISO(endDate);
    if (endDate.day) {
      end_date = convertDateToISO(endDate);
    }
    try {
      setLoading(true);

      let payload: PayloadProps = {
        start_date,
        end_date,
        currentPage,
      };
      if (feedback_types) {
        payload = {
          ...payload,
          feedback_types: feedback_types,
        };
      }
      let blob;
      if (apiCallBack) {
        blob = await apiCallBack(payload);
        if (blob) {
          const filename = `export-all-${start_date}-${end_date}.${downloadType}`;
          clickDownload(blob, filename);
        }
      }
    } catch (err: any) {
      console.log(err);
      setapiErrorState(true);
    } finally {
      setLoading(false);
    }
  }
};

export { validateDateRange, clickDownload, handleDownload };
