<?php

// Macedonian messages for the rules the public booking form uses. Anything not listed here
// falls back to Laravel's English messages (APP_FALLBACK_LOCALE).
return [
    'after' => 'Изберете датум после :date.',
    'date' => 'Внесете валиден датум.',
    'email' => 'Внесете валидна е-пошта.',
    'exists' => 'Избраната вредност не е валидна.',
    'max' => [
        'string' => 'Полето може да има најмногу :max знаци.',
    ],
    'required' => 'Ова поле е задолжително.',
    'string' => 'Внесете текст.',

    'attributes' => [
        'client_name' => 'име',
        'client_email' => 'е-пошта',
        'client_phone' => 'телефон',
        'preferred_date' => 'датум',
        'today' => 'денес',
    ],

    'values' => [
        'preferred_date' => [
            'today' => 'денес',
        ],
    ],
];
