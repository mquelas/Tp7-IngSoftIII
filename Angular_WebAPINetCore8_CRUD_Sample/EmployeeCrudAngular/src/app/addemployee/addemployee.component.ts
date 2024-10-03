import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee.model';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addemployee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {
  newEmployee: Employee = new Employee(0, '', '');
  submitBtnText: string = "Create";
  imgLoadingDisplay: string = 'none';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService // Asegúrate de inyectar ToastrService aquí
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const employeeId = params['id'];
      if (employeeId) this.editEmployee(employeeId);
    });
  }

  addEmployee(employee: Employee) {
    // Validación 1: El nombre no puede estar vacío o ser solo espacios
    if (!employee.name.trim()) {
      this.toastr.error('El nombre no puede estar vacío o compuesto solo de espacios.'); // Mensaje de error corregido
      return;
    }

    // Validación 2: La longitud máxima del nombre es 100 caracteres
    if (employee.name.length > 100) {
      this.toastr.error('El nombre no debe tener más de 100 caracteres.'); // Mensaje de error corregido
      return;
    }

    // Validación 3: El nombre debe tener al menos 2 caracteres
    if (employee.name.trim().length < 2) {
      this.toastr.error('Cada parte del nombre debe tener al menos dos caracteres.'); // Mensaje de error corregido
      return;
    }

    // Validación 4: El nombre no debe contener números
    const regex = /\d/;
   // Parte relevante del AddemployeeComponent
    if (regex.test(employee.name)) {
      this.toastr.error('El nombre no debe contener números.'); // Mensaje corregido
      return;
    }
    // Validación 5: Cada parte del nombre debe tener al menos dos caracteres
    const nameParts = employee.name.trim().split(/\s+/); // Divide en partes usando múltiples espacios como separador
    
    // Verificar si cada parte tiene al menos dos caracteres
    const isValid = nameParts.every(part => part.length >= 2);

    if (nameParts.length === 0 || !isValid) {
      this.toastr.error('Cada parte del nombre debe tener al menos dos caracteres.'); // Mensaje de error corregido
      return;
    }

    // Si todas las validaciones pasan, se crea el empleado
    employee.createdDate = new Date().toISOString();
    this.employeeService.createEmployee(employee).subscribe(result => {
      this.router.navigate(['/']);
    });
  }

  editEmployee(employeeId: number) {
    this.employeeService.getEmployeeById(employeeId).subscribe(res => {
      this.newEmployee.id = res.id;
      this.newEmployee.name = res.name;
      this.submitBtnText = "Edit";
    });
  }
}
