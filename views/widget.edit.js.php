<?php

use Modules\LessonGaugeChart\Widget;

?>

window.widget_lesson_gauge_chart_form = new class {

    init({color_palette}) {
        this._unit_select = document.getElementById('value_units');
        this._unit_value = document.getElementById('value_static_units');
        this._description = document.getElementById('description');

        this._unit_select.addEventListener('change', () => this.updateForm());

        colorPalette.setThemeColors(color_palette);

        for (const colorpicker of jQuery('.<?= ZBX_STYLE_COLOR_PICKER ?> input')) {
            jQuery(colorpicker).colorpicker();
        }

        const overlay = overlays_stack.getById('widget_properties');

        for (const event of ['overlay.reload', 'overlay.close']) {
            overlay.$dialogue[0].addEventListener(event, () => {
                jQuery.colorpicker('hide');
            });
        }

        // vor Submit Felder bereinigen
        const form = document.querySelector('form');
        form.addEventListener('submit', () => {
            if (this._description) {
                this._description.value = this._sanitizeUTF8(this._description.value);
            }
            if (this._unit_value) {
                this._unit_value.value = this._sanitizeUTF8(this._unit_value.value);
            }
        });

        this.updateForm();
    }

    updateForm() {
        this._unit_value.disabled = this._unit_select.value == <?= Widget::UNIT_AUTO ?>;
    }

    _sanitizeUTF8(value) {
        return value.replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
    }
};
