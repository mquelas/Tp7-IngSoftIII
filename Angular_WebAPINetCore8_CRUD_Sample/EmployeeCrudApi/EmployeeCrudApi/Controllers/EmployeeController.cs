using EmployeeCrudApi.Data;
using EmployeeCrudApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;


namespace EmployeeCrudApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<Employee>> GetAll()
        {
            return await _context.Employees.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetById(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
            {
                return NotFound($"Empleado con ID {id} no encontrado.");
            }
            return employee;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Employee employee)
        {
            // 1. Verificar que el nombre no esté vacío o solo compuesto de espacios
            if (string.IsNullOrWhiteSpace(employee.Name))
            {
                return BadRequest("El nombre no puede estar vacío o compuesto solo de espacios.");
            }

            // 2. Validar longitud máxima del nombre y apellido
            if (employee.Name.Length > 100)
            {
                return BadRequest("El nombre y apellido deben tener una longitud máxima de 100 caracteres.");
            }

            // 3. Validar longitud mínima del nombre
            if (employee.Name.Length < 2)
            {
                return BadRequest("El nombre debe tener al menos dos caracteres.");
            }

            // 4. Validar que el nombre no contenga números
            if (Regex.IsMatch(employee.Name, @"\d"))
            {
                return BadRequest("El nombre no debe contener números.");
            }

            // 5. Verificar que cada parte del nombre tenga al menos 2 caracteres
            var nameParts = employee.Name.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            foreach (var part in nameParts)
            {
                if (part.Length < 2)
                {
                    return BadRequest("Cada parte del nombre debe tener al menos dos caracteres.");
                }
            }

            // Configurar la fecha de creación
            employee.CreatedDate = DateTime.Now;

            // Guardar el empleado en la base de datos
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Employee employee)
        {
            var employeeToUpdate = await _context.Employees.FindAsync(employee.Id);
            if (employeeToUpdate == null)
            {
                return NotFound($"Empleado con ID {employee.Id} no encontrado.");
            }

            // Actualizar las propiedades necesarias
            employeeToUpdate.Name = employee.Name;
            // Aquí puedes agregar más propiedades a actualizar si es necesario

            await _context.SaveChangesAsync();
            return Ok(employeeToUpdate);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var employeeToDelete = await _context.Employees.FindAsync(id);
            if (employeeToDelete == null)
            {
                return NotFound($"Empleado con ID {id} no encontrado.");
            }

            _context.Employees.Remove(employeeToDelete);
            await _context.SaveChangesAsync();
            return NoContent(); // Indica que se ha eliminado correctamente
        }
    }
}


