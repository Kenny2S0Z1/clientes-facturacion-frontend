import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OAtuh2RedirectComponent } from './oatuh2-redirect-component';

describe('OAtuh2RedirectComponent', () => {
  let component: OAtuh2RedirectComponent;
  let fixture: ComponentFixture<OAtuh2RedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OAtuh2RedirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OAtuh2RedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
