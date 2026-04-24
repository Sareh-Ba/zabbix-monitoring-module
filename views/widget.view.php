<?php

/**
 * Gauge chart widget view.
 *
 * @var CView $this
 * @var array $data
 */

// Sicherstellen, dass der Header UTF-8 ausgibt
header('Content-Type: text/html; charset=UTF-8');

(new CWidgetView($data))
    ->addItem([
        // Beschreibung (Description) — ??? ??? ???? ????? ??? ???
        (!empty($data['fields_values']['description']))
            ? (new CDiv(htmlspecialchars($data['fields_values']['description'], ENT_QUOTES, 'UTF-8')))
                ->addClass('description')
            : null,
        // Chart-CANVAS
        (new CDiv())->addClass('chart')
    ])
    ->setVar('history', $data['history'])
    ->setVar('fields_values', $data['fields_values'])
    ->show();
