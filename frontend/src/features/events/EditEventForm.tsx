import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { updateEvent } from "./eventsThunks";

import type { EditEventRequest, EventData } from "./types";
import { editEventValidator } from "../../validation/editEventValidator";
import { formatTimeForInput, parseTimeFromInput } from "./utils";
import TagMultiSelect from "./TagMultiSelect";
import { availableTags } from "./constants";

interface EditEventFormProps {
  eventId: number;
  initialData: EventData;
  currentParticipantsCount: number;

}

const EditEventForm = ({ eventId, initialData, currentParticipantsCount }: EditEventFormProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, touchedFields, isValid, isSubmitting, dirtyFields },
    watch,
  } = useForm<EventData>({
    resolver: yupResolver(editEventValidator(currentParticipantsCount)) as any,
    mode: "onChange",
    defaultValues: {
      title: initialData.title,
      description: initialData.description,
      location: initialData.location,
      capacity: initialData.capacity,
      visibility: initialData.visibility,
      dateTime: initialData.dateTime ? new Date(initialData.dateTime) : null,
      tags: initialData.tags,
    },
  });

  useEffect(() => {
    if (!initialData?.dateTime) return;

    const date = new Date(initialData.dateTime);
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    const timeOnly = new Date();
    timeOnly.setHours(date.getHours(), date.getMinutes(), 0, 0);

    setSelectedDate(dateOnly);
    setSelectedTime(timeOnly);
  }, [initialData]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      const combined = new Date(selectedDate);
      combined.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      setValue("dateTime", combined, { shouldValidate: true });
    } else {
      setValue("dateTime", null, { shouldValidate: true });
    }
  }, [selectedDate, selectedTime, setValue]);

  watch(() => {
    if (serverError) setServerError(null);
  });

  const onSubmit = async (data: EventData) => {
    try {
      setServerError(null);

      if (!data.dateTime) {
        setServerError("Date and time is required");
        return;
      }

      const changedData: EditEventRequest = {};

      Object.keys(dirtyFields).forEach((key) => {
        const k = key as keyof EditEventRequest;

        switch (k) {
          case "capacity":
            changedData[k] = data.capacity ?? null; // number | null
            break;

          case "dateTime":
            if (data.dateTime) changedData[k] = data.dateTime; // Date
            break;

          case "visibility":
            if (data.visibility === "public" || data.visibility === "private") {
              changedData[k] = data.visibility; // "public" | "private"
            }
            break;
          case "tags":

            if (data.tags) {
              changedData.tags = data.tags.map(tag => tag.id);
            }
            break;

          default:
            const value = data[k];
            if (value !== undefined && value !== null) {
              changedData[k] = value as Exclude<typeof value, null>; // string | number
            }
            break;
        }
      });

      if (dirtyFields.capacity && !data.capacity) {
        changedData.capacity = null;
      }

      const result = await dispatch(
        updateEvent({ id: eventId, data: changedData })
      ).unwrap();

      navigate(`/events/${result.id}`);
    } catch (error: unknown) {
      if (typeof error === "string") {
        setServerError(error);
      } else if (error instanceof Error) {
        setServerError(error.message || "Failed to update event");
      } else {
        setServerError("Failed to update event");
      }
    }
  };
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-200 space-y-2"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">
        Edit Event
      </h2>

      {/* TITLE */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Event Title <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          placeholder="e.g., Tech Meetup Madrid"
          {...register("title")}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <p className="text-red-500 text-sm h-5 flex items-center">
          {touchedFields.title && errors.title ? errors.title.message : " "}
        </p>
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Description
        </label>

        <textarea
          placeholder="Provide details about the event..."
          {...register("description")}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* DATE + TIME */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Event Date & Time <span className="text-red-500">*</span>
        </label>

        <Controller
          name="dateTime"
          control={control}
          render={() => (
            <div className="flex flex-col sm:flex-row gap-2">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                placeholderText="dd/mm/yyyy"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                dateFormat="dd/MM/yyyy"
                minDate={tomorrow}
                wrapperClassName="flex-1"
              />

              <input
                type="time"
                value={formatTimeForInput(selectedTime)}
                onChange={(e) =>
                  setSelectedTime(parseTimeFromInput(e.target.value))
                }
                className="flex-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
        />

        <p className="text-red-500 text-sm h-5 flex items-center">
          {touchedFields.dateTime && errors.dateTime
            ? errors.dateTime.message
            : " "}
        </p>
      </div>

      {/* LOCATION */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Location <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          placeholder="e.g., Convection Center Madrid "
          {...register("location")}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <p className="text-red-500 text-sm h-5 flex items-center">
          {touchedFields.location && errors.location
            ? errors.location.message
            : " "}
        </p>
      </div>

      {/* CAPACITY */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Capacity(Optional)
        </label>

        <input
          type="number"
          placeholder="leave empty for unlimited"
          {...register("capacity")}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <p className="text-red-500 text-sm h-5 flex items-center">
          {touchedFields.capacity && errors.capacity
            ? errors.capacity.message
            : " "}
        </p>
      </div>

        <div>
        <label className="block text-sm font-medium mb-1">
          Tags
        </label>
        <Controller
          name="tags"
          control={control}
          render={({ field: { value, onChange } ,fieldState}) => (
             <>
        <TagMultiSelect
          availableTags={availableTags}
          selectedTags={value || []}
          onChange={onChange}
          placeholder="Select tags (up to 5)"
        />
        <p className="text-red-500 text-sm h-5 flex items-center">
          {fieldState.error?.message || " "}
        </p>
      </>
          )}
        />
        </div>
        
      

      {/* VISIBILITY */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Event Visibility
        </label>

        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="public"
              {...register("visibility")}
              defaultChecked
            />
            Public
          </label>

          <label className="flex items-center gap-1">
            <input
              type="radio"
              value="private"
              {...register("visibility")}
            />
            Private
          </label>
        </div>
      </div>

      {/* SERVER ERROR */}
      <p className="text-red-500 text-sm h-6 flex items-center">
        {serverError || " "}
      </p>

      {/* BUTTONS */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-1/2 border border-gray-300 p-3 rounded-md hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="w-1/2 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400 disabled:opacity-70"
        >
          {isSubmitting ? "Editing..." : "Edit Event"}
        </button>
      </div>
    </form>
  );

};

export default EditEventForm;