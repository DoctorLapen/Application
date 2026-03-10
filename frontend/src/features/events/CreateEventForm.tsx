import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { createEvent } from "./eventsThunks";
import { createEventValidator } from "../../validation/createEventValidator";
import type { EventData } from "./types";




const CreateEventForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState<string | null>(null);


  const {
    register,
    handleSubmit,
    control,
    formState: { errors, touchedFields, isValid, isSubmitting },
    watch
  } = useForm<EventData>({
    resolver: yupResolver(createEventValidator) as any,
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      location: "",
      capacity: null,
      visibility: "public",
      dateTime: null, 
    },
  });

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

      const eventData = {
        ...data,

        dateTime: data.dateTime,
        capacity: data.capacity || null,
      };

      const result = await dispatch(createEvent(eventData)).unwrap();

      navigate(`/events/${result.id}`);
    } catch (error: unknown) {
      if (typeof error === "string") {
        setServerError(error);
      } else if (error instanceof Error) {
        setServerError(error.message || "failed to create event");
      } else {
        setServerError("failed to create event");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">Create Event</h2>

      {/* TITLE */}
      <input
        type="text"
        placeholder="Event Title"
        {...register("title")}
        className="w-full p-3 mb-1 border rounded focus-within:ring-2 focus-within:ring-blue-500"
      />
      <p className="text-red-500 text-sm h-5 flex items-center">
        {touchedFields.title && errors.title ? errors.title.message : " "}
      </p>

      {/* DESCRIPTION */}
      <textarea
        placeholder="Description"
        {...register("description")}
        className="w-full p-3 mb-3 border rounded focus-within:ring-2 focus-within:ring-blue-500"
      />

      <div className="mb-3">
        <Controller
          name="dateTime"
          control={control}
          defaultValue={null}
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={(date:Date | null) => field.onChange(date)}
              onBlur={field.onBlur}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Select date & time"
              className="w-full p-3 border rounded focus-within:ring-2 focus-within:ring-blue-500"
            />
          )}
        />
        <p className="text-red-500 text-sm h-5 flex items-center">
          {touchedFields.dateTime && errors.dateTime ? errors.dateTime.message : " "}
        </p>
      </div>

      {/* LOCATION */}
      <input
        type="text"
        placeholder="Location"
        {...register("location")}
        className="w-full p-3 mb-1 border rounded focus-within:ring-2 focus-within:ring-blue-500"
      />
      <p className="text-red-500 text-sm h-5 flex items-center">
        {touchedFields.location && errors.location ? errors.location.message : " "}
      </p>

      {/* CAPACITY */}
      <input
        type="number"
        placeholder="Capacity (optional)"
        {...register("capacity")}
        className="w-full p-3 mb-3 border rounded focus-within:ring-2 focus-within:ring-blue-500"
      />
      <p className="text-red-500 text-sm h-5 flex items-center">
        {touchedFields.capacity && errors.capacity ? errors.capacity.message : " "}
      </p>

      {/* VISIBILITY */}
      <div className="mb-4">
        <label className="mr-4">
          <input
            type="radio"
            value="public"
            {...register("visibility")}
            defaultChecked
          />{" "}
          Public
        </label>

        <label>
          <input
            type="radio"
            value="private"
            {...register("visibility")}
          />{" "}
          Private
        </label>
      </div>

      {/* SERVER ERROR */}
      <p className="text-red-500 text-sm h-6 flex items-center mb-2">
        {serverError || " "}
      </p>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={!isValid || isSubmitting}
        className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
};

export default CreateEventForm;