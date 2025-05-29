import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedContentSliderComponent } from './featured-content-slider.component';

describe('FeaturedContentSliderComponent', () => {
  let component: FeaturedContentSliderComponent;
  let fixture: ComponentFixture<FeaturedContentSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedContentSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedContentSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
