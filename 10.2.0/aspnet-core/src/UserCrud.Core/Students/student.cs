using Abp.Domain.Entities.Auditing;
using System;
using UserCrud.Authorization.Users;

namespace UserCrud.Core.Entities
{
    public class Student : FullAuditedEntity<int>
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
    }
}
