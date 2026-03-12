import * as yup from "yup";
export const editEventValidator = (currentParticipantsCount: number) =>
  yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string(),
    location: yup.string().required("Location is required"),
    dateTime: yup.date().required("Date and time is required"),
    visibility: yup
      .mixed<"public" | "private">()
      .oneOf(["public", "private"], "Visibility must be public or private"),
    capacity: yup
      .number()
      .nullable()
      .transform((value) => (isNaN(value) ? null : value))
      .min(
        currentParticipantsCount,
        `Capacity cannot be less than current participants (${currentParticipantsCount})`
      ),
  });