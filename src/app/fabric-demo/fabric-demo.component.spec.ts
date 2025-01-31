import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricDemoComponent } from './fabric-demo.component';

describe('FabricDemoComponent', () => {
  let component: FabricDemoComponent;
  let fixture: ComponentFixture<FabricDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabricDemoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FabricDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});