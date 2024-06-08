import axios from "axios";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import './shift.css';

export default function AssignVetSchedules() {
  const [vets, setVets] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [shiftDetails, setShiftDetails] = useState([]);
  const [selectedVet, setSelectedVet] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShifts, setSelectedShifts] = useState([]);

  useEffect(() => {
    // Fetch the list of vets from the server
    axios.get('http://localhost:8080/vets', { withCredentials: true })
      .then(response => setVets(response.data))
      .catch(error => console.error('Error fetching vets:', error));

    // Fetch the list of shifts from the server
    axios.get('http://localhost:8080/shifts/all', { withCredentials: true })
      .then(response => setShifts(response.data))
      .catch(error => console.error('Error fetching shifts:', error));
  }, []);

  useEffect(() => {
    if (selectedVet && selectedDate) {
      fetchShiftDetails();
    }
  }, [selectedVet, selectedDate]);

  const fetchShiftDetails = () => {
    const date = selectedDate.toISOString().split('T')[0];
    axios.get('http://localhost:8080/shifts/details', { withCredentials: true })
      .then(response => {
        const filteredDetails = response.data.filter(detail => 
          detail.user.userId === parseInt(selectedVet) && detail.date === date
        );
        setShiftDetails(filteredDetails);
        const assignedShiftIds = filteredDetails.map(detail => detail.shift.shiftId);
        setSelectedShifts(assignedShiftIds);
      })
      .catch(error => console.error('Error fetching shift details:', error));
  };

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

  const handleDeleteAssignment = (shiftId) => {
    const date = selectedDate.toISOString().split('T')[0];
    axios.delete('http://localhost:8080/shifts/delete-vet-shift', { withCredentials: true }, {
      params: {
        shiftId: shiftId,
        vetId: selectedVet,
        date: date
      }
    })
      .then(response => {
        alert('Shift unassigned successfully!');
        fetchShiftDetails();
      })
      .catch(error => {
        console.error('Error unassigning shift:', error);
        alert('Error unassigning shift. Please try again.');
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
  
    axios.put('http://localhost:8080/shifts/assign-vet', vetShiftDetails, { withCredentials: true })
      .then(response => {
        alert('Shifts assigned successfully!');
        fetchShiftDetails();
      })
      .catch(error => {
        console.error('Error assigning shifts:', error);
        alert('Error assigning shifts. Please try again.');
      });
  };

  const handleSelectAll = () => {
    if (selectedShifts.length === shifts.length) {
      setSelectedShifts([]);
    } else {
      const allShiftIds = shifts
        .map(shift => shift.shiftId)
        .filter(shiftId => !shiftDetails.some(detail => detail.shift.shiftId === shiftId) && !isShiftInThePast(shiftId));
      setSelectedShifts(allShiftIds);
    }
  };

  const isShiftInThePast = (shift) => {
    const now = new Date();
    if (selectedDate.toDateString() !== now.toDateString()) {
      return false;
    }
    const [shiftStartHour, shiftStartMinute] = shift.from_time.split(':').map(Number);
    const shiftStartTime = new Date(selectedDate);
    shiftStartTime.setHours(shiftStartHour, shiftStartMinute, 0, 0);
    return now > shiftStartTime;
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
              {selectedShifts.length === shifts.length - shiftDetails.length ? "Unselect All" : "Select All"}
            </button>
            <div className="shift-buttons">
              {shifts.map(shift => {
                const isAssigned = shiftDetails.some(detail => detail.shift.shiftId === shift.shiftId);
                const isPast = isShiftInThePast(shift);
                return (
                  <div key={shift.shiftId} className={`shift-button ${selectedShifts.includes(shift.shiftId) ? 'selected' : ''}`}>
                    <input 
                      type="checkbox" 
                      id={`shift-${shift.shiftId}`}
                      value={shift.shiftId} 
                      checked={selectedShifts.includes(shift.shiftId)}
                      onChange={() => handleShiftChange(shift.shiftId)} 
                      disabled={isAssigned || isPast}
                    />
                    <label htmlFor={`shift-${shift.shiftId}`}>
                      {shift.from_time} - {shift.to_time}
                    </label>
                    {isAssigned && (
                      <button 
                        className="delete-button" 
                        onClick={() => handleDeleteAssignment(shift.shiftId)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <button className="btn btn-outline-primary mt-3" onClick={handleSubmit}>Assign Vet</button>
        </div>
      </div>
    </div>
  );
}
