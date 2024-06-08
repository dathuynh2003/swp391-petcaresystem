import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function VetWorkSchedules() {
  const [shifts, setShifts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [dates, setDates] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/shifts/all', { withCredentials: true });
        setShifts(response.data);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    const fetchSchedule = async () => {
      try {
        const response = await axios.get('http://localhost:8080/shifts/vet-shift', { withCredentials: true });
        setSchedule(response.data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    const getWeekDates = (date) => {
      const firstDayOfWeek = date.getDate() - date.getDay() + 1; // Ngày đầu tiên của tuần (thứ 2)
      const weekDates = Array.from({ length: 7 }, (_, i) => {
        const newDate = new Date(date);
        newDate.setDate(firstDayOfWeek + i);
        return newDate;
      });
      setDates(weekDates);
    };

    fetchShifts();
    fetchSchedule();
    getWeekDates(currentWeek);
  }, [currentWeek]);

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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB'); // Định dạng ngày thành dd/mm/yyyy
  };

  const formatDay = (date) => {
    return date.toLocaleDateString('en-GB', { weekday: 'short' }); // Định dạng ngày thành Mon, Tue, Wed, ...
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 border rounded p-4 mt-2 shadow">
          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-primary" onClick={handlePreviousWeek}>Previous Week</button>
            <button className="btn btn-primary" onClick={handleNextWeek}>Next Week</button>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Work Shift</th>
                {dates.map((date, index) => (
                  <th key={index} className="text-center">{`${formatDate(date)} (${formatDay(date)})`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shifts.map((shift, shiftIndex) => (
                <tr key={shiftIndex}>
                  <td className="align-middle text-center">{`${shift.from_time} - ${shift.to_time}`}</td>
                  {dates.map((date, dateIndex) => {
                    const scheduledShift = schedule.find(
                      (item) =>
                        new Date(item.date).toLocaleDateString('en-GB') === formatDate(date) &&
                        item.shift.shiftId === shift.shiftId
                    );
                    return (
                      <td key={dateIndex} className={`align-middle text-center ${scheduledShift ? 'bg-success text-white' : ''}`}>
                        {scheduledShift ? scheduledShift.status : ''}
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
