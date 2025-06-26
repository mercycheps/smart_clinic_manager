import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const BookAppointmentForm = ({ onSubmit }) => {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
      <Formik
        initialValues={{
          date: "",
          time: "",
          reason: "",
        }}
        
        validationSchema={Yup.object({
          date: Yup.string().required("Date is required"),
          time: Yup.string().required("Time is required"),
          reason: Yup.string().required("Reason is required"),
        })}
        onSubmit={onSubmit}
      >

        <Form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Date</label>
            <Field name="date" type="date" className="w-full border p-2 rounded" />
            <ErrorMessage name="date" component="div" className="text-red-500 text-sm" />
          </div>


          <div>
            <label className="block text-sm font-medium">Time</label>
            <Field name="time" type="time" className="w-full border p-2 rounded" />
            <ErrorMessage name="time" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium">Reason</label>
            <Field as="textarea" name="reason" className="w-full border p-2 rounded" />
            <ErrorMessage name="reason" component="div" className="text-red-500 text-sm" />
          </div>


          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Request Appointment
          </button>
        </Form>
      </Formik>
    </div>
  );
};


export default BookAppointmentForm;
