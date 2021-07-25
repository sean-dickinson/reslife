import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import {
  CheckInDocument,
  CheckInItem,
  CheckInRecord,
  ExcusedRecord,
} from '@reslife/check-ins/check-in-model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { getTimeDiff, combineDatetime } from '@reslife/utils';

@Injectable({
  providedIn: 'root',
})
export class CheckInDataService {
  private selectedCheckInDocument!: AngularFirestoreDocument<CheckInDocument>;
  constructor(private af: AngularFirestore) {}

  setCheckIn(date: string, checkin: string): void {
    if(date && checkin){
      this.selectedCheckInDocument = this.af.doc<CheckInDocument>(
        `check-ins/${date}+${checkin}`
      );
    }
  }

  getCheckInOpts(date: string): Observable<string[]> {
    const checkInCollection = this.af.collection<CheckInDocument>(
      'check-ins',
      (ref) => ref.where('date', '==', date)
    );
    return checkInCollection
      .valueChanges()
      .pipe(map((docs) => docs.map((d) => d['check-in'])));
  }
  getToCheck(): Observable<CheckInItem[]> {
    if (this.selectedCheckInDocument) {
      return this.selectedCheckInDocument
        .collection<CheckInItem>('expected')
        .valueChanges();
    } else {
      return of([]);
    }
  }
  getChecked(): Observable<CheckInRecord[]> {
    if (this.selectedCheckInDocument) {
      return this.selectedCheckInDocument
        .collection<CheckInRecord>('checked')
        .valueChanges();
    } else {
      return of([]);
    }
  }
  getExcused(): Observable<ExcusedRecord[]> {
    if (this.selectedCheckInDocument) {
      return this.selectedCheckInDocument
        .collection<ExcusedRecord>('excused')
        .valueChanges();
    } else {
      return of([]);
    }
  }
  async checkIn(item: CheckInItem, overrideLate = false): Promise<void> {
    const record: CheckInRecord = { ...item };

    if (!overrideLate) {
      const snap = await this.selectedCheckInDocument.get().toPromise();
      const endTime = snap.get('end') as string;
      const endDate = combineDatetime(new Date(), endTime);
      const currentTime = new Date();
      const timeDiff = getTimeDiff(endDate, currentTime);
      if (timeDiff > 5) {
        record.code = 'LT';
      }
    }
    const batch = this.af.firestore.batch();
    batch.delete(
      this.selectedCheckInDocument.collection('expected').doc(item.uid).ref
    );
    batch.set(
      this.selectedCheckInDocument.collection('checked').doc(item.uid).ref,
      record
    );
    return batch.commit();
  }

  unCheckIn(record: CheckInRecord): Promise<void> {
    const item: CheckInItem = {
      uid: record.uid,
      name: record.name
    };

    const batch = this.af.firestore.batch();

    batch.set(
      this.selectedCheckInDocument.collection('expected').doc(item.uid).ref,
      item
    );
    batch.delete(
      this.selectedCheckInDocument.collection('checked').doc(item.uid).ref
    );

    return batch.commit();
  }
}
