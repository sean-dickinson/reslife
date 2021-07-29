import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTableHarness } from '@angular/material/table/testing';
import { MatTableModule } from '@angular/material/table';

import { ManageBoardersTableComponent } from './manage-boarders-table.component';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Boarder } from '@reslife/shared-models';
import { testBoarder } from '../../../test-helpers/testValues';

describe('ManageBoardersTableComponent', () => {
  let component: ManageBoardersTableComponent;
  let fixture: ComponentFixture<ManageBoardersTableComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageBoardersTableComponent ],
      imports: [
        MatTableModule,
        MatButtonModule,
        MatIconModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .overrideComponent(ManageBoardersTableComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBoardersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show no results if no boarders exist', async () => {
    expect(fixture.nativeElement.textContent).toContain('No Boarders Found');
    expect(await loader.getAllHarnesses(MatTableHarness)).toHaveLength(0);
  });
  describe('if boarders exist', () => {
    beforeEach(() => {
      component.boarders = [testBoarder];
      fixture.detectChanges();
    });
    it('should show the table when boarders exist', async () => {
      const table = await loader.getHarness(MatTableHarness);
      expect(table).toBeTruthy();
      const rows = await table.getRows(); 
      expect(rows.length).toBe(1);
      const cells = await rows[0].getCells();
      const cellTexts = await parallel(() => cells.map(cell => cell.getText()));
      expect(cellTexts).toEqual(['Test', '7 Day', 'editdelete']);
    });

    it('should emit the boarder and action type when an action is clicked', async () => {
      const spy = jest.spyOn(component.action, 'emit');
      const editButton = await loader.getHarness(MatButtonHarness.with({text: 'edit'}));
      await editButton.click();
      expect(spy).toHaveBeenCalledWith({action: 'edit', boarder: testBoarder});

      const deleteButton = await loader.getHarness(MatButtonHarness.with({text: 'delete'}));
      await deleteButton.click();
      expect(spy).toHaveBeenCalledWith({action: 'delete', boarder: testBoarder});
    });
  })

  
});