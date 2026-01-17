using Abp.Application.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using UserCrud.Core.Entities;
using UserCrud.Students.Dto;

namespace UserCrud.Students
{
    public interface IStudentService : IApplicationService
    {
        Task<List<StudentDto>> GetAllStudentsAsync();
        Task<StudentDto> CreateStudentAsync(CreateStudentDto input);
        Task<StudentDto> UpdateStudentAsync(UpdateStudentDto input);
        Task<bool> DeleteStudentAsync(int id);
    }

}
