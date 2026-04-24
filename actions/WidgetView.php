<?php

namespace Modules\LessonGaugeChart\Actions;

use API,
    CControllerDashboardWidgetView,
    CControllerResponseData;

class WidgetView extends CControllerDashboardWidgetView {

    protected function doAction(): void {
        $history_value = 0.0;
        $units = '';
        $item_name = 'Test Gauge';

        $itemid = !empty($this->fields_values['itemid']) && is_array($this->fields_values['itemid'])
            ? reset($this->fields_values['itemid'])
            : null;

        if (!empty($itemid)) {
            $db_items = API::Item()->get([
                'output' => ['itemid', 'value_type', 'name', 'units'],
                'itemids' => [$itemid]
            ]);

            if (!empty($db_items)) {
                $item = reset($db_items);
                $item_name = $item['name'] ?? $item_name;

                $history = API::History()->get([
                    'output' => 'extend',
                    'itemids' => [$item['itemid']],
                    'history' => (int) $item['value_type'],
                    'sortfield' => 'clock',
                    'sortorder' => ZBX_SORT_DOWN,
                    'limit' => 1
                ]);

                if (!empty($history)) {
                    $history_value = (float) $history[0]['value'];
                    $units = $item['units'] ?? '';
                }
            }
        }

        $description = $this->fields_values['description'] ?? '';

        $response_data = [
            'name' => $item_name,
            'history' => [
                'value' => $history_value,
                'units' => mb_convert_encoding($units, 'UTF-8', 'UTF-8')
            ],
            'fields_values' => [
                'value_min' => $this->fields_values['value_min'] ?? 0,
                'value_max' => $this->fields_values['value_max'] ?? 100,
                'chart_color' => $this->fields_values['chart_color'] ?? 'FF465C',
                'value_units' => $this->fields_values['value_units'] ?? 0,
                'value_static_units' => mb_convert_encoding(($this->fields_values['value_static_units'] ?? ''), 'UTF-8', 'UTF-8'),
                'description' => mb_convert_encoding($description, 'UTF-8', 'UTF-8'),
                'display_type' => $this->fields_values['display_type'] ?? 0
            ],
            'user' => [
                'debug_mode' => $this->getDebugMode()
            ]
        ];

        $this->setResponse(new CControllerResponseData(
            json_decode(json_encode($response_data, JSON_INVALID_UTF8_IGNORE), true)
        ));
    }
}
