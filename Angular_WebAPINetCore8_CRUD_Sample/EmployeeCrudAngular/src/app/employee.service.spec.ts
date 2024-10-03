import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee } from './employee.model';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });

    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all employees by name', () => {
    const dummyEmployees: Employee[] = [
      new Employee(1, 'John Doe'),
      new Employee(2, 'Jane Smith')
    ];

    service.getAllEmployee().subscribe(employees => {
      expect(employees.length).toBe(2);
      employees.forEach((employee, index) => {
        expect(employee.name).toEqual(dummyEmployees[index].name);  // Validación por nombre
      });
    });

    const req = httpMock.expectOne(`${service.apiUrlEmployee}/getall`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyEmployees);
  });
});
