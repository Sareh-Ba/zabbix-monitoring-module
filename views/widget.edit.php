<?php

/**
 * Gauge chart widget form view.
 *
 * @var CView $this
 * @var array $data
 */

// Farbpalette für den Color-Picker
$default_color_palette = [
    'FF465C', 'B0AF07', '0EC9AC', '524BBC', 'ED1248', 'D1E754', '2AB5FF', '385CC7', 'EC1594', 'BAE37D',
    '6AC8FF', 'EE2B29', '3CA20D', '6F4BBC', '00A1FF', 'F3601B', '1CAE59', '45CFDB', '894BBC', '6D6D6D'
];

// Einheiten-Felder vorbereiten
$units_select = new CWidgetFieldSelectView($data['fields']['value_units']);
$units_static = (new CWidgetFieldTextBoxView($data['fields']['value_static_units']))
    ->setPlaceholder(_('value'))
    ->setWidth(ZBX_TEXTAREA_TINY_WIDTH);

// Anzeigeart vorbereiten (Display type)
$display_type = new CWidgetFieldSelectView($data['fields']['display_type']);

// Formular zusammenstellen
(new CWidgetFormView($data))
    ->addField(
        // Item-Auswahl (nur numerische Items erlaubt)
        (new CWidgetFieldMultiSelectItemView($data['fields']['itemid']))
            ->setPopupParameter('numeric', true)
    )
    ->addFieldset(
        (new CWidgetFormFieldsetCollapsibleView(_('Advanced configuration')))
            ->addField(
                new CWidgetFieldColorView($data['fields']['chart_color'])
            )
            ->addField(
                new CWidgetFieldNumericBoxView($data['fields']['value_min'])
            )
            ->addField(
                new CWidgetFieldNumericBoxView($data['fields']['value_max'])
            )
            ->addItem([
                $units_select->getLabel(),
                (new CFormField([
                    $units_select->getView()->addClass(ZBX_STYLE_FORM_INPUT_MARGIN),
                    $units_static->getView()
                ]))
            ])
            ->addField(
                (new CWidgetFieldTextBoxView($data['fields']['description']))
                    ->setPlaceholder(_('Optional description'))
            )
            ->addField(
                $display_type
            )
    )
    ->includeJsFile('widget.edit.js.php')
    ->addJavaScript(
        'widget_lesson_gauge_chart_form.init('.json_encode([
            'color_palette' => $default_color_palette
        ]).');'
    )
    ->show();
