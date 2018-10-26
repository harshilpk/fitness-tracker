import { Exercise} from './exercise.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromRoot from '../app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class TrainingService {
  // private availableExercises: Exercise[] = [
  //   { id: 'crunches', name: 'Crunches', duration: 25, calories: 10 },
  //   { id: 'touch-toes', name: 'Touch Toes', duration: 450, calories: 30 },
  //   { id: 'bungee', name: 'Bungee', duration: 80, calories: 30 },
  //   { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 50}
  // ];
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[];
  private runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  private exercises: Exercise[] = [];
  private fbSubscription: Subscription [] = [];
  // private finishedExercises: Exercise[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService,
              private store: Store<fromRoot.State>) {}

  getAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
   //  return this.availableExercises.slice();
   this.fbSubscription.push(this.db.collection('availableExercises').snapshotChanges()
    .pipe(map(docData => {
     // throw(new Error());
      return docData.map(doc => {
        // console.log(doc);
        return {
          id: doc.payload.doc.id,
          name: doc.payload.doc.data()['name'],
          duration: doc.payload.doc.data()['duration'],
          calories: doc.payload.doc.data()['calories']
        };
      });
    })).subscribe((exercises: Exercise[]) => {
      this.store.dispatch(new UI.StopLoading());
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
    }, error => {
      // console.log(error);
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackBar('Fetching Exercises failed, please try again later!!', null, 3000);
      this.exercisesChanged.next(null);
    }));
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExecises/' + selectedId).update({lastSelected: new Date()});
    const selectedExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.runningExercise = selectedExercise;
    this.exerciseChanged.next({...this.runningExercise});
  }

  getRunningExercise() {
    return  { ...this.runningExercise };
  }

  completeExercise() {
    this.addDataToFirebase({...this.runningExercise, date: new Date(), state: 'completed'});
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToFirebase({...this.runningExercise,
      date: new Date(),
      state: 'canceled',
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100)
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelSubscriptions() {
    this.fbSubscription.forEach(sub => sub.unsubscribe());
  }

  getCompletedOrCanceledExercises() {
    // return this.exercises.slice();
    this.fbSubscription.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
      // this.finishedExercises = exercises;
      this.finishedExercisesChanged.next(exercises);
    }));
  }

  private addDataToFirebase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }


}
