<?php

use Modules\LessonGaugeChart\Widget;

?>

window.widget_lesson_gauge_chart_form = new class {

    init({color_palette}) {
        this._unit_select = document.getElementById('value_units');
        this._unit_value = document.getElementById('value_static_units');
        this._description = document.getElementById('description');

        this._unit_select.addEventListener('change', () => this.updateForm());

        this.updateForm();
    }

    updateForm() {
        this._unit_value.disabled = this._unit_select.value == <?= Widget::UNIT_AUTO ?>;
    }

    _sanitizeUTF8(value) {
        return value.replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
    }
};