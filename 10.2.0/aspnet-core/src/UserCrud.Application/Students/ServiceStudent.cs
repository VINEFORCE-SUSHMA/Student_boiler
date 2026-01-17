using Abp.Application.Services;
using Abp.Authorization;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UserCrud.Authorization;
using UserCrud.Core.Entities;
using UserCrud.Students.Dto;

namespace UserCrud.Students
{
    [AbpAuthorize(PermissionNames.Pages_Students)]
    public class StudentService : ApplicationService, IStudentService
    {
        private readonly List<Student> _students = new();
        private int _idCounter = 1;

        // GET ALL
        public async Task<List<StudentDto>> GetAllStudentsAsync()
        {
            var result = _students.Select(s => new StudentDto
            {
                Id = s.Id,
                Name = s.Name,
                Email = s.Email,
                DateOfBirth = s.DateOfBirth
            }).ToList();

            return await Task.FromResult(result);
        }

        // GET BY ID
        public async Task<StudentDto?> GetStudentByIdAsync(int id)
        {
            var student = _students.FirstOrDefault(s => s.Id == id);
            if (student == null)
                return null;

            return await Task.FromResult(new StudentDto
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                DateOfBirth = student.DateOfBirth
            });
        }

        // CREATE
        public async Task<StudentDto> CreateStudentAsync(CreateStudentDto input)
        {
            var student = new Student
            {
                Id = _idCounter++, // IMPORTANT
                Name = input.Name,
                Email = input.Email,
                DateOfBirth = input.DateOfBirth
            };

            _students.Add(student);

            return await Task.FromResult(new StudentDto
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                DateOfBirth = student.DateOfBirth
            });
        }

        // UPDATE
        public async Task<StudentDto?> UpdateStudentAsync(UpdateStudentDto input)
        {
            var student = _students.FirstOrDefault(s => s.Id == input.Id);
            if (student == null)
                return null;

            student.Name = input.Name;
            student.Email = input.Email;
            student.DateOfBirth = input.DateOfBirth;

            return await Task.FromResult(new StudentDto
            {
                Id = student.Id,
                Name = student.Name,
                Email = student.Email,
                DateOfBirth = student.DateOfBirth
            });
        }

        // DELETE
        public async Task<bool> DeleteStudentAsync(int id)
        {
            var student = _students.FirstOrDefault(s => s.Id == id);
            if (student == null)
                return false;

            _students.Remove(student);
            return await Task.FromResult(true);
        }
    }
}
