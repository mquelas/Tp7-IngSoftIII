import { TestBed } from '@angular/core/testing';
import { AddemployeeComponent } from './addemployee.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs'; // Para simular observables
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // Asegúrate de tener ngx-toastr instalado
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Employee } from '../employee.model'; // Ajusta la ruta según la estructura de tu proyecto

describe('AddemployeeComponent', () => {
  let component: AddemployeeComponent;
  let fixture: any;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AddemployeeComponent // Importa el componente aquí
      ],
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute, // Simula ActivatedRoute
          useValue: {
            params: of({ id: 1 }) // Simula el parámetro 'id' en la URL
          }
        },
        { provide: ToastrService, useValue: toastrSpy } // Proporciona el servicio simulado
      ],
      schemas: [NO_ERRORS_SCHEMA] // Previene errores sobre componentes no reconocidos
    }).compileComponents(); // Compila los componentes

    fixture = TestBed.createComponent(AddemployeeComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    // Inicializa newEmployee con un valor predeterminado
    component.newEmployee = new Employee(1, 'John Doe'); // Modifica el nombre según sea necesario
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error if name is less than 2 characters', () => {
    component.newEmployee.name = 'A A'; // Nombre con partes de menos de 2 caracteres
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('Cada parte del nombre debe tener al menos dos caracteres.'); // Mensaje de error actualizado
  });

  it('should display error if name is empty or just spaces', () => {
    component.newEmployee.name = ''; // Nombre vacío
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no puede estar vacío o compuesto solo de espacios.'); // Mensaje de error actualizado

    component.newEmployee.name = '   '; // Nombre que solo tiene espacios
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no puede estar vacío o compuesto solo de espacios.'); // Mensaje de error actualizado
  });

  it('should not display errors for valid name', () => {
    component.newEmployee.name = 'John Doe'; // Nombre válido
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).not.toHaveBeenCalled();
  });

  it('should display error if name contains numbers', () => {
    component.newEmployee.name = 'John123'; // Nombre con números
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no debe contener números.'); // Asegúrate que coincida con el mensaje en el componente
  });
  

  it('should display error if name exceeds 100 characters', () => {
    component.newEmployee.name = 'A'.repeat(101); // Nombre que excede 100 caracteres
    component.addEmployee(component.newEmployee);
    expect(toastrService.error).toHaveBeenCalledWith('El nombre no debe tener más de 100 caracteres.'); // Mensaje de error actualizado
  });
});
