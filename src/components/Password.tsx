import { useRef, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const Password = ({
  loading,
  getPassword,
}: {
  loading: boolean;
  err: string | null;
  getPassword: (password: string) => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const passRef = useRef<HTMLInputElement>(null);
  const confirmPassRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const password = passRef.current?.value;
    const confirmPassword = confirmPassRef.current?.value;

    if (passRef.current) passRef.current.value = "";
    if (confirmPassRef.current) confirmPassRef.current.value = "";

    if (!password) {
      setError("Password Required");
      setToastOpen(true);
    } else if (!confirmPassword) {
      setError("Confirmed Password Required");
      setToastOpen(true);
    } else if (password !== confirmPassword) {
      setError("Passwords do not match");
      setToastOpen(true);
    } else {
      setError(null);
      getPassword(password);
    }
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded shadow-lg w-[300px]"
      >
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            ref={passRef}
            type="password"
            className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Enter password"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Confirm Password</label>
          <input
            ref={confirmPassRef}
            type="password"
            className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Confirm password"
          />
        </div>

        {!loading && (
          <button
            type="submit"
            className="w-full bg-gray-700 text-white p-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Submit
          </button>
        )}
      </form>

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleToastClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Password;
