import { combineReducers } from "redux";
import { calendarReducer } from "./calendarReducer";
import { uiReducer } from "./uiReducers";


export const rootReducer = combineReducers({
    ui: uiReducer,
    calendar: calendarReducer
    //TODO: authReducer
    //TODO: CalendarReducer
})