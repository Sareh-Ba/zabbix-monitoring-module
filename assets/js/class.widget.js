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
            const end_time = start_time + 500;
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
                    this._draw((this._value - this._min) / (this._max - this._min));
                }
            };
            requestAnimationFrame(animate);
        }

        _draw(normalizedValue) {
            switch (this._display_type) {
                case 0: this._drawGauge(normalizedValue); break;
                case 1: this._drawBar(normalizedValue); break;
                case 2: this._drawNumber(); break;
                default: this._drawGauge(normalizedValue);
            }
        }

        _isDark() {
            return document.body.classList.contains('dark-mode') ||
                   document.documentElement.getAttribute('data-theme') === 'dark' ||
                   document.body.classList.contains('theme-dark');
        }

        _hexAlpha(hex, a) {
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `rgba(${r},${g},${b},${a})`;
        }

        _getColors() {
            const dark = this._isDark();
            return {
                track:    dark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)',
                textCol:  dark ? '#f0f2ff' : '#111827',
                subCol:   dark ? '#8892b0' : '#6b7280',
                labelCol: dark ? '#4b5578' : '#9ca3af',
                dotBg:    dark ? '#1e2130' : '#ffffff',
            };
        }

        _drawGauge(normalizedValue) {
            const ctx = this._canvas.getContext('2d');
            const size = this._logical_size;
            if (!size || size < 10 || isNaN(size)) return;

            const color = this._chart_color;
            const C = this._getColors();
            const aw = size * 0.10;
            const r = (size - aw * 2 - 16) / 2;
            const cx = size / 2, cy = size / 2;
            const sa = Math.PI * 0.75, ea = Math.PI * 2.25, span = ea - sa;

            ctx.clearRect(0, 0, size, size);

            // tick marks
            for (let i = 0; i <= 10; i++) {
                const a = sa + span * (i / 10);
                const r1 = r + aw * 0.75;
                const r2 = r + aw * 1.05 + (i % 5 === 0 ? 5 : 0);
                ctx.save();
                ctx.strokeStyle = i % 5 === 0 ? C.subCol : C.labelCol;
                ctx.lineWidth = i % 5 === 0 ? 2 : 1;
                ctx.beginPath();
                ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
                ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
                ctx.stroke();
                ctx.restore();
            }

            // track arc
            ctx.save();
            ctx.lineCap = 'round'; ctx.lineWidth = aw; ctx.strokeStyle = C.track;
            ctx.beginPath(); ctx.arc(cx, cy, r, sa, ea); ctx.stroke();
            ctx.restore();

            // glow
            if (normalizedValue > 0.01) {
                ctx.save();
                ctx.lineCap = 'round'; ctx.lineWidth = aw + 12;
                ctx.strokeStyle = this._hexAlpha(color, 0.13);
                ctx.beginPath(); ctx.arc(cx, cy, r, sa, sa + span * normalizedValue); ctx.stroke();
                ctx.restore();
            }

            // value arc
            ctx.save();
            ctx.lineCap = 'round'; ctx.lineWidth = aw; ctx.strokeStyle = `#${color}`;
            ctx.beginPath(); ctx.arc(cx, cy, r, sa, sa + span * Math.max(0.001, normalizedValue)); ctx.stroke();
            ctx.restore();

            // needle dot
            const angle = sa + span * normalizedValue;
            const dx = cx + Math.cos(angle) * r;
            const dy = cy + Math.sin(angle) * r;
            ctx.save();
            ctx.fillStyle = C.dotBg;
            ctx.strokeStyle = `#${color}`; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(dx, dy, aw * 0.40, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.restore();

            // status badge
            const pct = Math.round(normalizedValue * 100);
            const badgeColor = pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : `#${color}`;
            const bw = 68, bh = 22, bx = cx - bw / 2, by = cy - size * 0.33;
            ctx.save();
            ctx.fillStyle = badgeColor + '26';
            ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 11); ctx.fill();
            ctx.font = `500 11px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
            ctx.fillStyle = badgeColor; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(pct + '% used', cx, by + bh / 2);
            ctx.restore();

            // main value
            ctx.save();
            ctx.font = `600 ${Math.round(size * 0.17)}px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
            ctx.fillStyle = C.textCol; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(this._value !== null ? this._value.toFixed(1) : '--', cx, cy - size * 0.04);
            ctx.font = `400 ${Math.round(size * 0.09)}px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
            ctx.fillStyle = C.subCol; ctx.textBaseline = 'top';
            ctx.fillText(this._units, cx, cy + size * 0.07);
            ctx.restore();

            // min/max
            ctx.save();
            ctx.font = `400 ${Math.round(size * 0.07)}px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
            ctx.fillStyle = C.labelCol;
            ctx.textAlign = 'left'; ctx.fillText(String(this._min), cx - r + 4, cy + r * 1.06);
            ctx.textAlign = 'right'; ctx.fillText(String(this._max), cx + r - 4, cy + r * 1.06);
            ctx.restore();
        }

        _drawBar(normalizedValue) {
            const ctx = this._canvas.getContext('2d');
            const size = this._logical_size;
            if (!size || size < 10 || isNaN(size)) return;

            const color = this._chart_color;
            const C = this._getColors();
            ctx.clearRect(0, 0, size, size);

            const bw = size * 0.84, bh = 20;
            const x = (size - bw) / 2, y = size / 2, rad = bh / 2;

            // value text
            ctx.save();
            ctx.font = `600 ${Math.round(size * 0.17)}px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
            ctx.fillStyle = C.textCol; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
            ctx.fillText(this._value !== null ? this._value.toFixed(1) : '--', size / 2, y - 30);
            ctx.font = `400 ${Math.round(size * 0.09)}px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
            ctx.fillStyle = C.subCol;
            ctx.fillText(this._units, size / 2, y - 10);
            ctx.restore();

            // track
            ctx.save(); ctx.fillStyle = C.track;
            this._roundRect(ctx, x, y, bw, bh, rad); ctx.fill(); ctx.restore();

            // segment dividers
            for (let i = 1; i < 10; i++) {
                ctx.save();
                ctx.fillStyle = this._isDark() ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.6)';
                ctx.fillRect(x + bw * (i / 10) - 1, y, 2, bh);
                ctx.restore();
            }

            // value fill
            if (normalizedValue > 0.01) {
                ctx.save();
                const grad = ctx.createLinearGradient(x, 0, x + bw, 0);
                grad.addColorStop(0, this._hexAlpha(color, 0.75));
                grad.addColorStop(1, `#${color}`);
                ctx.fillStyle = grad;
                this._roundRect(ctx, x, y, Math.max(bw * normalizedValue, rad * 2), bh, rad);
                ctx.fill(); ctx.restore();
            }

            // % pill above bar
            const pct = Math.round(normalizedValue * 100);
            const pw = 52, ph = 20;
            const rawPx = x + bw * normalizedValue - pw / 2;
            const px2 = Math.min(Math.max(rawPx, x), x + bw - pw);
            ctx.save();
            ctx.fillStyle = this._hexAlpha(color, 0.18);
            ctx.beginPath(); ctx.roundRect(px2, y - ph - 8, pw, ph, 10); ctx.fill();
            ctx.font = `500 11px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
            ctx.fillStyle = `#${color}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(pct + '%', px2 + pw / 2, y - ph / 2 - 8);
            ctx.restore();

            // min/max
            ctx.save();
            ctx.font = `400 ${Math.round(size * 0.07)}px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
            ctx.fillStyle = C.labelCol;
            ctx.textAlign = 'left'; ctx.fillText(String(this._min), x, y + bh + 16);
            ctx.textAlign = 'right'; ctx.fillText(String(this._max), x + bw, y + bh + 16);
            ctx.restore();
        }

        _drawNumber() {
            const ctx = this._canvas.getContext('2d');
            const size = this._logical_size;
            if (!size || size < 10 || isNaN(size)) return;

            const color = this._chart_color;
            const C = this._getColors();
            const nv = this._value !== null
                ? Math.min(1, Math.max(0, (this._value - this._min) / (this._max - this._min)))
                : 0;

            ctx.clearRect(0, 0, size, size);

            // outer decorative ring
            ctx.save(); ctx.lineWidth = 1.5;
            ctx.strokeStyle = this._isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
            ctx.beginPath(); ctx.arc(size/2, size/2, size/2 - 16, 0, Math.PI*2); ctx.stroke();
            ctx.restore();

            // progress ring background
            ctx.save(); ctx.lineWidth = 9; ctx.lineCap = 'round';
            ctx.strokeStyle = C.track;
            ctx.beginPath(); ctx.arc(size/2, size/2, size/2 - 22, 0, Math.PI*2); ctx.stroke();
            ctx.restore();

            // progress ring value
            if (nv > 0.01) {
                ctx.save(); ctx.lineWidth = 9; ctx.lineCap = 'round';
                ctx.strokeStyle = `#${color}`;
                ctx.beginPath();
                ctx.arc(size/2, size/2, size/2 - 22, -Math.PI/2, -Math.PI/2 + Math.PI * 2 * nv);
                ctx.stroke(); ctx.restore();
            }

            // inner ring
            ctx.save(); ctx.lineWidth = 1;
            ctx.strokeStyle = this._isDark() ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
            ctx.beginPath(); ctx.arc(size/2, size/2, size/2 - 48, 0, Math.PI*2); ctx.stroke();
            ctx.restore();

            // main value
            ctx.save();
            ctx.font = `600 ${Math.round(size * 0.26)}px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
            ctx.fillStyle = C.textCol; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(this._value !== null ? this._value.toFixed(1) : '--', size/2, size/2 - size*0.06);
            ctx.font = `400 ${Math.round(size * 0.10)}px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
            ctx.fillStyle = C.subCol; ctx.textBaseline = 'top';
            ctx.fillText(this._units, size/2, size/2 + size*0.08);
            ctx.font = `400 ${Math.round(size * 0.07)}px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
            ctx.fillStyle = C.labelCol; ctx.textBaseline = 'middle';
            ctx.fillText(`${this._min} - ${this._max}`, size/2, size * 0.87);
            ctx.restore();

            // % badge top
            const pct = Math.round(nv * 100);
            ctx.save();
            ctx.fillStyle = this._hexAlpha(color, 0.15);
            ctx.beginPath(); ctx.roundRect(size/2 - 30, size * 0.14, 60, 22, 11); ctx.fill();
            ctx.font = `500 11px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif`;
            ctx.fillStyle = `#${color}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(pct + '%', size/2, size * 0.14 + 11);
            ctx.restore();
        }

        _roundRect(ctx, x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y);
            ctx.arcTo(x+w, y, x+w, y+r, r);
            ctx.lineTo(x+w, y+h-r);
            ctx.arcTo(x+w, y+h, x+w-r, y+h, r);
            ctx.lineTo(x+r, y+h);
            ctx.arcTo(x, y+h, x, y+h-r, r);
            ctx.lineTo(x, y+r);
            ctx.arcTo(x, y, x+r, y, r);
            ctx.closePath();
        }
    };
}