import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {CustomValidators} from '../../utils/custom-validators';

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
      password: [' ',
        Validators.compose(
            [
                Validators.required,
              // check whether the entered password has a number
              CustomValidators.patternValidator(/\d/, {
                hasNumber: true
              }),
              // check whether the entered password has upper case letter
              CustomValidators.patternValidator(/[A-Z]/, {
                hasCapitalCase: true
              }),
              // check whether the entered password has a lower case letter
              CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true
              }),
              // check whether the entered password has a special character
              CustomValidators.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
                hasSpecialCharacters: true
              }),
                Validators.minLength(8)
            ])
      ],
         confirmPassword: [null, Validators.compose([Validators.required])]
    }, {
      // check whether our password and confirm password match
      validator: CustomValidators.passwordMatchValidator
        }
    );
  }

  submit() {
    // signup
    console.log(this.registerCredentialsForm.value);
  }

}
