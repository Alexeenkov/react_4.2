import React, { useState } from 'react';
import s from './Training.module.css';
import Form from './Form';
import Table from './Table';
import { v4 as uuidv4 } from 'uuid';

const Training = () => {
    // В inputState хранится состояние полей ввода
    const [inputState, setInputState] = useState({
        date: '',
        distance: '',
    });

    // В resultsState хранятся записанные результаты
    const [resultsState, setResultsState] = useState([
        { id: '3', date: '2019-07-18', distance: '5.7' },
        { id: '2', date: '2019-07-19', distance: '3.4' },
        { id: '1', date: '2019-07-20', distance: '1.2' },
    ]);

    /**
     * Функция обновляет состояние контроллируемых полей ввода
     * @param {HTMLElement} target - элемент, на котором вызываем данный обработчик
     */
    const handlerInput = ({ target }) => {
        const value = target.value;
        const name = target.name;
        setInputState(prevInputState => {
            return { ...prevInputState, [name]: value };
        });
    };

    /**
     * Функция обновляет состояние в соответствии с введенными данными в поля ввода при отправке данных
     * @param {Event} e - событие отправки формы 
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputState.date === '' || inputState.distance === '') return; // Здесь могла быть ваша валидация (нормальная, а не вот это вот всё)
        setResultsState(prevResultsState => {
            const enteredDate = inputState.date; // Введенная пользователем дата
            const enteredDateFormated = new Date(enteredDate); // Введенная пользователем дата в формате даты JS
            const enteredDistance = inputState.distance; // Введенная пользователем дистанция
            const newResult = prevResultsState.slice(); // Клонируем массив с результатами
            let lastRecordOfTable = null; // Значение самой старой даты
            if (newResult.length > 0) {
                // Если таблица результатов не пустая, запоминаем старую дату (чтоб лишний раз не итерироваться по массиву)
                lastRecordOfTable = new Date(newResult[0].date);
            }
            if (newResult.length === 0) {
                // Если результатов нет, то добавляем первую запись
                newResult.push({ id: uuidv4(), date: enteredDate, distance: enteredDistance });
            } else if (lastRecordOfTable && enteredDateFormated.getTime() === lastRecordOfTable.getTime()) {
                // Если введенная дата равна последней записи в таблице, обновляем ее дистанцию
                newResult[0] = { id: newResult[0].id, date: newResult[0].date, distance: Number(newResult[0].distance) + Number(enteredDistance) };
            } else if (lastRecordOfTable && enteredDateFormated < lastRecordOfTable) {
                // Если введенная дата старше последней записи, добавляем запись в конец таблицы
                newResult.unshift({ id: uuidv4(), date: enteredDate, distance: enteredDistance });
            } else {
                // В остальных случаях бежим по по записям с конца массива (с самых свежих до самых старых)
                for (let i = newResult.length - 1; i >= 0; i--) {
                    const checkDateFormated = new Date(newResult[i].date);
                    if (i === newResult.length - 1 && enteredDateFormated > checkDateFormated) {
                        // Если введенная дата свежее первой записи в таблице результатов, добавляем ее в начало таблицы
                        newResult.push({ id: uuidv4(), date: enteredDate, distance: enteredDistance });
                        break;
                    }
                    if (enteredDateFormated.getTime() === checkDateFormated.getTime()) {
                        // Если введенная дата равна проверяемой, обновляем ее дистанцию
                        newResult[i] = { id: newResult[i].id, date: newResult[i].date, distance: Number(newResult[i].distance) + Number(enteredDistance) };
                        break;
                    }
                    if (enteredDateFormated > checkDateFormated) {
                        // Если введенная дата свежее проверяемой, то добавляем ее перед ней
                        newResult.splice(i + 1, 0, { id: uuidv4(), date: enteredDate, distance: enteredDistance });
                        break;
                    }
                }
            }

            return [...newResult];
        });
        setInputState({
            date: '',
            distance: '',
        });
    };

    const handlerDeleteButton = (index) => {
        setResultsState(prevResultsState => {
            const newResult = prevResultsState.slice();
            newResult.splice(index, 1);
            return [...newResult];
        });
    }

    const handlerEditButton = (index) => {
        handlerDeleteButton(index);
        setInputState({
            date: resultsState[index].date,
            distance: resultsState[index].distance,
        });
    }

    return (
        <div className={s['wrapper']}>
            <div className={s['form-container']}>
                <Form inputState={inputState} onInput={handlerInput} onSubmit={handleSubmit} />
            </div>
            <div className={s['table-container']}>
                <Table tableResult={resultsState} onClickDelete={handlerDeleteButton} onClickEdit={handlerEditButton} />
            </div>
        </div>
    );
}

export default Training;