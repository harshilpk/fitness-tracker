import { Exercise} from './exercise.model';
import { Subject } from 'rxjs';

export class TrainingService {
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 25, calories: 10 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 450, calories: 30 },
    { id: 'bungee', name: 'Bungee', duration: 80, calories: 30 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 50}
  ];
  private runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  private exercises: Exercise[] = [];

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    const selectedExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.runningExercise = selectedExercise;
    this.exerciseChanged.next({...this.runningExercise});
  }

  getRunningExercise() {
    return  { ...this.runningExercise };
  }

  completeExercise() {
    this.exercises.push({...this.runningExercise, date: new Date(), state: 'completed'});
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({...this.runningExercise,
      date: new Date(),
      state: 'canceled',
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100)
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getCompletedOrCanceledExercises() {
    return this.exercises.slice();
  }


}
