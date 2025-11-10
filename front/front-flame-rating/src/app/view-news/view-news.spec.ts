import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNews } from './view-news';

describe('ViewNews', () => {
  let component: ViewNews;
  let fixture: ComponentFixture<ViewNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewNews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
