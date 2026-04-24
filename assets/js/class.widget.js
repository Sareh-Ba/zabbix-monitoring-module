console.log("Gauge Widget loaded!");

if (typeof WidgetLessonGaugeChart === 'undefined') {
    window.WidgetLessonGaugeChart = class WidgetLessonGaugeChart extends CWidget {

        static UNIT_AUTO = 0;
        static UNIT_STATIC = 1;

        onInitialize() {
            super.onInitialize();
            this._refresh_frame = null;
            this._chart_container = null;
            this._canvas = null;
            this._chart_color = null;
            this._min = 0;
            this._max = 100;
            this._value = null;
            this._last_value = null;
            this._units = '';
            this._display_type = 0;
            this._logical_size = 0;
        }

        processUpdateResponse(response) {
            const fields = response.fields_values ?? {};
            if (!response.history || response.history.value === undefined || response.history.value === null) {
                this._value = this._min;
                this._units = '';
            } else {
                this._value = Number(response.history.value);
                this._units = (fields.value_units == WidgetLessonGaugeChart.UNIT_AUTO)
                    ? (response.history.units ?? '')
                    : (fields.value_static_units ?? '');
            }
            this._chart_color = fields.chart_color ?? '1EB980';
            this._min = Number(fields.value_min ?? 0);
            this._max = Number(fields.value_max ?? 100);
            this._display_type = Number(fields.display_type ?? 0);

            super.processUpdateResponse(response);
        }

        setContents(response) {
            if (this._canvas === null) {
                super.setContents(response);
                this._chart_container = this._body.querySelector('.chart');
                const desc = this._body.querySelector('.description');
                const descHeight = desc ? desc.clientHeight : 0;
                this._chart_container.style.height =
                    `${this._getContentsSize().height - descHeight}px`;
                this._canvas = document.createElement('canvas');
                this._chart_container.appendChild(this._canvas);
                this._resizeChart();
            }
            this._updateChart();
        }

        onResize() {
            super.onResize();
            if (this._state === WIDGET_STATE_ACTIVE) {
                this._resizeChart();
            }
        }

        _resizeChart() {
            if (!this._canvas || !this._chart_container) return;
            const ctx = this._canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            this._canvas.style.display = 'none';
            const size = Math.min(
                this._chart_container.offsetWidth,
                this._chart_container.offsetHeight
            );
            this._canvas.style.display = '';
            this._canvas.width = size * dpr;
            this._canvas.height = size * dpr;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

            this._canvas.style.width = `${size}px`;
            this._canvas.style.height = `${size}px`;
            this._logical_size = size;
            this._refresh_frame = null;
            this._updateChart();
        }

        _updateChart() {
            if (this._last_value === null) this._last_value = this._min;
            const start_time = Date.now();
            const end_time = start_time + 400;
            const animate = () => {
                const time = Date.now();
                if (time <= end_time) {
                    const progress = (time - start_time) / (end_time - start_time);
                    const smooth_progress = 0.5 + Math.sin(Math.PI * (progress - 0.5)) / 2;
                    let value = this._value;
                    value = (this._last_value + (value - this._last_value) * smooth_progress - this._min)
                        / (this._max - this._min);
                    this._draw(value);
                    requestAnimationFrame(animate);
                } else {
                    this._last_value = this._value;
                    this._draw(
                        (this._value - this._min) / (this._max - this._min)
                    );
                }
            };
            requestAnimationFrame(animate);
        }

        _draw(normalizedValue) {
            switch (this._display_type) {
                case 0:
                    this._drawGauge(normalizedValue);
                    break;
                case 1:
                    this._drawBar(normalizedValue);
                    break;
                case 2:
                    this._drawNumber();
                    break;
                default:
                    this._drawGauge(normalizedValue);
            }
        }

        // ----------- Gauge Chart -----------
        _drawGauge(normalizedValue) {
            const ctx = this._canvas.getContext('2d');
            const size = this._logical_size;
            if (!size || size < 10 || isNaN(size)) return;
            const arcWidth = size * 0.13;
            const radius = (size - arcWidth) / 2;
            const centerX = size / 2;
            const centerY = size / 2;
            const startAngle = Math.PI * 0.75; // 135deg
            const endAngle = Math.PI * 2.25;   // 405deg

            ctx.clearRect(0, 0, size, size);

            // Arc Background
            ctx.save();
            ctx.lineWidth = arcWidth;
            ctx.strokeStyle = "#303846";
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
            ctx.stroke();
            ctx.restore();

            // Arc Value
            ctx.save();
            ctx.lineWidth = arcWidth * 0.93;
            ctx.strokeStyle = `#${this._chart_color}`;
            ctx.beginPath();
            ctx.arc(
                centerX, centerY, radius,
                startAngle,
                startAngle + (endAngle - startAngle) * Math.min(1, Math.max(0, normalizedValue)),
                false
            );
            ctx.stroke();
            ctx.restore();

            // Value Text
            ctx.save();
            ctx.font = `600 ${Math.round(size * 0.18)}px "Segoe UI", "Roboto", Arial, sans-serif`;
            ctx.fillStyle = "#FFF";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(
                this._value !== null ? this._value.toFixed(2) : '–',
                centerX,
                centerY - size * 0.05
            );
            ctx.font = `400 ${Math.round(size * 0.11)}px "Segoe UI", "Roboto", Arial, sans-serif`;
            ctx.fillStyle = "#B6BED4";
            ctx.textBaseline = "top";
            ctx.fillText(
                this._units,
                centerX,
                centerY + size * 0.08
            );
            ctx.restore();

            // Min / Max Label
            ctx.save();
            ctx.font = `400 ${Math.round(size * 0.08)}px "Segoe UI", "Roboto", Arial, sans-serif`;
            ctx.fillStyle = "#868E96";
            ctx.textAlign = "left";
            ctx.fillText(
                `${this._min}`,
                centerX - radius + 10,
                centerY + radius * 1.08
            );
            ctx.textAlign = "right";
            ctx.fillText(
                `${this._max}`,
                centerX + radius - 10,
                centerY + radius * 1.08
            );
            ctx.restore();
        }

        // ----------- Bar Chart -----------
        _drawBar(normalizedValue) {
            const ctx = this._canvas.getContext('2d');
            const size = this._logical_size;
            if (!size || size < 10 || isNaN(size)) return;

            ctx.clearRect(0, 0, size, size);

            const barWidth = size * 0.80;
            const barHeight = size * 0.23;
            const x = size * 0.10;
            const y = (size - barHeight) / 2;
            const radius = barHeight / 2;

            // Bar Background
            ctx.save();
            ctx.fillStyle = "#303846";
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + barWidth - radius, y);
            ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius);
            ctx.lineTo(x + barWidth, y + barHeight - radius);
            ctx.arcTo(x + barWidth, y + barHeight, x + barWidth - radius, y + barHeight, radius);
            ctx.lineTo(x + radius, y + barHeight);
            ctx.arcTo(x, y + barHeight, x, y + barHeight - radius, radius);
            ctx.lineTo(x, y + radius);
            ctx.arcTo(x, y, x + radius, y, radius);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // Bar Value
            ctx.save();
            ctx.fillStyle = `#${this._chart_color}`;
            ctx.beginPath();
            let valueLen = barWidth * Math.min(1, Math.max(0, normalizedValue));
            if (valueLen < radius) valueLen = radius;
            if (valueLen <= radius) {
                ctx.arc(x + radius, y + barHeight / 2, radius, Math.PI / 2, Math.PI * 1.5, false);
            } else {
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + valueLen - radius, y);
                ctx.arcTo(x + valueLen, y, x + valueLen, y + radius, radius);
                ctx.lineTo(x + valueLen, y + barHeight - radius);
                ctx.arcTo(x + valueLen, y + barHeight, x + valueLen - radius, y + barHeight, radius);
                ctx.lineTo(x + radius, y + barHeight);
                ctx.arcTo(x, y + barHeight, x, y + barHeight - radius, radius);
                ctx.lineTo(x, y + radius);
                ctx.arcTo(x, y, x + radius, y, radius);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // Value Text
            ctx.save();
            ctx.fillStyle = "#FFF";
            ctx.font = `600 ${Math.round(size * 0.13)}px "Segoe UI", "Roboto", Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                this._value !== null ? this._value.toFixed(2) : '–',
                x + barWidth / 2,
                y + barHeight / 2 - (size * 0.03)
            );
            ctx.font = `400 ${Math.round(size * 0.08)}px "Segoe UI", "Roboto", Arial, sans-serif`;
            ctx.fillStyle = "#B6BED4";
            ctx.fillText(
                this._units,
                x + barWidth / 2,
                y + barHeight / 2 + (size * 0.07)
            );
            ctx.restore();

            // Min / Max Label
            ctx.save();
            ctx.fillStyle = "#868E96";
            ctx.font = `400 ${Math.round(size * 0.07)}px "Segoe UI", "Roboto", Arial, sans-serif`;
            ctx.textAlign = 'left';
            ctx.fillText(
                `${this._min}`,
                x + 6,
                y + barHeight + (size * 0.045)
            );
            ctx.textAlign = 'right';
            ctx.fillText(
                `${this._max}`,
                x + barWidth - 6,
                y + barHeight + (size * 0.045)
            );
            ctx.restore();
        }

        // ----------- Number Chart -----------
        _drawNumber() {
            const ctx = this._canvas.getContext('2d');
            const size = this._logical_size;
            if (!size || size < 10 || isNaN(size)) return;

            ctx.clearRect(0, 0, size, size);

            // Main Value
            ctx.save();
            ctx.fillStyle = '#FFF';
            ctx.font = `600 ${Math.round(size * 0.28)}px "Segoe UI", "Roboto", Arial, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                this._value !== null ? this._value.toFixed(2) : '–',
                size / 2,
                size / 2 - (size * 0.05)
            );
            ctx.restore();

            // Unit
            ctx.save();
            ctx.font = `400 ${Math.round(size * 0.13)}px "Segoe UI", "Roboto", Arial, sans-serif`;
            ctx.fillStyle = "#B6BED4";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                this._units,
                size / 2,
                size / 2 + (size * 0.13)
            );
            ctx.restore();

            // min-max (Only once, subtle)
            ctx.save();
            ctx.font = `400 ${Math.round(size * 0.08)}px "Segoe UI", "Roboto", Arial, sans-serif`;
            ctx.fillStyle = '#686D7A';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                `${this._min} - ${this._max}`,
                size / 2,
                size * 0.83
            );
            ctx.restore();
        }
    };
}
