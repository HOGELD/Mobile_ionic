import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  registerCredentialsForm: FormGroup;

  constructor(
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.registerCredentialsForm = this.formBuilder.group({
      email: [' ', [Validators.required, Validators.email]],
      password: [' ', [Validators.required, Validators.minLength(6)]]
    });
  }

}
