<?php

namespace Modules\LessonGaugeChart\Includes;

use Modules\LessonGaugeChart\Widget;
use Zabbix\Widgets\CWidgetForm;
use Zabbix\Widgets\CWidgetField;
use Zabbix\Widgets\Fields\{
    CWidgetFieldColor,
    CWidgetFieldMultiSelectItem,
    CWidgetFieldNumericBox,
    CWidgetFieldSelect,
    CWidgetFieldTextBox
};

class WidgetForm extends CWidgetForm {
    public function addFields(): self {
        return $this
            ->addField(
                (new CWidgetFieldMultiSelectItem('itemid', _('Item')))
                    ->setFlags(CWidgetField::FLAG_NOT_EMPTY | CWidgetField::FLAG_LABEL_ASTERISK)
                    ->setMultiple(false) // nur 1 Item erlaubt
            )
            ->addField(
                (new CWidgetFieldColor('chart_color', _('Color')))
                    ->setDefault('FF465C')
            )
            ->addField(
                (new CWidgetFieldNumericBox('value_min', _('Min')))
                    ->setDefault(0)
                    ->setFlags(CWidgetField::FLAG_NOT_EMPTY | CWidgetField::FLAG_LABEL_ASTERISK)
            )
            ->addField(
                (new CWidgetFieldNumericBox('value_max', _('Max')))
                    ->setDefault(100)
                    ->setFlags(CWidgetField::FLAG_NOT_EMPTY | CWidgetField::FLAG_LABEL_ASTERISK)
            )
            ->addField(
                (new CWidgetFieldSelect('value_units', _('Units'), [
                    Widget::UNIT_AUTO   => _('Auto'),
                    Widget::UNIT_STATIC => _('Static')
                ]))
                    ->setDefault(Widget::UNIT_AUTO)
            )
            ->addField(
                (new CWidgetFieldTextBox('value_static_units', _('Static Units')))
                    ->setDefault('')
            )
            ->addField(
                (new CWidgetFieldTextBox('description', _('Description')))
                    ->setDefault('')
            )
            ->addField(
                (new CWidgetFieldSelect('display_type', _('Display type'), [
                    0 => _('Gauge'),
                    1 => _('Bar'),
                    2 => _('Number')
                ]))
                    ->setDefault(0)
            );
    }
}
