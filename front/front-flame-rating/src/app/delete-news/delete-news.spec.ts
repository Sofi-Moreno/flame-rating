import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNews } from './delete-news';

describe('DeleteNews', () => {
  let component: DeleteNews;
  let fixture: ComponentFixture<DeleteNews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteNews]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteNews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
