import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  minDate: Date;
  maxDate: Date;

  form: FormGroup
  constructor(translate: TranslateService, http: HttpClient, private _formBuilder: FormBuilder,
  ) {

    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang()
    translate.use(browserLang);
    // laod from api
    const arabicFile$ = http.get('assets/fake-api/dummyAr.json');
    const englishFile$ = http.get('assets/fake-api/dummyEn.json');


    // mock api merging files to translation fille
    forkJoin([
      arabicFile$,
      englishFile$,
      translate.getTranslation(browserLang),
    ]).subscribe(res => {
      let arabicFile = res[0];
      let englishFile = res[1];
      let fileTomerge =
        translate.currentLang === 'en'
          ? englishFile
          : arabicFile;
      translate.setTranslation(
        'en',
        {
          ...fileTomerge
        },
        true
      );
      console.log(arabicFile, englishFile)
    })


  }
  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 20, 0, 1);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.form = this._formBuilder.group({
      name: [
        null,
        Validators.compose([
          Validators.required,

        ]),
      ],
      date: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ]

    });
  }




}
