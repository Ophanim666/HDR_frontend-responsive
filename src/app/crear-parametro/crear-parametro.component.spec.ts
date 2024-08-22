import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearParametroComponent } from './crear-parametro.component';

describe('CrearParametroComponent', () => {
  let component: CrearParametroComponent;
  let fixture: ComponentFixture<CrearParametroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearParametroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearParametroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
