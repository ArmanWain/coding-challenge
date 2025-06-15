import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

export const appConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(CommonModule, FormsModule, NgChartsModule)
  ]
};
