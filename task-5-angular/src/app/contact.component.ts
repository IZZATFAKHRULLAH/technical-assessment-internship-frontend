import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { ContactPayload, DataService } from './data.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  contactForm: FormGroup;
  statusMessage = '';
  isSubmitting = false;
  lastSubmittedId?: number;
  submittedResult?: ContactPayload;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dataService: DataService,
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get subject() {
    return this.contactForm.get('subject');
  }

  get message() {
    return this.contactForm.get('message');
  }

  onSubmit(): void {
    this.statusMessage = '';
    this.lastSubmittedId = undefined;
    this.submittedResult = undefined;

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    this.isSubmitting = true;

    this.dataService
      .sendData(payload)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response) => {
          this.lastSubmittedId = response.id;
          this.submittedResult = response;
          this.statusMessage = 'Message sent successfully through an HTTP POST request.';
          this.contactForm.reset();
        },
        error: () => {
          this.statusMessage = 'The message could not be sent. Please try again.';
        },
      });
  }

  private buildPayload(): ContactPayload {
    const formValue = this.contactForm.getRawValue();

    return {
      name: formValue.name.trim(),
      email: formValue.email.trim(),
      subject: formValue.subject.trim(),
      message: formValue.message.trim(),
      submittedAt: new Date().toISOString(),
    };
  }
}
