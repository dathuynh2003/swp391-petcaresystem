import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './VetWorkSchedule.css';

export default function VetWorkSchedule() {
  const [vets, setVets] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedVet, setSelectedVet] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
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

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
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
      vet_id: selectedVet,
      shift_id: shiftId,
      date: selectedDate,
      status: 'existing' 
    }));
  
    console.log('Submitting data:', vetShiftDetails);
  
    axios.put('http://localhost:8080/shifts/assign-vet', vetShiftDetails)
      .then(response => {
        console.log('Response:', response);
        alert('Shifts assigned successfully!');
      })
      .catch(error => {
        console.error('Error assigning shifts:', error);
        alert('Error assigning shifts. Please try again.');
      });
  };

  return (
    <div className="container">
      <Link className="btn btn-outline-primary my-2" to={`/shift`}>
        Create New Shift
      </Link>
      <div className="row">
        <div className="col-md-12 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Vet Work Schedule</h2>
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
              <input type="date" className="form-control" value={selectedDate} onChange={handleDateChange} />
            </label>
          </div>
          <div>
            <h4>Select Shifts</h4>
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
