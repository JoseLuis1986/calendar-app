import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import { Navbar } from '../ui/Navbar';
import { messages } from '../../helpers/calendar-messages-es';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';

import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';


moment.locale('es');

const localizer = momentLocalizer(moment);

// const events = [{
//     title: "cumpleaños del jefe",
//     start: moment().toDate(),
//     end: moment().add(2, 'hours').toDate(),
//     bgcolor: '#fafafa',
//     notes: 'comprar el pastel',
//     user: {
//         _id: '123',
//         name: 'Jose Luis'
//     }
//     // allDay?: boolean,
//     // resource?: any,
// }]

export const CalendarScreen = () => {

    const dispatch = useDispatch();

    //TODO: leer del store, los eventos

    const { events, activeEvent } = useSelector(state => state.calendar);

    // console.log(eventos);

    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    const onDoubleClick = (e) => {

        dispatch(uiOpenModal());
    }

    const onSelectEvent = (e) => {

        dispatch(eventSetActive(e));
    }


    const onViewChange = (e) => {
        setLastView(e);

        localStorage.setItem('lastView', e);
    }

    const onSelectSlot = (e) => {
        //sirve tambien para seleccionar slot o casilla para agregar nuevo evento
        dispatch( eventClearActiveEvent() );
    }


    const eventStyleGetter = (event, start, end, isSelected) => {

        // console.log(event, start, end, isSelected);
        const style = {
            backgroundColor: '#367CF7',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block'
        }

        return {
            style
        }
    }

    return (
        <div className="calendar-screen">
            <Navbar />
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                eventPropGetter={eventStyleGetter}
                onDoubleClickEvent={onDoubleClick}
                onSelectSlot={ onSelectSlot }
                selectable={ true }
                onSelectEvent={onSelectEvent}
                onView={onViewChange}
                view={lastView}
                components={{
                    event: CalendarEvent
                }}
            />
            <AddNewFab />
            {
               (activeEvent) && <DeleteEventFab />
            }
            <CalendarModal />
        </div>
    )
}
