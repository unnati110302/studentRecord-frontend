import React from 'react';
import './style.css';
import { ScheduleComponent, Inject, Agenda, Day, Month, Week, WorkWeek } from '@syncfusion/ej2-react-schedule';

const Schedule = () => {

  return (
    <ScheduleComponent 
      currentView='Month'
      height='650px'
    > 
      <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
    </ScheduleComponent>  
  );
}

export default Schedule;
