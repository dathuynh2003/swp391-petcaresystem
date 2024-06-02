import axios from "axios";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import './shift.css';

export default function AssignVetSchedules() {
  const [vets, setVets] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedVet, setSelectedVet] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShifts, setSelectedShifts] = useState([]);

  useEffect(() => {
    // Fetch the list of vets from the server
    axios.get('http://localhost:8080/vets')
      .then(response => setVets(response.data))
      .catch(error => console.error('Error fetching vets:', error));

    // Fetch the list of shifts from the server
    axios.get('http://localhost:8080/shifts/all')
      .then(response => setShifts(response.data))
      .catch(error => console.error('Error fetching shifts:', error));
  }, []);

  const handleVetChange = (event) => {
    setSelectedVet(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleShiftChange = (shiftId) => {
    setSelectedShifts(prevSelectedShifts => {
      if (prevSelectedShifts.includes(shiftId)) {
        return prevSelectedShifts.filter(id => id !== shiftId);
      } else {
        return [...prevSelectedShifts, shiftId];
      }
    });
  };

  const handleSubmit = () => {

    if (!selectedVet) {
      alert("Please select a vet.");
      return;
    }

    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    if (selectedShifts.length === 0) {
      alert("Please select at least one shift.");
      return;
    }

    const vetShiftDetails = selectedShifts.map(shiftId => ({
      user: { userId: selectedVet }, 
      shift: { shiftId: shiftId },
      date: selectedDate.toISOString().split('T')[0],
      status: 'Available' 
    }));
  
    console.log('Submitting data:', vetShiftDetails);
  
    axios.put('http://localhost:8080/shifts/assign-vet', vetShiftDetails)
      .then(response => {
        console.log('Response:', response);
        alert('Shifts assigned successfully!');
        window.location.reload();
      })
      .catch(error => {
        console.error('Error assigning shifts:', error);
        alert('Error assigning shifts. Please try again.');
      });
  };

  const handleSelectAll = () => {
    if (selectedShifts.length === shifts.length) {
      // Unselect all shifts if all are already selected
      setSelectedShifts([]);
    } else {
      // Select all shifts if not all are selected
      const allShiftIds = shifts.map(shift => shift.shiftId);
      setSelectedShifts(allShiftIds);
    }
  };

  return (
    <div className="container">
      <Link className="btn btn-outline-primary my-2" to={`/shift`}>
        Create New Shift
      </Link>
      <div className="row">
        <div className="col-md-12 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Assign Vet Schedules</h2>
          <div className="form-group">
            <label>
              Select Vet:
              <select className="form-control" value={selectedVet} onChange={handleVetChange}>
                <option value="">Select Vet</option>
                {vets.map(vet => (
                  <option key={vet.userId} value={vet.userId}>{vet.fullName}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              Select Date:
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                className="form-control"
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Select a date"
              />
            </label>
          </div>
          <div>
            <h4>Select Shifts</h4>
              <button className="btn btn-outline-primary mr-2" onClick={handleSelectAll}>
                {selectedShifts.length === shifts.length ? "Unselect All" : "Select All"}
              </button>
            <div className="shift-buttons">
              {shifts.map(shift => (
                <div key={shift.shiftId} className="shift-button">
                  <input 
                    type="checkbox" 
                    id={`shift-${shift.shiftId}`}
                    value={shift.shiftId} 
                    checked={selectedShifts.includes(shift.shiftId)}
                    onChange={() => handleShiftChange(shift.shiftId)} 
                  />
                  <label htmlFor={`shift-${shift.shiftId}`}>
                    {shift.from_time} - {shift.to_time}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-outline-primary mt-3" onClick={handleSubmit}>Assign Vet</button>
        </div>
      </div>
    </div>
  );
}
