import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  color: #333;
`;

const CalendarBox = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e9ecef;
  margin-bottom: 2rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const MonthYear = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
`;

const NavButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #0056b3;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #dee2e6;
  border-radius: 8px;
  overflow: hidden;
`;

const DayHeader = styled.div`
  background: #007bff;
  color: white;
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
`;

const DayCell = styled.div`
  background: white;
  min-height: 80px;
  padding: 0.5rem;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f8f9fa;
  }

  &.other-month {
    background: #f8f9fa;
    color: #6c757d;
  }

  &.today {
    background: #e3f2fd;
    color: #1976d2;
    font-weight: 600;
  }

  &.has-appointment {
    background: #d4edda;
    color: #155724;
  }

  &.selected {
    background: #007bff;
    color: white;
  }
`;

const AppointmentDot = styled.div`
  width: 6px;
  height: 6px;
  background: #28a745;
  border-radius: 50%;
  position: absolute;
  bottom: 4px;
  right: 4px;
`;

const AppointmentsList = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e9ecef;
`;

const AppointmentsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
`;

const AppointmentCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const BarberName = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const AppointmentDetails = styled.div`
  color: #6c757d;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
`;

const Appointments = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock appointments - Updated to current dates (September 2025)
  const mockAppointments = [
    {
      id: '1',
      barber: { name: 'John Smith' },
      service: { name: 'Haircut & Beard Trim' },
      date: '2025-09-10',
      time: '10:00 AM',
      status: 'confirmed',
      duration: 60,
      price: 45
    },
    {
      id: '2',
      barber: { name: 'Mike Johnson' },
      service: { name: 'Hair Styling' },
      date: '2025-09-12',
      time: '2:30 PM',
      status: 'pending',
      duration: 45,
      price: 35
    },
    {
      id: '3',
      barber: { name: 'David Wilson' },
      service: { name: 'Full Service' },
      date: '2025-09-15',
      time: '11:00 AM',
      status: 'confirmed',
      duration: 90,
      price: 65
    }
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getLastDayOfPreviousMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const hasAppointment = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockAppointments.some(apt => apt.date === dateStr);
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return mockAppointments.filter(apt => apt.date === dateStr);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const lastDayPrevMonth = getLastDayOfPreviousMonth(currentDate);
    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = lastDayPrevMonth - i;
      days.push(
        <DayCell key={`prev-${day}`} className="other-month">
          {day}
        </DayCell>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const hasApt = hasAppointment(date);
      const isSelectedDay = isSelected(date);
      const isTodayDay = isToday(date);

      days.push(
        <DayCell
          key={day}
          className={`${isTodayDay ? 'today' : ''} ${hasApt ? 'has-appointment' : ''} ${isSelectedDay ? 'selected' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          {day}
          {hasApt && <AppointmentDot />}
        </DayCell>
      );
    }

    // Next month days
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <DayCell key={`next-${day}`} className="other-month">
          {day}
        </DayCell>
      );
    }

    return days;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container>
      <Title>{t('appointments.title')}</Title>
      
      <CalendarBox>
        <CalendarHeader>
          <NavButton onClick={() => navigateMonth(-1)}>
            ← Previous
          </NavButton>
          <MonthYear>
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </MonthYear>
          <NavButton onClick={() => navigateMonth(1)}>
            Next →
          </NavButton>
        </CalendarHeader>
        
        <CalendarGrid>
          <DayHeader>Sun</DayHeader>
          <DayHeader>Mon</DayHeader>
          <DayHeader>Tue</DayHeader>
          <DayHeader>Wed</DayHeader>
          <DayHeader>Thu</DayHeader>
          <DayHeader>Fri</DayHeader>
          <DayHeader>Sat</DayHeader>
          {renderCalendar()}
        </CalendarGrid>
      </CalendarBox>

      <AppointmentsList>
        <AppointmentsTitle>
          Appointments for {formatDate(selectedDate)}
        </AppointmentsTitle>
        
        {getAppointmentsForDate(selectedDate).length > 0 ? (
          getAppointmentsForDate(selectedDate).map(appointment => (
            <AppointmentCard key={appointment.id}>
              <BarberName>{appointment.barber.name}</BarberName>
              <AppointmentDetails>
                <div><strong>{appointment.service.name}</strong></div>
                <div>�� {appointment.date} at {appointment.time}</div>
                <div>⏱️ Duration: {appointment.duration} minutes</div>
                <div>💰 Price: ${appointment.price}</div>
                <div>Status: {appointment.status}</div>
              </AppointmentDetails>
            </AppointmentCard>
          ))
        ) : (
          <EmptyState>
            No appointments scheduled for this date.
          </EmptyState>
        )}
      </AppointmentsList>
    </Container>
  );
};

export default Appointments;