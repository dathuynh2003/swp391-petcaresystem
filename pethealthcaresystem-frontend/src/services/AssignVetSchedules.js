import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { Button } from '@chakra-ui/react';
import { CheckCircleIcon, CheckIcon, DeleteIcon } from "@chakra-ui/icons";
import { URL } from '../utils/constant';
export default function AssignVetSchedules() {
  const [vets, setVets] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [shiftDetails, setShiftDetails] = useState([]);
  const [selectedVet, setSelectedVet] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedShifts, setSelectedShifts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    axios.get(`${URL}/vets`, { withCredentials: true })
      .then(response => setVets(response.data.vets))
      .catch(error => console.error('Error fetching vets:', error));

    axios.get(`${URL}/shifts/all`, { withCredentials: true })
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
    axios.get(`${URL}/shifts/details`, { withCredentials: true })
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
    setSelectAll(false); // Reset selectAll state
    setSelectedShifts([]); // Clear selected shifts
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentWeek);
    nextWeek.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(nextWeek);
    setSelectAll(false); // Reset selectAll state
    setSelectedShifts([]); // Clear selected shifts
  };

  const handleShiftChange = () => {
    if (selectedShifts.length === 0) {
      toast.error('Please select at least one shift to assign.');
      return;
    }

    const vetShiftDetails = selectedShifts?.map(shift => ({
      user: { userId: selectedVet },
      shift: { shiftId: shift.shiftId },
      date: shift.date,
      status: 'Available'
    }));

    axios.put(`${URL}/shifts/assign-vet`, vetShiftDetails, { withCredentials: true })
      .then(response => {
        toast.success('Shifts assigned successfully!');
        setSelectedShifts([]);
        fetchShiftDetails();
      })
      .catch(error => {
        console.error('Error assigning shifts:', error);
        toast.error('Error assigning shifts. Please try again.');
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
    axios.delete(`${URL}/shifts/delete-vet-shift`, {
      params: {
        shiftId: shiftId,
        vetId: selectedVet,
        date: dateString
      },
      withCredentials: true
    })
      .then(response => {
        toast.success('Shift unassigned successfully!');
        fetchShiftDetails();
      })
      .catch(error => {
        console.error('Error unassigning shift:', error);
        toast.error('Error unassigning shift. Please try again.');
      });
  };

  const isShiftInThePast = (shift, date) => {
    const now = new Date();
    if (date.toDateString() !== now.toDateString()) {
      return date < now;
    }
    const [shiftStartHour, shiftStartMinute] = shift.from_time.split(':')?.map(Number);
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
          <div className="form-group">
            <div className="vet-selection">
              <h4 style={{ marginBottom: '10px' }}>Select Vet:</h4>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '10px'
              }}>
                {vets?.map(vet => (
                  <Button
                    key={vet.userId}
                    style={{
                      padding: '10px',
                      backgroundColor: selectedVet === vet.userId ? '#008080' : 'transparent',
                      color: selectedVet === vet.userId ? '#fff' : '#000',
                      border: '1px solid #008080',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s, color 0.3s'
                    }}
                    onClick={() => setSelectedVet(vet.userId)}
                  >
                    {vet.fullName}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <Button onClick={handlePreviousWeek} style={{ background: 'teal', color: 'white' }}>
              Previous Week
            </Button>
            <Button onClick={handleNextWeek} style={{ background: 'teal', color: 'white' }}>
              Next Week
            </Button>
          </div>
          <Button onClick={handleSelectAll} style={{ background: 'teal', color: 'white' }}>
            {selectAll ? "Unselect All" : "Select All"}
          </Button>
          <Button onClick={handleShiftChange} disabled={!selectedVet || selectedShifts.length === 0}
            style={{ background: 'teal', color: 'white' }} className="mx-3">
            Assign
          </Button>
          <table className="table table-bordered">
            <thead>
              <th>Work Shift</th>
              {[0, 1, 2, 3, 4, 5, 6]?.map(index => {
                const date = new Date(currentWeek);
                date.setDate(date.getDate() + index);
                return (
                  <th key={index} className="text-center">{`${formatDate(date)} (${formatDay(date)})`}</th>
                );
              })}
            </thead>
            <tbody>
              {shifts?.map((shift, shiftIndex) => (
                <tr key={shiftIndex}>
                  <td className="align-middle text-center">{`${shift.from_time} - ${shift.to_time}`}</td>
                  {[0, 1, 2, 3, 4, 5, 6]?.map((dateIndex) => {
                    const date = new Date(currentWeek);
                    date.setDate(date.getDate() + dateIndex);
                    const isAssigned = shiftDetails.some(detail => detail.shift.shiftId === shift.shiftId && new Date(detail.date).toLocaleDateString('en-GB') === formatDate(date));
                    const isPast = isShiftInThePast(shift, date);
                    const isChecked = selectedShifts.some(item => item.shiftId === shift.shiftId && item.date === date.toISOString().split('T')[0]);
                    return (
                      <td
                        key={dateIndex}
                        className={`align-middle text-center ${isAssigned ? '' : ''}`}
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
                              backgroundColor: isChecked ? 'teal' : 'transparent',
                              border: '2px solid teal',
                              borderRadius: '3px', /* Optional: for rounded corners */
                              appearance: 'none',
                              WebkitAppearance: 'none',
                            }}
                            onChange={() => handleToggleShift(shift.shiftId, date)}
                            checked={selectedShifts.some(item => item.shiftId === shift.shiftId && item.date === date.toISOString().split('T')[0])}
                            disabled={!selectedVet}
                          />
                        )}
                        {isAssigned && !isPast && (
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
                              <DeleteIcon />
                            </button>
                            <CheckIcon style={{ color: "teal" }} />
                          </div>
                        )}
                        {isAssigned && isPast && (
                          <div style={{ position: 'relative', height: '100%' }}>
                            <CheckIcon style={{ color: "teal" }} />
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
