import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
// import { AngularFirestore } from 'angularfire2/firestore';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // @Output() trainingStart = new EventEmitter<void>();
  constructor(private trainingService: TrainingService,
              private store: Store<fromRoot.State>) { }
  // trainings: Exercise[] = [];
  // trainings: Observable<Exercise[]>;
  trainings: Exercise[];
  trainingSubscription: Subscription;
  // isLoading = true;
  isLoading$: Observable<boolean>;

  ngOnInit() {
    // this.trainings = this.trainingService.getAvailableExercises();
    this.trainingSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      // this.isLoading = false;
      this.trainings = exercises;
    });
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.training);
  }

  ngOnDestroy() {
    if (this.trainingSubscription) {
      this.trainingSubscription.unsubscribe();
    }
  }
}
