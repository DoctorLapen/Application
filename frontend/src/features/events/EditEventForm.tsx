import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { updateEvent } from "./eventsThunks";

import type { EditEventRequest, EventData } from "./types";
import { editEventValidator } from "../../validation/editEventValidator";

interface EditEventFormProps {
    eventId: number;
    initialData: EventData;
    currentParticipantsCount: number;

}

const EditEventForm = ({ eventId, initialData, currentParticipantsCount }: EditEventFormProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
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
    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300"
        >
            <h2 className="text-3xl font-bold mb-6 text-center">Edit Event</h2>

            <input
                type="text"
                placeholder="Event Title"
                {...register("title")}
                className="w-full p-3 mb-1 border rounded focus-within:ring-2 focus-within:ring-blue-500"
            />
            <p className="text-red-500 text-sm h-5 flex items-center">
                {touchedFields.title && errors.title ? errors.title.message : " "}
            </p>

            <textarea
                placeholder="Description"
                {...register("description")}
                className="w-full p-3 mb-3 border rounded focus-within:ring-2 focus-within:ring-blue-500"
            />

            <div className="mb-3">
                <Controller
                    name="dateTime"
                    control={control}
                    defaultValue={initialData.dateTime ? new Date(initialData.dateTime) : null}
                    render={({ field }) => (
                        <DatePicker
                            selected={field.value}
                            onChange={(date: Date | null) => field.onChange(date)}
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

            <input
                type="text"
                placeholder="Location"
                {...register("location")}
                className="w-full p-3 mb-1 border rounded focus-within:ring-2 focus-within:ring-blue-500"
            />
            <p className="text-red-500 text-sm h-5 flex items-center">
                {touchedFields.location && errors.location ? errors.location.message : " "}
            </p>

            <input
                type="number"
                placeholder="Capacity (optional)"
                {...register("capacity")}
                className="w-full p-3 mb-3 border rounded focus-within:ring-2 focus-within:ring-blue-500"
            />

            <p className="text-red-500 text-sm h-5 flex items-center">
                {touchedFields.capacity && errors.capacity ? errors.capacity.message : " "}
            </p>

            <div className="mb-4">
                <label className="mr-4">
                    <input
                        type="radio"
                        value="public"
                        {...register("visibility")}
                        defaultChecked={initialData.visibility === "public"}
                    />{" "}
                    Public
                </label>

                <label>
                    <input
                        type="radio"
                        value="private"
                        {...register("visibility")}
                        defaultChecked={initialData.visibility === "private"}
                    />{" "}
                    Private
                </label>
            </div>

            <p className="text-red-500 text-sm h-6 flex items-center mb-2">
                {serverError || " "}
            </p>

            <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition disabled:bg-gray-400 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Updating..." : "Update Event"}
            </button>
        </form>
    );
};

export default EditEventForm;