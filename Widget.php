<?php

namespace Modules\LessonGaugeChart;

use Zabbix\Core\CWidget;
use CControllerResponseData;

class Widget extends CWidget {
    public const UNIT_AUTO = 0;
    public const UNIT_STATIC = 1;

    /**
     * Übersetzungen für JS.
     */
    public function getTranslationStrings(): array {
        return [
            'class.widget.js' => [
                'No data' => _('No data')
            ]
        ];
    }

    /**
     * Diese Methode wird beim Speichern des Widgets aufgerufen.
     */
    public function doEdit(): CControllerResponseData {
        return new CControllerResponseData([
            'name' => _('Lesson Gauge Chart')
        ]);
    }
}
