import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    standalone: true,
    selector: 'app-search-widget',
    imports: [CommonModule, FormsModule, IconFieldModule, InputIconModule, InputTextModule],
    template: `
        <div class="col-span-12">
            <div class="card">
                <p-iconfield iconPosition="left" class="w-full">
                    <p-inputicon styleClass="pi pi-search" />
                    <input type="text" pInputText placeholder="Tìm kiếm chức năng, nhân viên, tài liệu..." class="w-full" [(ngModel)]="searchQuery" />
                </p-iconfield>
            </div>
        </div>
    `
})
export class SearchWidget {
    searchQuery: string = '';
}
