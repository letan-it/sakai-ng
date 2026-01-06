import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        AI Agents by
        <a href="https://letan-it.github.io/Portfolio/" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Lê Quốc Tấn</a>
    </div>`
})
export class AppFooter {}
