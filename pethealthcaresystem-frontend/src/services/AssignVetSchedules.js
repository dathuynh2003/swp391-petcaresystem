import axios from "axios";
import React, { useState, useEffect } from "react";

export default function AssignVetSchedules() {
  const [vets, setVets] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [shiftDetails, setShiftDetails] = useState([]);
  const [selectedVet, setSelectedVet] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8080/vets', { withCredentials: true })
      .then(response => setVets(response.data))
      .catch(error => console.error('Error fetching vets:', error));

    axios.get('http://localhost:8080/shifts/all', { withCredentials: true })
      .then(response => setShifts(response.data))
      .catch(error => console.error('Error fetching shifts:', error));

    const getWeekDates = (date) => {
      const firstDayOfWeek = date.getDate() - date.getDay() + 1;
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(firstDayOfWeek + i);
        return newDate;
      });
      setCurrentWeek(weekDates[0]); // Set currentWeek to the first day of the week
    };

    getWeekDates(currentWeek);
  }, []);

  useEffect(() => {
    if (selectedVet) {
      fetchShiftDetails();
    }
  }, [selectedVet, currentWeek]);

  const fetchShiftDetails = () => {
    axios.get('http://localhost:8080/shifts/details', { withCredentials: true })
      .then(response => {
        const vetSchedule = response.data.filter(detail => detail.user.userId === parseInt(selectedVet));
        setShiftDetails(vetSchedule);
      })
      .catch(error => console.error('Error fetching shift details:', error));
  };

  const handlePreviousWeek = () => {
    const previousWeek = new Date(currentWeek);
    previousWeek.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(previousWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
  };

  const handleShiftChange = () => {
    if (selectedShifts.length === 0) {
      alert('Please select at least one shift to assign.');
      return;
    }

    const vetShiftDetails = selectedShifts.map(shift => ({
      user: { userId: selectedVet },
      shift: { shiftId: shift.shiftId },
      date: shift.date,
      status: 'Available'
    }));

    axios.put('http://localhost:8080/shifts/assign-vet', vetShiftDetails, { withCredentials: true })
      .then(response => {
        alert('Shifts assigned successfully!');
        setSelectedShifts([]);
        fetchShiftDetails();
      })
      .catch(error => {
        console.error('Error assigning shifts:', error);
        alert('Error assigning shifts. Please try again.');
      });
  };

  const handleToggleShift = (shiftId, date) => {
    const existingIndex = selectedShifts.findIndex(item => item.shiftId === shiftId && item.date === date.toISOString().split('T')[0]);
    if (existingIndex !== -1) {
      const updatedSelectedShifts = [...selectedShifts];
      updatedSelectedShifts.splice(existingIndex, 1);
      setSelectedShifts(updatedSelectedShifts);
    } else {
      setSelectedShifts([...selectedShifts, { shiftId, date: date.toISOString().split('T')[0] }]);
    }
  };

  const handleSelectAll = () => {
    if (!selectAll) {
      const allFutureShifts = [];
      shifts.forEach(shift => {
        for (let i = 0; i < 7; i++) {
          const date = new Date(currentWeek);
          date.setDate(date.getDate() + i);
          const shiftDate = date.toISOString().split('T')[0];
          if (!shiftDetails.some(detail => detail.shift.shiftId === shift.shiftId && detail.date === shiftDate) && !isShiftInThePast(shift, date)) {
            allFutureShifts.push({ shiftId: shift.shiftId, date: shiftDate });
          }
        }
      });
      setSelectedShifts(allFutureShifts);
      setSelectAll(true);
    } else {
      setSelectedShifts([]);
      setSelectAll(false);
    }
  };

  const handleDeleteAssignment = (shiftId, date) => {
    const dateString = date.toISOString().split('T')[0];
    axios.delete('http://localhost:8080/shifts/delete-vet-shift', {
      params: {
        shiftId: shiftId,
        vetId: selectedVet,
        date: dateString
      },
      withCredentials: true
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

  const isShiftInThePast = (shift, date) => {
    const now = new Date();
    if (date.toDateString() !== now.toDateString()) {
      return date < now;
    }
    const [shiftStartHour, shiftStartMinute] = shift.from_time.split(':').map(Number);
    const shiftStartTime = new Date(date);
    shiftStartTime.setHours(shiftStartHour, shiftStartMinute, 0, 0);
    return now > shiftStartTime;
  };

  const formatDate = (date) => date.toLocaleDateString('en-GB');
  const formatDay = (date) => date.toLocaleDateString('en-GB', { weekday: 'short' });

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Assign Vet Schedules</h2>
          <div className="form-group">
            <div className="vet-selection">
              <h4 style={{ marginBottom: '10px' }}>Select Vet:</h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '10px'
              }}>
                {vets.map(vet => (
                  <button
                    key={vet.userId}
                    style={{
                      padding: '10px',
                      backgroundColor: selectedVet === vet.userId ? '#007bff' : 'transparent',
                      color: selectedVet === vet.userId ? '#fff' : '#000',
                      border: '1px solid #007bff',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s, color 0.3s'
                    }}
                    onClick={() => setSelectedVet(vet.userId)}
                  >
                    {vet.fullName}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-primary" onClick={handlePreviousWeek}>Previous Week</button>
            <button className="btn btn-primary" onClick={handleNextWeek}>Next Week</button>
          </div>
          <button className="btn btn-outline-primary mb-3" onClick={handleSelectAll}>
            {selectAll ? "Unselect All" : "Select All"}
          </button>
          <button className="btn btn-primary mb-3 ml-3" onClick={handleShiftChange} disabled={!selectedVet || selectedShifts.length === 0}>Assign</button>
          <table className="table table-bordered">
            <thead>
              <th>Work Shift</th>
              {[0, 1, 2, 3, 4, 5, 6].map(index => {
                const date = new Date(currentWeek);
                date.setDate(date.getDate() + index);
                return (
                  <th key={index} className="text-center">{`${formatDate(date)} (${formatDay(date)})`}</th>
                );
              })}
            </thead>
            <tbody>
              {shifts.map((shift, shiftIndex) => (
                <tr key={shiftIndex}>
                  <td className="align-middle text-center">{`${shift.from_time} - ${shift.to_time}`}</td>
                  {[0, 1, 2, 3, 4, 5, 6].map((dateIndex) => {
                    const date = new Date(currentWeek);
                    date.setDate(date.getDate() + dateIndex);
                    const isAssigned = shiftDetails.some(detail => detail.shift.shiftId === shift.shiftId && new Date(detail.date).toLocaleDateString('en-GB') === formatDate(date));
                    const isPast = isShiftInThePast(shift, date);
                    return (
                      <td
                        key={dateIndex}
                        className={`align-middle text-center ${isAssigned ? 'bg-success text-white' : ''}`}
                        style={{ position: 'relative', height: '40px' }}
                        onMouseEnter={(e) => {
                          const button = e.currentTarget.querySelector('.delete-btn');
                          if (button) button.style.display = 'block';
                        }}
                        onMouseLeave={(e) => {
                          const button = e.currentTarget.querySelector('.delete-btn');
                          if (button) button.style.display = 'none';
                        }}
                      >
                        {!isPast && !isAssigned && (
                          <input
                            type="checkbox"
                            style={{
                              cursor: 'pointer',
                              width: '20px',
                              height: '20px',
                            }}
                            onChange={() => handleToggleShift(shift.shiftId, date)}
                            checked={selectedShifts.some(item => item.shiftId === shift.shiftId && item.date === date.toISOString().split('T')[0])}
                            disabled={!selectedVet}
                          />
                        )}
                        {isAssigned && (
                          <div style={{ position: 'relative', height: '100%' }}>
                            <button
                              style={{
                                display: 'none',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                              }}
                              className="btn btn-danger delete-btn"
                              onClick={() => handleDeleteAssignment(shift.shiftId, date)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        {isPast && !isAssigned && (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
