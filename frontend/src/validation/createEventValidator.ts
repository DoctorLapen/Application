import * as yup from "yup";
import { validateEventDate } from "./utils/utils";
export const createEventValidator = yup.object({
  title: yup
    .string()
    .required("Title is required"),

  description: yup.string(),

  location: yup
    .string()
    .required("Location is required"),

  capacity: yup
    .number()
    .nullable()
    .transform((value) => (isNaN(value) ? null : value))
    .min(1, "Capacity must be at least 1"),

  visibility: yup
    .string()
    .oneOf(["public", "private"])
    .required(),
  dateTime: yup
    .date()
    .nullable()
    .required("Date and time is required")
    .test(
      "event-date",
      "Event must start no earlier than the next day",
      validateEventDate
    ),
  tags: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.number().required(),
        name: yup.string().required()
      })
    )
    .max(5, 'Maximum 5 tags allowed'),
});