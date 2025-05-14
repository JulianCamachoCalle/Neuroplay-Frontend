import { TestBed } from '@angular/core/testing';

import { JwtHelperWapperService } from './jwt-helper-wapper.service';

describe('JwtHelperWapperService', () => {
  let service: JwtHelperWapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtHelperWapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
