import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { URL } from '../utils/constant';
export default function CreateShift() {
    let navigate = useNavigate();

    const [shift, setShift] = useState({
        from_time: "",
        to_time: "",
    });

    const [error, setError] = useState("");
    const [shifts, setShifts] = useState([]);

    const { from_time,  to_time } = shift;

    useEffect(() => {
        const fetchShifts = async () => {
            try {
                const response = await axios.get(`${URL}/shifts/all`);
                setShifts(response.data);
            } catch (err) {
                console.error("There was an error fetching the shifts:", err);
            }
        };

        fetchShifts();
    }, []);

    const onInputChange = (e) => {
        setShift({ ...shift, [e.target.name]: e.target.value });
    };

    const isValidTime = (time) => {
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return timePattern.test(time);
    };
    
      const onSubmit = async (e) => {
        e.preventDefault();
        if (!isValidTime(from_time) || !isValidTime(to_time)) {
            setError("Invalid time format. Please use HH:MM.");
            return;
        }

        try {
          const response = await axios.post(`${URL}/shifts/add`, shift);
            setShifts([...shifts, response.data]);
            setShift({
                from_time: "",
                to_time: "",
            });
        } catch (err) {
          setError("Failed to create shift. Please try again.");
          console.error("There was an error creating the shift:", err);
        }
    };

    const deleteShift = async (shiftId) => {
      try {
          await axios.delete(`${URL}/shifts/delete/${shiftId}`);
          setShifts(shifts.filter((shift) => shift.shiftId !== shiftId));
      } catch (err) {
          console.error("There was an error deleting the shift:", err);
      }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Create Shift</h2>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={(e) => onSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="From Time" className="form-label">
                From Time
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="HH:MM"
                name="from_time"
                value={from_time}
                required
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="To Time" className="form-label">
                To Time
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="HH:MM"
                name="to_time"
                value={to_time}
                required
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Create
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/vet-work-schedules">
              Cancel
            </Link>
          </form>
        </div>
      </div>
      <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h4 className="text-center m-4">Shift Exist</h4>
                    <ul className="list-group">
                        {shifts.map((shift) => (
                            <li className="list-group-item" key={shift.shiftId}>
                                {shift.from_time} - {shift.to_time}
                              <button
                                className="btn btn-danger mx-2"
                                onClick={() => deleteShift(shift.shiftId)}
                              >
                              Delete
                              </button>
                            </li>
                        ))}
                    </ul>
                </div>
        </div>
    </div>
  )
}
