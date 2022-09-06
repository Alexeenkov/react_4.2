import React from 'react';
import s from './Training.module.css';

const Form = ({ inputState, onInput, onSubmit }) => {

    return (
        <form action='#' method='#' onSubmit={onSubmit}>
            <label className={s['date-container']} htmlFor="date">
                <span className={s['title']}>Дата (ДД.ММ.ГГ)</span>
                <input className={s['input']} type="date" name='date' onChange={onInput} value={inputState.date}/>
            </label>
            <label className={s['distance-container']} htmlFor="distance">
                <span className={s['title']}>Пройдено км</span>
                <input className={s['input']} type="number" name='distance' onChange={onInput} value={inputState.distance}/>
            </label>
            <button type='submit'>Ок</button>
        </form>
    );
}

export default Form;