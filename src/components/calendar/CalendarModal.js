import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { useDispatch } from 'react-redux';
import { eventAddNew, eventClearActiveEvent, eventUpdated } from '../../actions/events';



const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');


const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowPlus1.toDate()
}

export const CalendarModal = () => {

    // const [dateStart, setDateStart] = useState(now.toDate());
    // const [dateEnd, setDateEnd] = useState(nowPlus1.toDate());
    const [titleIsValid, setTitleIsValid] = useState(true);

    const { modalOpen } = useSelector( state => state.ui );
    const { activeEvent } = useSelector( state => state.calendar );

    // console.log(activeEvent);

    const dispatch = useDispatch();

    const [formValues, setFormValues] = useState( initEvent );
    // console.log(formValues);


    const { notes, title, start, end } = formValues;


    useEffect(() => {
        if( activeEvent ){
            setFormValues(activeEvent)
        }else {
            setFormValues( initEvent )
        }
    }, [activeEvent, setFormValues]);


    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const closeModal = () => {
        //TODO: Cerrar modal
        dispatch( uiCloseModal() );
        dispatch( eventClearActiveEvent() );
        setFormValues( initEvent );

    };

    const handleStartDateChange = (e) => {
        // setDateStart(e);
        setFormValues({
            ...formValues,
            start: e
        })
    };

    const handleEndDateChange = (e) => {
        // console.log(e);
        // setDateEnd(e);
        setFormValues({
            ...formValues,
            end: e
        })
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        const momentStart = moment( start );
        const momentEnd = moment( end );

        if( momentStart.isSameOrAfter( momentEnd, 'hour' )) {
            return Swal.fire('Error', 'La fecha final debe ser mayor que la fecha inicial', 'error');
        }

        if( title.trim().length < 2) {
            return setTitleIsValid(false);
        }
        if( activeEvent ) {
            dispatch( eventUpdated( formValues ));
        }else {
            //TODO: realizar grabacion
            dispatch(eventAddNew({
                ...formValues,
                id: new Date().getTime(),
                user: {
                    _id: '123',
                    name: 'Jose Luis'
                }
            }));
        }

        // console.log("mi formulario", formValues);

        setTitleIsValid(true);
        closeModal();
    }


    return (
        <div>
            <Modal
                isOpen={ modalOpen }
                // onAfterOpen={ afterOpenModal }
                onRequestClose={closeModal}
                style={customStyles}
                closeTimeoutMS={200}
                className="modal"
                overlayClassName="modal-fondo"
            >
                <h1>{ (activeEvent) ? 'Editar Evento' : 'Nuevo Evento'}</h1>
                <hr />
                <form
                    className="container"
                    onSubmit={ handleSubmitForm }
                    noValidate
                >

                    <div className="form-group">
                        <label>Fecha y hora inicio</label>
                        <DateTimePicker
                            onChange={handleStartDateChange}
                            value={start}
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Fecha y hora fin</label>
                        <DateTimePicker
                            onChange={handleEndDateChange}
                            value={end}
                            minDate={start}
                            className="form-control"
                        />
                    </div>

                    <hr />
                    <div className="form-group">
                        <label>Titulo y notas</label>
                        <input
                            type="text"
                            name="title"
                            className={`form-control ${ !titleIsValid && 'is-invalid'} `}
                            placeholder="Título del evento"
                            autoComplete="off"
                            value={title}
                            onChange={handleInputChange}
                        />
                        <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                    </div>

                    <div className="form-group">
                        <textarea
                            type="text"
                            name="notes"
                            className="form-control"
                            placeholder="Notas"
                            rows="5"
                            value={notes}
                            onChange={handleInputChange}
                        ></textarea>
                        <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-outline-primary btn-block"
                    >
                        <i className="far fa-save"></i>
                        <span> Guardar</span>
                    </button>

                </form>
            </Modal>
        </div>
    )
}
