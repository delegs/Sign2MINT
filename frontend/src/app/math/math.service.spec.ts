import { MathService } from './math.service';

describe('AppMathService', () => {
  let service: MathService;

  beforeEach(() => {
    service = new MathService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
