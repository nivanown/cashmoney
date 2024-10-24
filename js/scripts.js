/*- gl-filter -*/
document.addEventListener('DOMContentLoaded', function() {

    // Функция для фильтрации символов (оставляем только цифры)
    function filterInputValue(value) {
        return value.replace(/[^\d]/g, ''); // Удаляет все, кроме цифр
    }

    // Функция для форматирования числа с пробелами
    function formatNumber(value) {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    // Функция для обновления ширины ползунка по значению
    function updateSliderFromInput(slider, value, min, max) {
        const percentage = ((value - min) / (max - min)) * 100;
        slider.style.width = `${percentage}%`;
    }

    // Функция для динамического изменения ширины input
    function adjustInputWidth(input) {
        const span = document.createElement('span');
        span.style.visibility = 'hidden'; // Скрываем элемент, чтобы он не мешал
        span.style.whiteSpace = 'nowrap'; // Чтобы текст не переносился на новую строку
        span.style.fontSize = window.getComputedStyle(input).fontSize; // Устанавливаем ту же размерность текста, что и в input
        span.innerText = input.value || input.placeholder; // Берем текст из input

        document.body.appendChild(span); // Добавляем временно в документ для вычисления
        input.style.width = `${span.offsetWidth + 10}px`; // Устанавливаем ширину input с небольшим отступом
        document.body.removeChild(span); // Удаляем span
    }

    // Функция для обновления ползунка при перемещении
    function updateSlider(e, slider, line, minAmount, maxAmount, resultInput) {
        const lineRect = line.getBoundingClientRect();
        let offsetX;

        if (e.touches) {
            offsetX = e.touches[0].clientX - lineRect.left; // Для сенсорных устройств
        } else {
            offsetX = e.clientX - lineRect.left; // Для мыши
        }

        // Ограничение перемещения внутри линии
        if (offsetX < 0) offsetX = 0;
        if (offsetX > lineRect.width) offsetX = lineRect.width;

        // Вычисление процента и изменение ширины ползунка
        const percentage = (offsetX / lineRect.width) * 100;
        slider.style.width = `${percentage}%`;

        // Обновление значения в input
        const amount = Math.round((percentage / 100) * (maxAmount - minAmount) + minAmount);
        resultInput.value = formatNumber(amount.toString()); // Форматируем значение с пробелами

        // Изменяем ширину input в зависимости от значения
        adjustInputWidth(resultInput);
    }

    // Инициализация всех ползунков
    document.querySelectorAll('.gl-filter').forEach(function(filter) {
        const slider = filter.querySelector('.gl-filter__line-slider');
        const line = filter.querySelector('.gl-filter__line');
        const resultInput = filter.querySelector('.gl-filter__result');
        
        // Получаем минимальные и максимальные значения для данного ползунка из атрибутов data
        const minAmount = parseInt(filter.getAttribute('data-min'), 10);
        const maxAmount = parseInt(filter.getAttribute('data-max'), 10);
        
        let isDragging = false;

        // Функция для инициализации ползунка при загрузке страницы
        function initSlider() {
            let initialValue = resultInput.value.replace(/\s+/g, ''); // Удаляем пробелы
            let numericValue = parseInt(initialValue);

            if (isNaN(numericValue)) {
                numericValue = minAmount; // Если введено неверное значение, выставляем минимум
            }

            // Ограничиваем значение в рамках допустимого диапазона
            if (numericValue < minAmount) numericValue = minAmount;
            if (numericValue > maxAmount) numericValue = maxAmount;

            // Устанавливаем начальное значение ползунка
            updateSliderFromInput(slider, numericValue, minAmount, maxAmount);
            adjustInputWidth(resultInput); // Изменяем ширину input при инициализации
        }

        // Обработчик изменения значения в input
        resultInput.addEventListener('input', function() {
            // Очищаем ввод от всего, кроме цифр
            let value = filterInputValue(resultInput.value);
            let numericValue = parseInt(value);

            if (isNaN(numericValue)) {
                numericValue = minAmount;
            }

            // Ограничиваем значение от minAmount до maxAmount
            if (numericValue < minAmount) numericValue = minAmount;
            if (numericValue > maxAmount) numericValue = maxAmount;

            // Обновляем значение в input и добавляем пробелы
            resultInput.value = formatNumber(numericValue.toString());

            // Обновляем ширину ползунка
            updateSliderFromInput(slider, numericValue, minAmount, maxAmount);

            // Изменяем ширину input в зависимости от значения
            adjustInputWidth(resultInput);
        });

        // Обработчики для мыши
        slider.addEventListener('mousedown', function() {
            isDragging = true;
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            updateSlider(e, slider, line, minAmount, maxAmount, resultInput);
        });

        // Обработчики для сенсорных устройств
        slider.addEventListener('touchstart', function() {
            isDragging = true;
        });

        document.addEventListener('touchend', function() {
            isDragging = false;
        });

        document.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            updateSlider(e, slider, line, minAmount, maxAmount, resultInput);
        });

        // Инициализируем ползунок при загрузке страницы
        initSlider();
    });
});

/*- accordion -*/
const accordions = document.querySelectorAll('.accordion__title-panel');

accordions.forEach(accordion => {
    accordion.addEventListener('click', function () {
        this.classList.toggle('active');

    const panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
    } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
});

/*- mobile menu -*/
const headerCol = document.querySelector('.header__col');
const menuBtn = document.querySelector('.menu-btn');

// Обработчик клика на кнопку меню
menuBtn.addEventListener('click', function(event) {
    event.stopPropagation(); // Останавливаем распространение события
    headerCol.classList.toggle('show');
    menuBtn.classList.toggle('close');
});

// Обработчик клика на свободную область
document.addEventListener('click', function(event) {
    if (!menuBtn.contains(event.target) && !headerCol.contains(event.target)) {
        // Если клик был не по кнопке или меню, удаляем классы
        headerCol.classList.remove('show');
        menuBtn.classList.remove('close');
    }
});







