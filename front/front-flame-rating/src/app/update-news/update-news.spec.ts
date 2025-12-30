import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateNews } from './update-news';

describe('UpdateNews', () => {
  let component: UpdateNews;
  let fixture: ComponentFixture<UpdateNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateNews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateNews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
